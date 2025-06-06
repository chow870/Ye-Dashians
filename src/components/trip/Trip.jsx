import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import MapWithTrack from './MapWithTrack';
import { LoadScript } from '@react-google-maps/api';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:8000');

function Trip() {
  const { myId, guestId, venueCoords, lobbyId } = useLocation().state || {};
  console.log("Trip component received:", { myId, guestId, venueCoords, lobbyId });

  const [myCurrentLocation, setMyCurrentLocation] = useState(null);
  const [guestCurrentLocation, setGuestCurrentLocation] = useState(null);
  const [theyHaveMet, setTheyHaveMet] = useState(false);
  const [iHaveReached, setIHaveReached] = useState(false);
  const [guestHaveReached, setGuestHaveReached] = useState(false);

  const [friendHasReachedAlert, setFriendHasReachedAlert] = useState(false);
  const [iHasReachedAlert, setIHasReachedAlert] = useState(false);
  const [theyHaveMetAlert, setTheyHaveMetAlert] = useState(false);

  const myLocationRef = useRef(null);
  const guestLocationRef = useRef(null);

  // Haversine helper (no change):
  function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // 1) Join room, listen for friend location, send own location, cleanup singularly
  useEffect(() => {
    if (!lobbyId || !myId || !guestId) return;

    socket.emit("join_room", lobbyId);
    socket.on("update_friend_location", (data) => {
        console.log("[frontend] inside the controller to update_friend_location", data);
      if (data.userId === guestId) {
        console.log("[frontend] Received friend's location update:", data.location);
        setGuestCurrentLocation(data.location);
        guestLocationRef.current = data.location;
      }
    });

    let intervalId = null;
    if (navigator.geolocation) {
      intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationObj = { lat: latitude, lng: longitude };

            // Check if **I** have reached the venue
            if (
              venueCoords &&
              venueCoords.length > 0 &&
              haversineDistance(
                latitude,
                longitude,
                venueCoords[0].lat,
                venueCoords[0].lng
              ) <= 20
            ) {
              if (!iHaveReached) {
                setIHaveReached(true);
                setIHasReachedAlert(true);
              }
            }

            // Only emit if moved enough
            if (
              !myLocationRef.current ||
              Math.abs(myLocationRef.current.lat - latitude) > 0.0001 ||
              Math.abs(myLocationRef.current.lng - longitude) > 0.0001
            ) {
              setMyCurrentLocation(locationObj);
              myLocationRef.current = locationObj;
              socket.emit("change_in_location", {
                userId: myId,
                lobbyId: lobbyId,
                location: locationObj,
              });
            }
          },
          (err) => console.log("Unable to retrieve location", err),
          { enableHighAccuracy: true, timeout: 1000, maximumAge: 0 }
        );
      }, 1000);
    } else {
      console.log("Geolocation not supported");
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      socket.off("update_friend_location");
      socket.emit("leave_room", lobbyId);
    };
  }, [lobbyId, myId, guestId, venueCoords, iHaveReached]);

  // 2) Check if friend has reached the venue whenever their location updates
  useEffect(() => {
    if (
      guestCurrentLocation &&
      venueCoords &&
      venueCoords.length > 0
    ) {
      const { lat, lng } = guestCurrentLocation;
      const { lat: vLat, lng: vLng } = venueCoords[0];
      const dis = haversineDistance(lat, lng, vLat, vLng);
      if (dis <= 20 && !guestHaveReached) {
        setGuestHaveReached(true);
        setFriendHasReachedAlert(true);
      }
    }
  }, [guestCurrentLocation, venueCoords, guestHaveReached]);

  // 3) Check if they’ve met whenever both current locations are defined
  useEffect(() => {
    
    if (myCurrentLocation && guestCurrentLocation) {
      const { lat: lat1, lng: lng1 } = myCurrentLocation;
      const { lat: lat2, lng: lng2 } = guestCurrentLocation;
      const dis = haversineDistance(lat1, lng1, lat2, lng2);
      if (dis <= 20 && !(theyHaveMet)) {
        setTheyHaveMet(true);
        // Only show the “you both have arrived” alert if I’ve reached AND guest has reached
        if (iHaveReached && guestHaveReached) {
          setTheyHaveMetAlert(true);
        }
      }
    }
  }, [myCurrentLocation, guestCurrentLocation, iHaveReached, guestHaveReached, theyHaveMet]);

  return (
    <div>
      <Collapse in={friendHasReachedAlert && guestHaveReached}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setFriendHasReachedAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Your friend has almost reached the destination
        </Alert>
      </Collapse>

      <Collapse in={iHasReachedAlert && iHaveReached}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setIHasReachedAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          You have almost reached the destination
        </Alert>
      </Collapse>

      <Collapse in={theyHaveMetAlert && theyHaveMet && iHaveReached && guestHaveReached}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setTheyHaveMetAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          You both have arrived at the desired place!
        </Alert>
      </Collapse>

      <h1>Your Location</h1>
      <p>Latitude: {myCurrentLocation?.lat}</p>
      <p>Longitude: {myCurrentLocation?.lng}</p>

      <h1>Friend’s Location</h1>
      <p>Latitude: {guestCurrentLocation?.lat}</p>
      <p>Longitude: {guestCurrentLocation?.lng}</p>

      <LoadScript googleMapsApiKey={"AIzaSyDN2sqMBvceRuAkBC0UlZ6KLIrEH9OjK2w"}>
        <MapWithTrack
          myInitialLocation={myCurrentLocation}
          partnerInitialLocation={guestCurrentLocation}
          destinationLocation={venueCoords?.[0]}
        />
      </LoadScript>
    </div>
  );
}

export default Trip;
