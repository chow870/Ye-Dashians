import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  LoadScript,
  TrafficLayer,
} from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import EventNearby from './EventNearby';
import Aqi from './Aqi';

const libraries = ['places', 'geometry'];

const MyMapComponent = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }

    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setCurrentLocation({ lat: latitude, lng: longitude });
    }

    function error() {
      console.log("Unable to retrieve your location");
    }
  }, []);

  if (!currentLocation) {
    return <p>Loading your location...</p>;
  }

  return (
    <div className="flex h-screen">
      {/* Map Section */}
      <div className="w-1/2 h-full">
        <div className="flex flex-col h-full">
          <button
            type="button"
            onClick={() => map.panTo(currentLocation)}
            className="p-2 bg-pink-400 text-white m-2"
          >
            Recentre
          </button>
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
      </div>

      {/* Sidebar Section */}
      <div className="w-1/2 h-full p-4 overflow-y-auto">
        <Aqi />
        <div className="h-1/3 w-full border-2 border-black rounded-lg shadow-lg bg-red-200">
          <p>Here i will display Suggested places </p>
        </div>
        {/* <div class="ae-embed-org-plugin" data-type="org" data-title="false" data-id="25036600" data-height="" data-width="" data-transparency="true" data-header="0" data-border="0" data-layout="center" data-aff="u0" style="width: 100%;"></div> */}
        <EventNearby />
        <div className="h-32 w-full border-2 border-black my-4 p-4 flex items-center justify-center">
          <Link to="/showlobbies">
            <button className="bg-blue-500 text-white p-2 rounded">
              Connect with your friend
            </button>
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
