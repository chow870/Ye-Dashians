import React, { useEffect, useState, useMemo } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

function MapWithRoute({ myLocation, lat, lng }) {
  const [directionsResponse, setDirectionsResponse] = useState(null);

  // Memoize destinationLocation so it doesn't recreate on every render
  const destinationLocation = useMemo(() => ({ lat, lng }), [lat, lng]);
  console.log(destinationLocation);

  useEffect(() => {
    if (window.google && window.google.maps && myLocation && destinationLocation) {
      calculateRoute();
    }
  }, [myLocation, destinationLocation]);

  const calculateRoute = () => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: myLocation,
        destination: destinationLocation,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  };

  // Render the map only if the Google Maps API is loaded
  if (!window.google || !window.google.maps) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={myLocation}
      zoom={13}
    >
      {/* Marker for My Location */}
      <Marker position={myLocation} label="A" />

      {/* Marker for Destination */}
      <Marker position={destinationLocation} label="B" />

      {/* Route from My Location to Destination */}
      {directionsResponse && (
        <DirectionsRenderer directions={directionsResponse} />
      )}
    </GoogleMap>
  );
}

export default MapWithRoute;
