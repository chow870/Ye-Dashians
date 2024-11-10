import React, { useEffect, useState, useMemo, useRef } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

// Example map style (retro theme)
const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c9c9c9' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  // Additional styling options can go here
];

function MapWithRoute({ myLocation, lat, lng }) {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const mapRef = useRef(null);

  // Memoize destinationLocation to avoid recreation on every render
  const destinationLocation = useMemo(() => ({ lat, lng }), [lat, lng]);

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
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);

          // Automatically adjust the map bounds to fit the route
          if (mapRef.current) {
            const bounds = new window.google.maps.LatLngBounds();
            result.routes[0].overview_path.forEach((path) => bounds.extend(path));
            mapRef.current.fitBounds(bounds);
          }
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={myLocation} // Initial center
      zoom={13}
      options={{
        styles: mapStyles, // Applying the custom map style
        disableDefaultUI: true, // Optionally hide default UI
      }}
      onLoad={(map) => (mapRef.current = map)}
    >
      {/* Marker for My Location */}
      <Marker position={myLocation} label="A" />

      {/* Marker for Destination */}
      <Marker position={destinationLocation} label="B" />

      {/* Route from My Location to Destination */}
      {directionsResponse && (
        <DirectionsRenderer
          directions={directionsResponse}
          options={{
            polylineOptions: {
              strokeColor: '#FF5733', // Set your preferred route color
              strokeOpacity: 0.8,
              strokeWeight: 5,
            },
            preserveViewport: true, // Prevent auto-zoom to fit the route
          }}
        />
      )}
    </GoogleMap>
  );
}

export default MapWithRoute;
