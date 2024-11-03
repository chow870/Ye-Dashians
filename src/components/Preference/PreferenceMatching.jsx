import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PreferenceMatching() {
  const [results, setResults] = useState([]); 
  const [tempResult, setTempResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coordinate2, setCoordinate2] = useState(null);
  const [othersPreference, setOthersPreference] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const { slotId, myId, mylocation, guestId, preference } = location.state || {};
  console.log("Reached Preference Matching page with:", slotId, myId, mylocation, guestId, preference);

//   to fetch the location 
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(`/api/v1/fetchCoordinates?slotId=${slotId}&userId=${guestId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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

 useEffect(async ()=>{
    console.log(coordinate2);
if (coordinate2 == null) return;

let searchLat = (mylocation.lat + coordinate2.lat) / 2;
let searchLng = (mylocation.lng + coordinate2.lng) / 2;
console.log(preference.typeOfPlace); // array
console.log(preference.ambience); // array

try {
    // Collect all fetch promises for ambience and foodPreference
    const fetchPromises = [];

    // First loop: iterate over typeOfPlace and ambience
    for (const element of preference.typeOfPlace) {
        console.log("i have started iterating in the preference.typeOfPlace for the element ", element)
        for (const ambience of preference.ambience) {
            console.log("i have started iterating in the preference.ambience for the element ", ambience)
            fetchPromises.push(
                fetch(`/maps/v1/NearbySearch?lat=${searchLat}&lng=${searchLng}&type=${element}&keyword=${ambience}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(response => response.ok ? response.json() : Promise.reject(response))
                .then(result => {
                    console.log(result)
                    // now just checking if the results entries if already exsists in the Tempresult
                    result.data.results.forEach((r) => {
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
                })
                .catch(error => console.error("Inner fetch error for ambience:", error))
            );
        }

        // Second loop: iterate over typeOfPlace and foodPreference
        for (const food of preference.foodPreference) {
            console.log("i have started iterating in the preference.foodPreference for the element ", food)
            fetchPromises.push(
                fetch(`/maps/v1/NearbySearch?lat=${searchLat}&lng=${searchLng}&type=${element}&keyword=${food}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(response => response.ok ? response.json() : Promise.reject(response))
                .then(result => {
                    console.log(result)
                    result.data.results.forEach((r) => {
                        setTempResult((prev) => {
                            if (!prev) prev = [];

                            let foundIt = false;
                            const updatedPrev = prev.map((item) => {
                                if (item.place_id === r.place_id) {
                                    foundIt = true;
                                    return {
                                        ...item,
                                        tags: [...item.tags, food],
                                    };
                                }
                                return item;
                            });

                            if (!foundIt) {
                                return [...updatedPrev, { ...r, tags: [food] }];
                            } else {
                                return updatedPrev;
                            }
                        });
                    });
                })
                .catch(error => console.error("Inner fetch error for foodPreference:", error))
            );
        }
    }

    // Wait for all fetch requests to complete
    await Promise.all(fetchPromises);

    // After all requests are done, update results and submit
    await setResults((prev) => {
        return [...prev, { typeOfPlaces: preference.typeOfPlace, result: tempResult }];
    });
    setTempResult(null);

    // Submit preferences to backend
    console.log("Reached the PreferenceMatchingSubmission so the result i will submit is : ", results);
    const response = await fetch(`/api/v1/preferenceMatching?slotId=${slotId}&myId=${myId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(results),
    });

    if (response.ok) {
        const result = await response.json();
        console.log('Response from server:', result);
       setLoading(false);
    } else {
        console.error('Failed to submit preferences:', response.statusText);
    }
} catch (error) {
    console.error("Outer error:", error);
}

 },[coordinate2])

if (loading) {
    return <h1>We are trying to find the best match for you.</h1>;
} else {
    navigate('/preference/results', {
        state: {
            slotId,
            myId,
            mylocation,
            preferenceMy: preference,
            guestId,
            guestLocation: coordinate2,
            myOptions: results,
            preferenceOther: othersPreference,
        }
    });
}

return null;
}

export default PreferenceMatching;