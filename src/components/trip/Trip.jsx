import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { database } from '../../firebase';
import MapWithTrack from './MapWithTrack';
import { LoadScript } from '@react-google-maps/api';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';
import Snackbar from '@mui/material/Snackbar';
function Trip() {
    const { myId, guestId, venueCoords } = useLocation().state || null;

    const [myCurrentLocation, setMyCurrentLocation] = useState(null);
    const [guestCurrentLocation, setGuestCurrentLocation] = useState(null);
    const [error, setError] = useState(false);

    // Using refs to avoid unnecessary re-renders in MapWithTrack
    const myLocationRef = useRef(null);
    const guestLocationRef = useRef(null);
    const [theyHaveMet , setTheyHaveMet] = useState(false);
    const [iHaveReached,setIHaveReached] = useState(false);
    const [guestHaveReached,setGuestHaveReached] = useState(false);
    const [friendHasReachedAlert, setFriendHasReachedAlert] = useState(true);
    const [iHasReachedAlert, setIHasReachedAlert] = useState(true);
    const [theyHaveMetAlert,setTheyHaveMetAlert] = useState(true);
    
	


    //for calculation of area circle
    function haversineDistance(lat1, lng1, lat2, lng2) {
        const R = 6371000; // Radius of Earth in meters
        const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
        const dLng = (lng2 - lng1) * (Math.PI / 180);
    
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in meters
    }


    async function setMyCurLocIntoFireBase(curLocObj) {
        try {
            await database.users.doc(myId).update({
                curLoc: curLocObj
            });
        } catch (error) {
            console.error("Error updating location in Firebase", error);
        }
    }

    async function fetchMyFriendsLocation() {
        try {
            const userDoc = await database.users.doc(guestId).get();
            if (userDoc.exists) {
                const data = userDoc.data();
                //dekho , agar mai kisi aur jgah par guest ke coords ki (guestCurrentLocation) ko access karunga toh dikkat hogi kyoki state updates asynchroous rehte hai
                // kahi aur access karunga toh ho sakta hai woh value na mile jo mujhe chahiye
                //thats why fetch karte samaya hi set karna will be best
                let lat1 = data.curLoc.lat;
                let lng1 = data.curLoc.lng;
                let lat2 = venueCoords[0].lat;
                let lng2 = venueCoords[0].lng;
                let dis =   haversineDistance(lat1,lng1,lat2,lng2);
                if(dis<=20)
                {
                    setGuestHaveReached(true);
                }
                setGuestCurrentLocation(data.curLoc);
                guestLocationRef.current = data.curLoc;
            } else {
                setError("Document not found");
            }
        } catch (error) {
            setError(error.message);
            console.error("Error fetching friend's location", error);
        }
    }

    useEffect(() => {
        if (navigator.geolocation) {
            const intervalId = setInterval(() => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        const locationObj = { lat: latitude, lng: longitude };
                        let lat1 = latitude;
                        let lng1 = longitude;
                        let lat2 = venueCoords[0].lat;
                        let lng2 = venueCoords[0].lng;
                        let dis =   haversineDistance(lat1,lng1,lat2,lng2);
                        // console.log("dis is",dis)
                        // console.log("dis is",haversineDistance(37.7749, -122.4194, 37.774950, -122.4194));
                        if(dis<=20)
                        {
                            setIHaveReached(true);
                            
                        }

                        // Update state and refs only if location has significantly changed
                        if (!myLocationRef.current || 
                            Math.abs(myLocationRef.current.lat - latitude) > 0.0001 || 
                            Math.abs(myLocationRef.current.lng - longitude) > 0.0001) {
                            setMyCurrentLocation(locationObj);
                            myLocationRef.current = locationObj;
                            setMyCurLocIntoFireBase(locationObj);

                        }

                        fetchMyFriendsLocation();
                    },
                    (error) => console.log("Unable to retrieve location", error),
                    { enableHighAccuracy: true, timeout: 1000, maximumAge: 0 }
                );
            }, 10000);
            return () => clearInterval(intervalId);
        } else {
            console.log("Geolocation not supported");
        }
    }, []);


    //useEffect hook for chekcing if they hve met or not 
    useEffect(() => {
        let lat1 = myCurrentLocation?.lat;
        let lng1 = myCurrentLocation?.lng;
        let lat2 = guestCurrentLocation?.lat;
        let lng2 = guestCurrentLocation?.lng;
        let dis = haversineDistance(lat1, lng1, lat2, lng2);
        
        if (dis <= 20) {
            setTheyHaveMet(true);
        }
    }, [guestCurrentLocation, myCurrentLocation])



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
                    Your have almost reached the destination
                </Alert>
            </Collapse>
            <Collapse in={theyHaveMetAlert && (theyHaveMet && (iHaveReached && guestHaveReached))}>
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
                    You Both have arrived to the desired Place!
                </Alert>
            </Collapse>
            <h1>Your Location</h1>
            <p>Latitude: {myCurrentLocation?.lat}</p>
            <p>Longitude: {myCurrentLocation?.lng}</p>

            <h1>Friend's Location</h1>
            <p>Latitude: {guestCurrentLocation?.lat}</p>
            <p>Longitude: {guestCurrentLocation?.lng}</p>

            {/* LoadScript is loaded only once to prevent reloading issues */}
            <LoadScript googleMapsApiKey="AIzaSyDN2sqMBvceRuAkBC0UlZ6KLIrEH9OjK2w">
                <MapWithTrack 
                    myInitialLocation={myCurrentLocation} 
                    partnerInitialLocation={guestCurrentLocation} 
                    destinationLocation={venueCoords[0]} 
                />
            </LoadScript>
        </div>
    );
}

export default Trip;
