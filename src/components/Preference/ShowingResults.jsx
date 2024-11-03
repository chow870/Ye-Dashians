import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function ShowingResults() {
    const [commonOptions, setCommonOptions] = useState([]);
    const [othersOption, setOthersOptions] = useState([]);
    const [commonPreference, setCommonPreference] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const {
        slotId,
        myId,
        mylocation,
        preferencemy,
        guestId,
        guestlocation,
        preferenceother,
        myoptions,
    } = location.state || {};

    console.log("Reached the ShowingResults page with ", slotId, myId, mylocation, preferencemy, guestId, guestlocation, preferenceother, myoptions);

    // Fetch the guest's preferences from the backend
    useEffect(() => {
        const fetchOtherPreferences = async () => {
            console.log("About to hit the backend to fetch other preferences");
            try {
                const response = await fetch(`/api/v1/fetchOthersPreference?slotId=${slotId}&userId=${guestId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    setOthersOptions(result.data.results);
                    console.log("Other options have been set");
                } else if (response.status === 404) {
                    console.log("Record not found, please ask your partner to fill in their preferences.");
                    alert("Please ask your partner to fill in their preferences.");
                } else {
                    console.log("Server error occurred while fetching the second user's data");
                }
            } catch (error) {
                console.log("There was an error:", error);
            }
        };

        fetchOtherPreferences();
    }, [slotId, guestId]);

    // Calculate common preferences and common options based on preferences
    useEffect(() => {
        if (othersOption.length === 0) return; // Exit if othersOption is not yet populated

        console.log("Entered the second useEffect of Showing Results with preferenceother:", preferenceother);
        console.log("The othersOption is:", othersOption);

        const commonPref = [];
        const commonOpts = [];

        // Find common typeOfPlace preferences
        preferencemy.typeOfPlace.forEach((element) => {
            if (preferenceother.typeOfPlace.includes(element)) {
                commonPref.push(element);
            }
        });

        setCommonPreference(commonPref);

        // Find common places based on common preferences
        commonPref.forEach((placeType) => {
            const myPlace = myoptions.find((opt) => opt.typeOfPlace === placeType);
            const otherPlace = othersOption.find((opt) => opt.typeOfPlace === placeType);

            if (myPlace && otherPlace) {
                myPlace.result.forEach((myItem) => {
                    otherPlace.result.forEach((otherItem) => {
                        if (myItem.place_id === otherItem.place_id) {
                            // Push unique results
                            if (!commonOpts.some(opt => opt.place_id === myItem.place_id)) {
                                commonOpts.push(myItem);
                            }
                        }
                    });
                });
            }
        });

        setCommonOptions(commonOpts);
        setLoading(false);

    }, [othersOption, preferencemy, preferenceother, myoptions]);

    // Loading message
    if (loading) {
        return (<h1>We are trying our best to give you the best suggestions...</h1>);
    }

    // Render the results
    return (
        <div>
            <h2>Showing Results</h2>

            {/* Display common preferences */}
            <div>
                <h3>Common Preferences</h3>
                {commonPreference.length > 0 ? (
                    <ul>
                        {commonPreference.map((place, index) => (
                            <li key={index}>{place}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No common preferences found.</p>
                )}
            </div>

            {/* Display common options */}
            <div>
                <h3>Common Options</h3>
                {commonOptions.length > 0 ? (
                    <ul>
                        {commonOptions.map((option, index) => (
                            <li key={index}>{option.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No common options found.</p>
                )}
            </div>

            {/* Placeholder for custom cards and chat options */}
            <div>
                <h3>Other Options</h3>
                {/* You could add code here to display other options if needed */}
            </div>
        </div>
    );
}
