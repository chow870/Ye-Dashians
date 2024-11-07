import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

// Night mode map style
const nightModeStyles = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#383838' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#1f2937' }]
  }
  // Additional night mode styles can be added
];

function MapWithTrack({ myInitialLocation, partnerInitialLocation, destinationLocation }) {
  const [myDirections, setMyDirections] = useState(null);
  const [partnerDirections, setPartnerDirections] = useState(null);

  // Update routes whenever locations or destination change
  useEffect(() => {
    if (window.google && window.google.maps && myInitialLocation && partnerInitialLocation && destinationLocation) {
      calculateRoute(myInitialLocation, destinationLocation, setMyDirections);
      calculateRoute(partnerInitialLocation, destinationLocation, setPartnerDirections);
    }
  }, [myInitialLocation, partnerInitialLocation, destinationLocation]);

  const calculateRoute = (origin, destination, setDirections) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
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
      center={destinationLocation}
      zoom={13}
      options={{
        styles: nightModeStyles, // Applying night mode style
        disableDefaultUI: true, // Hide default UI elements
      }}
    >
      {/* Marker for My Location */}
      <Marker position={myInitialLocation} label="Me" icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }} />

      {/* Marker for Partner's Location */}
      <Marker position={partnerInitialLocation} label="Partner" icon={{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" }} />

      {/* Marker for Destination Location */}
      <Marker position={destinationLocation} label="Destination" icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} />

      {/* Route from My Location to Destination */}
      {myDirections && (
        <DirectionsRenderer
          directions={myDirections}
          options={{
            polylineOptions: {
              strokeColor: '#FF0000', // Red color for your route
              strokeOpacity: 0.8,
              strokeWeight: 5
            }
          }}
        />
      )}

      {/* Route from Partner's Location to Destination */}
      {partnerDirections && (
        <DirectionsRenderer
          directions={partnerDirections}
          options={{
            polylineOptions: {
              strokeColor: '#00FF00', // Green color for partner's route
              strokeOpacity: 0.8,
              strokeWeight: 5
            }
          }}
        />
      )}
    </GoogleMap>
  );
}

export default MapWithTrack;
