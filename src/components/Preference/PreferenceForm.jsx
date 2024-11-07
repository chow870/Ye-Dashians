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
    const [nextPagebol, setNextPageBol] = useState(false);
    const [step, setStep] = useState(1); // Track current step
    const { slotId, myId, guestId,eventDetails } = location.state || {};

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
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(preferenceData)
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
            location: originInput
        };

        setPreference(tempPreference);
        HandleBackendPreferenceSubmission([tempPreference]);
    };

    useEffect(() => {
        if (nextPagebol) {
            console.log("Updated preference:", preference);
            navigate('/preference/matching', {
                state: {
                    slotId: slotId,
                    myId: myId,
                    mylocation: originInput,
                    preference: preference,
                    guestId: guestId,
                    eventDetails:eventDetails
                }
            })
        }
    }, [preference, nextPagebol]);

    const handleNextStep = () => {
        setStep(step + 1);
    };

    return (
        <div className="bg-black text-white min-h-screen flex items-center justify-center">
            <div className="w-full max-w-3xl bg-gray-900 p-12 rounded-lg shadow-2xl transition-all duration-500 transform scale-105">
                <h2 className="text-3xl font-bold text-center mb-8 text-white tracking-wide">Preference Form</h2>

                {step === 1 && (
                    <div className="animate-fade-in">
                        <label className="block text-xl font-semibold mb-4 text-gray-300" htmlFor="location">Select Your Location:</label>
                        <Autocomplete onLoad={(ref) => (originRef.current = ref)} onPlaceChanged={handleOriginChange}>
                            <input
                                type="text"
                                className="w-full p-4 text-lg bg-gray-800 text-gray-100 rounded-md mb-8 border border-gray-700 focus:ring focus:ring-blue-500"
                                placeholder="Search Your Current Location"
                            />
                        </Autocomplete>
                        <div className="flex justify-end">
                            <button
                                onClick={handleNextStep}
                                disabled={!originInput}
                                className="bg-blue-600 text-white text-lg px-6 py-3 rounded-lg hover:bg-blue-500 transition-all disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in">
                        <label className="block text-xl font-semibold mb-4 text-gray-300" htmlFor="TypeOfPlace">Select the Type of Place:</label>
                        <select
                            id="TypeOfPlace"
                            className="w-full p-4 text-lg bg-gray-800 text-gray-100 rounded-md mb-8 border border-gray-700 focus:ring focus:ring-blue-500"
                            multiple
                            required
                        >
                            <option value="cafe">Cafe/Coffee Shop/Tea Shop</option>
                            <option value="bakery">Bakery</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="park">Park</option>
                            <option value="bar">Bar</option>
                        </select>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(1)}
                                className="bg-gray-600 text-white text-lg px-6 py-3 rounded-lg hover:bg-gray-500 transition-all"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNextStep}
                                className="bg-blue-600 text-white text-lg px-6 py-3 rounded-lg hover:bg-blue-500 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in">
                        <label className="block text-xl font-semibold mb-4 text-gray-300" htmlFor="Ambience">Select the Ambience:</label>
                        <select
                            id="Ambience"
                            className="w-full p-4 text-lg bg-gray-800 text-gray-100 rounded-md mb-8 border border-gray-700 focus:ring focus:ring-blue-500"
                            multiple
                        >
                            <option value="quiet||peaceful||relaxed">Cozy/Relaxed/Peaceful</option>
                            <option value="lively||music">Lively/Music</option>
                            <option value="indoor">Indoors</option>
                            <option value="outdoor">Outdoors</option>
                        </select>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(2)}
                                className="bg-gray-600 text-white text-lg px-6 py-3 rounded-lg hover:bg-gray-500 transition-all"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNextStep}
                                className="bg-blue-600 text-white text-lg px-6 py-3 rounded-lg hover:bg-blue-500 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-fade-in">
                        <label className="block text-xl font-semibold mb-4 text-gray-300" htmlFor="foodPreference">Select Your Food Preference:</label>
                        <select
                            id="foodPreference"
                            className="w-full p-4 text-lg bg-gray-800 text-gray-100 rounded-md mb-8 border border-gray-700 focus:ring focus:ring-blue-500"
                        >
                            <option value="vegetarian">Vegetarian</option>
                            <option value="vegan">Vegan</option>
                            <option value="any">No Restrictions</option>
                        </select>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(3)}
                                className="bg-gray-600 text-white text-lg px-6 py-3 rounded-lg hover:bg-gray-500 transition-all"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNextStep}
                                className="bg-blue-600 text-white text-lg px-6 py-3 rounded-lg hover:bg-blue-500 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="animate-fade-in">
                        <label className="block text-xl font-semibold mb-4 text-gray-300" htmlFor="Services">Select Other Services:</label>
                        <select
                            id="Services"
                            className="w-full p-4 text-lg bg-gray-800 text-gray-100 rounded-md mb-8 border border-gray-700 focus:ring focus:ring-blue-500"
                            multiple
                        >
                            <option value="delivery">Delivery</option>
                            <option value="dine_in">Dine In</option>
                            <option value="serves_dinner">Serves Dinner</option>
                            <option value="takeout">Take Out</option>
                        </select>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(4)}
                                className="bg-gray-600 text-white text-lg px-6 py-3 rounded-lg hover:bg-gray-500 transition-all"
                            >
                                Back
                            </button>
                            <button
                                onClick={handlePreferenceSubmission}
                                className="bg-green-600 text-white text-lg px-6 py-3 rounded-lg hover:bg-green-500 transition-all"
                            >
                                Submit Preferences
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PreferenceForm;
