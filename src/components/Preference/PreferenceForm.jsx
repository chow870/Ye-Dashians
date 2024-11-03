import { Autocomplete, LoadScript } from '@react-google-maps/api';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const libraries = ['places', 'geometry'];

function PreferenceForm() {
    const [preference, setPreference] = useState(null);
    const [originInput, setOriginInput] = useState(null);
    const originRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [nextPagebol,setNextPageBol]= useState(false);
    const { slotId, myId, guestId } = location.state || {};

    useEffect(() => {
        console.log("Reached the PreferenceForm component");
    }, []);

    const handleOriginChange = () => {
        const place = originRef.current.getPlace();
        if (place && place.geometry) {
            const location = place.geometry.location;
            setOriginInput({ lat: location.lat(), lng: location.lng() });
        }
    };

    const HandleBackendPreferenceSubmission = async (preferenceData) => {
    try {
        console.log("Reached the HandleBackendPreferenceSubmission", preferenceData);

        const response = await fetch(`/api/v1/preferenceSubmit?slotId=${slotId}&myId=${myId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"  // Ensure JSON headers are set
            },
            body: JSON.stringify(preferenceData)  // Send preferenceData directly, not in an array
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Response from server:', result);
            setNextPageBol(true);
        } else {
            console.error('Failed to submit preferences:', response.statusText);
        }
    } catch (error) {
        console.error('Error in HandleBackendPreferenceSubmission:', error);
    }
};


    const handlePreferenceSubmission = () => {
        const tempPreference = {
            typeOfPlace: Array.from(document.getElementById('TypeOfPlace').selectedOptions).map(option => option.value),
            ambience: Array.from(document.getElementById('Ambience').selectedOptions).map(option => option.value),
            foodPreference: Array.from(document.getElementById('foodPreference').selectedOptions).map(option => option.value),
            otherServices: Array.from(document.getElementById('Services').selectedOptions).map(option => option.value),
            location:originInput
        };

        setPreference(tempPreference);
        HandleBackendPreferenceSubmission([tempPreference]);
    };

    useEffect(() => {
        if (nextPagebol) {
            console.log("Updated preference:", preference);
            navigate('/preference/matching',{
              state:{
                  slotId:slotId,
                  myId:myId,
                  mylocation:originInput,
                  preference:preference,
                  guestId:guestId
              }})
        }
    }, [preference,nextPagebol]);

    return (
        <div>
            <LoadScript googleMapsApiKey="AIzaSyDN2sqMBvceRuAkBC0UlZ6KLIrEH9OjK2w" libraries={libraries}>
                <Autocomplete onLoad={(ref) => (originRef.current = ref)} onPlaceChanged={handleOriginChange}>
                    <input
                        type="text"
                        className="bg-slate-100"
                        placeholder="Search Your Current Location"
                    />
                </Autocomplete>
                <h2>Preference Form</h2>

                <label htmlFor="TypeOfPlace">Select For the Type of Place:</label>
                <select id='TypeOfPlace' name='TypeOfPlace' multiple required>
                    <option value="cafe">Cafe/Coffee Shop/Tea Shop</option>
                    <option value="bakery">Bakery</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="park">Park</option>
                    <option value="bar">Bar</option>
                </select>

                <label htmlFor="Ambience">Select For the Ambience:</label>
                <select id='Ambience' name='Ambience' multiple>
                    <option value="quiet||peaceful||relaxed">Cozy/Relaxed/Peaceful</option>
                    <option value="lively||music">Lively/Music</option>
                    <option value="indoor">Indoors</option>
                    <option value="outdoor">Outdoors</option>
                </select>

                <label htmlFor="foodPreference">Select For the Food Preference:</label>
                <select id='foodPreference' name='foodPreference'>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="any">No Restrictions</option>
                </select>

                <label htmlFor="Services">Select For Other Services:</label>
                <select id='Services' name='Services' multiple>
                    <option value="delivery">Delivery</option>
                    <option value="dine_in">Dine In</option>
                    <option value="serves_dinner">Serves Dinner</option>
                    <option value="takeout">Take Out</option>
                </select>

                <button onClick={handlePreferenceSubmission}>
                    Submit
                </button>
            </LoadScript>
        </div>
    );
}

export default PreferenceForm;
