import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { database } from '../../firebase';
import MapWithTrack from './MapWithTrack';
import { LoadScript } from '@react-google-maps/api';

function Trip() {
    const { myId, guestId, venueCoords } = useLocation().state || null;

    const [myCurrentLocation, setMyCurrentLocation] = useState(null);
    const [guestCurrentLocation, setGuestCurrentLocation] = useState(null);
    const [error, setError] = useState(false);

    // Using refs to avoid unnecessary re-renders in MapWithTrack
    const myLocationRef = useRef(null);
    const guestLocationRef = useRef(null);

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
                    { enableHighAccuracy: true, timeout: 100, maximumAge: 0 }
                );
            }, 15000);
            return () => clearInterval(intervalId);
        } else {
            console.log("Geolocation not supported");
        }
    }, []);

    return (
        <div>
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
