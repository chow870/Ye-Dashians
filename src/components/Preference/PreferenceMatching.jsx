import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PreferenceMatching() {
  const [results, setResults] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [coordinate2, setCoordinate2] = useState(null);
  const [othersPreference, setOthersPreference] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
 const BackendBaseUrl = "https://ye-dashians-backend.onrender.com"
  const { slotId, myId, mylocation, guestId, preference,eventDetails } = location.state || {};
//   console.log("Reached Preference Matching page with:", slotId, myId, mylocation, guestId, preference);

//   to fetch the location 
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(`${BackendBaseUrl}/api/v1/fetchCoordinates?slotId=${slotId}&userId=${guestId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials : "include"
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result.data.preference[0].location)
          console.log(result.data.preference[0])
          setCoordinate2(result.data.preference[0].location);
          setOthersPreference(result.data.preference[0]);
        } else {
          if (response.status === 404) {
            alert("Please ask your partner to fill their preferences.");
          }
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//         console.log(coordinate2);
//         if (coordinate2 == null) return;

//         let searchLat = (mylocation.lat + coordinate2.lat) / 2;
//         let searchLng = (mylocation.lng + coordinate2.lng) / 2;
//         console.log(preference.typeOfPlace); // array
//         console.log(preference.ambience); // array

//         try {
//             const fetchPromises = [];

//             // First loop: typeOfPlace and ambience
//             for (const element of preference.typeOfPlace) {
//                 for (const ambience of preference.ambience) {
//                     fetchPromises.push(
//                         fetch(`/maps/v1/NearbySearch?lat=${searchLat}&lng=${searchLng}&type=${element}&keyword=${ambience}`, {
//                             method: "GET",
//                             headers: { "Content-Type": "application/json" }
//                         })
//                         .then(response => response.ok ? response.json() : Promise.reject(response))
//                         .then(result => {
//                             console.log(result);
//                             result.data.results.forEach((r) => {
//                                 setTempResult((prev) => {
//                                     console.log("the prev is : ", prev)
//                                     if (!prev) prev = [];
//                                     let foundIt = false;
//                                     const updatedPrev = prev.map((item) => {
//                                         if (item.place_id === r.place_id) {
//                                             foundIt = true;
//                                             return { ...item, tags: [...item.tags, ambience] };
//                                         }
//                                         return item;
//                                     });
//                                     return foundIt ? updatedPrev : [...updatedPrev, { ...r, tags: [ambience] }];
//                                 });
//                             });
//                         })
//                         .catch(error => console.error("Inner fetch error for ambience:", error))
//                     );
//                 }

//                 // Second loop: typeOfPlace and foodPreference
//                 for (const food of preference.foodPreference) {
//                     fetchPromises.push(
//                         fetch(`/maps/v1/NearbySearch?lat=${searchLat}&lng=${searchLng}&type=${element}&keyword=${food}`, {
//                             method: "GET",
//                             headers: { "Content-Type": "application/json" }
//                         })
//                         .then(response => response.ok ? response.json() : Promise.reject(response))
//                         .then(result => {
//                             console.log(result);
//                             result.data.results.forEach((r) => {  //result.data.results is an array [... place_id hai]
//                                 setTempResult((prev) => {
//                                     console.log("the prev is : ", prev)
//                                     if (!prev) prev = [];
//                                     let foundIt = false;
//                                     const updatedPrev = prev.map((item) => {
//                                         if (item.place_id === r.place_id) { // 
//                                             foundIt = true;
//                                             return { ...item, tags: [...item.tags, food] };
//                                         }
//                                         return item;
//                                     });
//                                     return foundIt ? updatedPrev : [...updatedPrev, { ...r, tags: [food] }];
//                                 });
//                             });
//                         })
//                         .catch(error => console.error("Inner fetch error for foodPreference:", error))
//                     );
//                 }
//             }

//             await Promise.all(fetchPromises);

//             // Update results after all requests complete
//             setResults((prev) => [...prev, { typeOfPlaces: preference.typeOfPlace, result: tempResult }]);
//             setTempResult(null);

//             // Submit preferences to backend
//             console.log("Reached the PreferenceMatchingSubmission so the result i will submit is : ", results);
//             const response = await fetch(`/api/v1/preferenceMatching?slotId=${slotId}&myId=${myId}`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(results),
//             });

//             if (response.ok) {
//                 const result = await response.json();
//                 console.log('Response from server:', result);
//                 setLoading(false);
//             } else {
//                 console.error('Failed to submit preferences:', response.statusText);
//             }
//         } catch (error) {
//             console.error("Outer error:", error);
//         }
//     };

//     fetchData();
// }, [coordinate2]);


// if (loading) {
//     return <h1>We are trying to find the best match for you.</h1>;
// } else {
//     console.log("Before i navigate you to next page plz see the results once",results)
//     navigate('/preference/results', {
//         state: {
//             slotId,
//             myId,
//             mylocation,
//             preferenceMy: preference,
//             guestId,
//             guestLocation: coordinate2,
//             myOptions: results,
//             preferenceOther: othersPreference,
//         }
//     });
// }

function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }
  
  function toDegrees(radians) {
    return (radians * 180) / Math.PI;
  }
  
  function findMidpoint(location1, location2) {
    const lat1 = toRadians(location1.lat);
    const lon1 = toRadians(location1.lng);
    const lat2 = toRadians(location2.lat);
    const lon2 = toRadians(location2.lng);
  
    // Convert lat/lon to Cartesian coordinates
    const x1 = Math.cos(lat1) * Math.cos(lon1);
    const y1 = Math.cos(lat1) * Math.sin(lon1);
    const z1 = Math.sin(lat1);
  
    const x2 = Math.cos(lat2) * Math.cos(lon2);
    const y2 = Math.cos(lat2) * Math.sin(lon2);
    const z2 = Math.sin(lat2);
  
    // Average the Cartesian coordinates
    const x = (x1 + x2) / 2;
    const y = (y1 + y2) / 2;
    const z = (z1 + z2) / 2;
  
    // Convert the midpoint back to lat/lon
    const centralLon = Math.atan2(y, x);
    const hyp = Math.sqrt(x * x + y * y);
    const centralLat = Math.atan2(z, hyp);
  
    return {
      lat: toDegrees(centralLat),
      lng: toDegrees(centralLon)
    };
  }


useEffect(() => {
    const fetchData = async () => {
        if (coordinate2 == null) return;
        console.log(coordinate2)

        let midpoint = findMidpoint(mylocation,coordinate2);
        console.log("The midpoint calculated is ", midpoint)
        let searchLat = midpoint.lat;
        let searchLng = midpoint.lng;
         if(eventDetails.length  > 0 && !(
    Object.keys(eventDetails[0]).length === 1 &&
    Object.prototype.hasOwnProperty.call(eventDetails[0], "time")
  )){
            console.log("Inside the eventDetails :  ", eventDetails)
            searchLat = eventDetails[0].locationCoordinates.lat;
            searchLng = eventDetails[0].locationCoordinates.lng;
        }
       
        try {
            const fetchPromises = [];

            // Temporary array to store results by typeOfPlace
            const newResults = [];

            // First loop: typeOfPlace and ambience
            for (const element of preference.typeOfPlace) {
                const localTempResult = [];

                for (const ambience of preference.ambience) {
                    fetchPromises.push(
                        fetch(`${BackendBaseUrl}/maps/v1/NearbySearch?lat=${searchLat}&lng=${searchLng}&type=${element}&keyword=${ambience}`, {
                            method: "GET",
                            headers: { "Content-Type": "application/json" }
                        })
                        .then(response => response.ok ? response.json() : Promise.reject(response))
                        .then(result => {
                            result.data.results.forEach((r) => {
                                // Check if place already exists for this typeOfPlace
                                let foundPlace = localTempResult.find(item => item.place_id === r.place_id);

                                if (foundPlace) {
                                    // Update tags if place already exists
                                    foundPlace.tags.push(ambience);
                                } else {
                                    localTempResult.push({ ...r, tags: [ambience] });
                                }
                            });
                        })
                        .catch(error => console.error("Inner fetch error for ambience:", error))
                    );
                }

                newResults.push({ typeOfPlace: element, result: localTempResult });
            }

            // Second loop: typeOfPlace and foodPreference
            for (const element of preference.typeOfPlace) {
                const localTempResult = newResults.find(item => item.typeOfPlace === element)?.result || [];

                for (const food of preference.foodPreference) {
                    fetchPromises.push(
                        fetch(`${BackendBaseUrl}/maps/v1/NearbySearch?lat=${searchLat}&lng=${searchLng}&type=${element}&keyword=${food}`, {
                            method: "GET",
                            headers: { "Content-Type": "application/json" }
                        })
                        .then(response => response.ok ? response.json() : Promise.reject(response))
                        .then(result => {
                            result.data.results.forEach((r) => {
                                let foundPlace = localTempResult.find(item => item.place_id === r.place_id);

                                if (foundPlace) {
                                    foundPlace.tags.push(food);
                                } else {
                                    localTempResult.push({ ...r, tags: [food] });
                                }
                            });
                        })
                        .catch(error => console.error("Inner fetch error for foodPreference:", error))
                    );
                }
            }

            await Promise.all(fetchPromises);

            // Additional API call to fetch place details and distances
            console.log("now time for the detailFetchPromises")
            const detailFetchPromises = newResults.map(async (place) => {
                const updatedResults = await Promise.all(place.result.map(async (item) => {
                    const response = await fetch(`${BackendBaseUrl}/maps/v1/PlaceIdSearch?lat=${searchLat}&lng=${searchLng}&keyword=${item.tags.join(',')}&type=${place.typeOfPlace}&userId1=${myId}&userId2=${guestId}&coordinate1=${mylocation.lat},${mylocation.lng}&coordinate2=${coordinate2.lat},${coordinate2.lng}&place_id=${item.place_id}`);
                    
                    if (!response.ok) throw new Error('Failed to fetch additional details');

                    const detailData = await response.json();

                    return {
                        ...item,
                        additionalDetails: detailData.additionalDetails,
                        distances: detailData.distances
                    };
                }));

                return { typeOfPlace: place.typeOfPlace, result: updatedResults };
            });

            const detailedResults = await Promise.all(detailFetchPromises);

            setResults(prev => [...prev, ...detailedResults]);
            setLoading(false);
        } catch (error) {
            console.error("Outer error:", error);
        }
    };

    fetchData();
}, [coordinate2]);

const  optionsSubmission = async ()=>{
    try{
        console.log("Reached the PreferenceMatchingSubmission so the result i will submit is : ", results);
            const response = await fetch(`${BackendBaseUrl}/api/v1/preferenceMatching?slotId=${slotId}&myId=${myId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(results),
                credentials : "include"
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Response from server:', result);
                setLoading(false);
            } else {
                console.error('Failed to submit preferences:', response.statusText);
            }
    }
    catch(error){
        console.log("some error in optionsSubmission ", error)

    }

//     reached the Showing Results page with 
//      672787f90c156b2cb0754e51 OpD0NyjaPnQJzkatOtFAc7dMFLB2 {lat: 25.4934118, lng: 81.8627391}
//       undefined Y3zYHUe1zjVUS2bqxaEoaUDawcg1 undefined undefined undefined
    
 }

// Loading and navigation
if (loading) {
    return <h1>We are trying to find the best match for you.</h1>;
} else {
    console.log("Before navigating, results:", results);
    optionsSubmission();
    console.log(preference,coordinate2,results,othersPreference )
    navigate('/preference/results', {
        state: {
            slotId,
            myId,
            mylocation,
            preferencemy: preference,
            guestId,
            guestlocation: coordinate2,
            myoptions: results,
            preferenceother: othersPreference,
        }
    });
}


return null;
}

export default PreferenceMatching;