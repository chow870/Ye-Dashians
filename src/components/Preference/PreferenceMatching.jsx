import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

function PrefernceMatching() {
    const [results, setResults]= useState([]); // it will be an array of object // one this will be tags that i wil display and other will be just for further matching
    const [tempResult,setTempResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [coordinate2,setCoordinate2]=useState(null);
    const [othersPreference,setOthersPreference]= useState({}); // will be helpful, Agle wale page mai help karega.

    const location = useLocation();

    const {slotId,myId,mylocation,guestId,preference } = location.state || {};

    // self user ki toh location,userid and location {} toh hai hi.
    // dusre wale kai liye preference model wale sai fetch karna parega slot id , useri sai jo uss user ki hai
    // or you may store it in the form of object
    // I may get it from the props also.


// this is meant for the individual ones in which on his basis i will be able to look for the options available for individual user.
    useEffect(()=>{
        const  FetchCoordinates = async ()=> {
            try{
                let response = await fetch(`/api/v1/fetchCoordinates?slotId=${slotId}&userId=${guestId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
        
                if(response.ok){
                    let result = await response.json();
                    setCoordinate2(result.preference.location);
                    setOthersPreference(result.preference);
                }
                else{
                    if(response.status== 404 ){
                    console.log("entered the try block of FetchCoordinates but the response was not okay");
                    console.log("Record not found within the timeout period {60 secs}")
                    alert("plz ask Your partner to fill his/her preferences")
                }
                else{
                    console.log("status was 500, some error in finding the second user")
                }
                }
            }

            catch(error){
                console.log("there was some error : ", error);
            }
            
        }
    })
    useEffect(async ()=>{
        if(coordinate2 == null) return
        let searchLat = (mylocation.lat + coordinate2.lat) / 2;
        let searchLng = (mylocation.lng + coordinate2.lng) / 2;
        try {
            // Main loop for preferences
            preference.typeOfPlaces.forEach((element) => {
               
                preference.ambience.forEach(async (ambience) => {
                    try {
                        // Fetch the API data for each combination of `type` and `ambience`
                        let response = await fetch(`/maps/v1/NearbySearch?lat=${searchLat}&lng=${searchLng}&type=${element}&keyword=${ambience}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });
        
                        if (response.ok) {
                            let result = await response.json();
                            console.log("received one of the responses of 2 loops on the preferenceMatching.jsx : ", result)
        
                            // Process each result item
                            result.data.forEach((r) => {
                                setTempResult((prev) => {
                                    
                                    if (!prev) prev = [];
        
                                    let foundIt = false;
    
                                    const updatedPrev = prev.map((item) => {
                                        if (item.place_id === r.place_id) {
                                            foundIt = true;
                                            return {
                                                ...item,
                                                tags: [...item.tags, ambience], 
                                            };
                                        }
                                        return item;
                                    });
                                    if (!foundIt) {
                                        return [...updatedPrev, { ...r, tags: [ambience] }];
                                    } else {
                                        return updatedPrev; 
                                    }
                                });
                            });
                        }
                    } catch (error) {
                        console.error("Inner fetch error:", error);
                    }
                });
                preference.foodPreference.forEach(async (ambience) => {
                    try {
                        // Fetch the API data for each combination of `type` and `ambience`
                        let response = await fetch(`/maps/v1/NearbySearch?lat=${searchLat}&lng=${searchLng}&type=${element}&keyword=${ambience}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });
                        
                        if (response.ok) {
                            let result = await response.json();
        
                            // Process each result item
                            result.data.forEach((r) => {
                                setTempResult((prev) => {
                                    // Initialize prev as an empty array if it is null
                                    if (!prev) prev = [];
        
                                    let foundIt = false;
        
                                    // Map through prev to see if the place_id already exists
                                    const updatedPrev = prev.map((item) => {
                                        if (item.place_id === r.place_id) {
                                            foundIt = true;
                                            return {
                                                ...item,
                                                tags: [...item.tags, ambience], // Add ambience to tags immutably
                                            };
                                        }
                                        return item;
                                    });
        
                                    // If not found, add the new result with initial tags
                                    if (!foundIt) {
                                        return [...updatedPrev, { ...r, tags: [ambience] }];
                                    } else {
                                        return updatedPrev; // Return the updated array
                                    }
                                });
                            });
                        }
                    } catch (error) {
                        console.error("Inner fetch error:", error);
                    }
                });

                setTempResult(async (prev) => {
                    if (!prev) return []; 
                    const updatedResults = await Promise.all(
                        prev.map(async (item) => {
                            try {
                                let response = await fetch(); 
                                if (response.ok) {
                                    let result = await response.json();
                
                                    // Merge the result with the existing item details
                                    return {
                                        ...item,
                                        ...result.additionalDetails,
                                        ...result.distances 
                                    };
                                } else {
                                    return item;
                                }
                            } catch (error) {
                                console.error("Error fetching details:", error);
                                
                                return item;
                            }
                        })
                    );
                
                    // Return the fully updated array
                    return updatedResults;
                });

                setResults((prev)=>{
                    return [...prev, {typeOfPlaces:element, result :tempResult}]
                })
                setTempResult(null)

            });
            // time to hit the backend to store the details
            try {
                console.log("Reached the PreferenceMatchingSubmission", results);
        
                const response = await fetch(`/api/v1/preferenceMatching?slotId=${slotId}&myId=${myId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"  // Ensure JSON headers are set
                    },
                    body: JSON.stringify(results)  // Send preferenceData directly, not in an array
                });
        
                if (response.ok) {
                    const result = await response.json();
                    console.log('Response from server:', result);
                    setNextPageBol(true);
                } else {
                    console.error('Failed to submit preferences:', response.statusText);
                }
            } catch (error) {
                console.error('Error in PreferenceMAthcingSubmission:', error);
            }
            }
        catch (error) {
            console.error("Outer error:", error);
        }

    
    },[coordinate2])
    if(loading){
        return (
            <h1>We are trying to find the best match for you.</h1>
        )
    }
    else{
        // navigate to thenext page.
    }
  return (
    <></>
  )
}

export default PrefernceMatching