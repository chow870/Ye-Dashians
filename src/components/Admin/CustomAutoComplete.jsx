import React, { useRef, useState } from 'react';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 40.7128,
  lng: -74.0060,
};

const GoogleMapsAutocomplete = () => {
  const autocompleteRef = useRef(null);
  const [coordinates, setCoordinates] = useState(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      
      setCoordinates({ lat, lng });
      console.log('Selected location coordinates:', lat, lng);
    } else {
      console.log('No geometry available for this place.');
    }
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY" libraries={['places']}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="Enter a location"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `16px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "50%",
              marginLeft: "-120px"
            }}
          />
        </Autocomplete>
        {coordinates && (
          <div style={{ color: 'white', position: 'absolute', top: '10px', left: '10px' }}>
            <p>Latitude: {coordinates.lat}</p>
            <p>Longitude: {coordinates.lng}</p>
          </div>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapsAutocomplete;
