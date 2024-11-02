import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Autocomplete,
  LoadScript,
  TrafficLayer,
  Polyline
} from '@react-google-maps/api';

import { Link } from 'react-router-dom';
import EventNearby from './EventNearby';
import Aqi from './Aqi';

const libraries = ['places', 'geometry'];
// const routeColors = ['#1E90FF', '#FF6347', '#32CD32'];

const MyMapComponent = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(()=>{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.log("Geolocation not supported");
      }
      
      function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        // console.log(Latitude: ${latitude}, Longitude: ${longitude});
        setCurrentLocation({lat: latitude, lng:longitude});
        setOriginInput({lat: latitude, lng:longitude})
        
      }
      function error() {
        console.log("Unable to retrieve your location");
      }
  },[])

  if (!currentLocation) {
    return <p>Loading your location...</p>;
  }

  return (
    <div className='flex flex-row'>
    <div className="flex flex-col justify-center w-2/4 h-screen p-1">
      <span className="p-2 flex flex-col bg-transparent">
        <button
            type="button"
            onClick={() => map.panTo(currentLocation)}
            className="p-1 bg-pink-400 text-white"
          >
            Recentre
          </button>
      </span>
      <GoogleMap
        center={currentLocation}
        zoom={12}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        onLoad={(map) => setMap(map)}
      >
        <Marker position={currentLocation} />
        <TrafficLayer />
      </GoogleMap>    
    </div>
    <div className='flex flex-col'>
    <Aqi/>
    <div className='h-64 w-96 border-2 border-black mx-5 my-2'>Previous visited : Backend wala kaam hai yaha par. aak state variable and .map karn hai bas</div>
    <EventNearby />
    <div className='h-32 w-96 border-2 border-black mx-5 my-2'>
      <Link to='/showlobbies'>
        <button>Connect with your friend</button>
      </Link>
    </div>
    </div>
   

    </div>
   
  );
};

const MapWrapper = () => (
  <LoadScript googleMapsApiKey="AIzaSyDN2sqMBvceRuAkBC0UlZ6KLIrEH9OjK2w" libraries={libraries}>
    <MyMapComponent />
    
  </LoadScript>
);

export default MapWrapper;
