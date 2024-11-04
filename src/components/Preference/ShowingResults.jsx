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
    console.log("the common options are : ", commonOptions);
    return (
        <div className="flex flex-col md:flex-row justify-around space-y-8 md:space-y-0 w-full">
    <div className="flex flex-col w-full md:w-1/2 p-4 space-y-4">
        <h2 className="text-xl font-bold">Showing Results</h2>

        {/* Display common preferences */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Common Preferences</h3>
            {commonPreference.length > 0 ? (
                <ul className="list-disc list-inside">
                    {commonPreference.map((place, index) => (
                        <li key={index}>{place}</li>
                    ))}
                </ul>
            ) : (
                <p>No common preferences found.</p>
            )}
        </div>

        {/* Display common options */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Common Options</h3>
            {commonOptions.length > 0 ? (
                <div className="carousel carousel-center bg-neutral rounded-box max-w-md space-x-4 p-4">
                    {commonOptions.map((item, index) => (
                        <div key={index} className="carousel-item flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
                            <p className="font-semibold">{item.name}</p>
                            <p>Opened Now: {item.open_now ? 'Yes' : 'No'}</p>
                            <p>Ratings: {item.rating}</p>
                            <p>Tags: {item.tags}</p>
                            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">More Details</button>
                            <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">Suggest Your Partner</button>
                        </div>
                    ))}
                </div>
            ) : (
                <h1>Nothing to show</h1>
            )}
        </div>
    </div>

    {/* Your Options */}
    <div className="flex flex-col w-full md:w-1/2 p-4 space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Your Options</h3>
            <div className="carousel carousel-center bg-neutral rounded-box max-w-md space-x-4 p-4">
                {myoptions.map((item, index) => (
                    <div key={index} className="carousel-item flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
                        <p className="font-semibold">{item.name}</p>
                        <p>Opened Now: {item.open_now ? 'Yes' : 'No'}</p>
                        <p>Ratings: {item.rating}</p>
                        <p>Tags: {item.result.tags}</p>
                        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">More Details</button>
                        <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">Suggest Your Partner</button>
                    </div>
                ))}
            </div>
        </div>

        {/* Suggestions by Partner */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Suggested By Your Partner</h3>
            <p>I will maintain an array of place IDs suggested by your partner.</p>
            <p>I will find it from the othersOptions and give you the option to finalize.</p>
        </div>
    </div>
</div>

    );
}
