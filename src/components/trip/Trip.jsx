import React from 'react'
import { useLocation } from 'react-router-dom'
import { useState , useEffect } from 'react';
import { database } from '../../firebase';
import MapWithRoute from '../Preference/MoreDetailsMap';
import MapWithTrack from './MapWithTrack';
import { LoadScript } from '@react-google-maps/api';
function Trip() {
    const {
        myId,
        guest,
        guestId,
        lobbyId,
        placeId,
        venueCoords

    } = useLocation().state || null
    console.log(venueCoords)

    const [myCurrentLocation, setMyCurrentLocation] = useState(null)
    const [guestCurrentLocation, setGuestCurrentLocation] = useState(null)
    const [iHaveReached, setIHaveReached] = useState(false);
    const [guestHaveReached, setGuestIHaveReached] = useState(false);
    const [error,setError] = useState(false);
    const [destination,setDestination]=useState(null);

    useEffect(()=>{


    },[])

    async function setMyCurLocIntoFireBase(curLocObj)
    {
        let res = await database.users.doc(myId).update({
            curLoc : curLocObj
        })
        // console.log("i am from trip page",res);
    }


    async function fetchMyFriendsLocation() {
        try {
            const userDoc = await database.users.doc(guestId).get();
            if (userDoc.exists) {
                const data = userDoc.data();
                setGuestCurrentLocation(data.curLoc)
            } else {
                setError("Document not found");
            }
        } catch (error) {
            setError(error.message);
            console.error("Error fetching friends location", error);
        }
    }


    useEffect(() => {
        if (navigator.geolocation) {
            const intervalId = setInterval(() => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        setMyCurrentLocation({ lat: latitude, lng: longitude });
                        setMyCurLocIntoFireBase({ lat: latitude, lng: longitude });
                        fetchMyFriendsLocation();
                    },
                    (error) => console.log("Unable to retrieve location", error),
                    {
                        enableHighAccuracy: true,
                        //very frequent requests for location
                        timeout: 100,
                        maximumAge: 0
                    }
                );
            }, 5000); 
            return () => clearInterval(intervalId);
        } else {
            console.log("Geolocation not supported");
        }
    }, []);





  return (
    <div>
        <h1>your location is</h1>
        <p>{myCurrentLocation?.lat}</p>
        <p>{myCurrentLocation?.lng}</p>

        <h1>your friends location is</h1>
        <p>{guestCurrentLocation?.lat}</p>
        <p>{guestCurrentLocation?.lng}</p>
        <LoadScript googleMapsApiKey="AIzaSyDN2sqMBvceRuAkBC0UlZ6KLIrEH9OjK2w" >
            <MapWithTrack myInitialLocation ={myCurrentLocation} partnerInitialLocation={guestCurrentLocation} destinationLocation={venueCoords[0]} />
        </LoadScript>

    </div>
  )
}

export default Trip