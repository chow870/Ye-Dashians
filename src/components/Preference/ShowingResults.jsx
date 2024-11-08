import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

export default function ShowingResults() {
    const [commonOptions, setCommonOptions] = useState([]);
    const [myOptions, setMyOptions] = useState([]); // State to hold my options
    const [othersOption, setOthersOptions] = useState([]);
    const [commonPreference, setCommonPreference] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socketLoading, setSocketLoading] = useState(true);
    const [sortOption, setSortOption] = useState('rating'); // State for sorting options
    const [filterType, setFilterType] = useState(''); // State for filtering by type of place
    const socket = io.connect('http://localhost:5000');
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState()
    const [friendSuggestedIds, setFriendSuggestedIds] = useState() // suggested ids.
    const [suggested, setSuggested] =useState([])
    const navigate = useNavigate();
    const {
        slotId,
        myId,
        mylocation,
        preferencemy,
        guestId,
        guestlocation,
        preferenceother,
        myoptions, // Assuming myoptions is passed from props
    } = useLocation().state || {};



    useEffect(() => {
      const MatchSuggestions = (friendSuggestedIds) => {
        let Found = false;
    
        othersOption.forEach((element) => {
          element.result.forEach((item) => {
            if (Found) return; 
            if (item.place_id === friendSuggestedIds) {
              setSuggested((prev) => {
                Found = true;
                return [...prev, item];
              });
            }
          });
        });
      };
    
      // Call the function with friendSuggestedIds
      if (friendSuggestedIds) {
        MatchSuggestions(friendSuggestedIds);
      }
    }, [friendSuggestedIds, othersOption, setSuggested]);
    
    useEffect(() => {
        const lobbyId = slotId
        socket.on("connect", () => {
            console.log("frontend says connected with socket id", socket.id)
            setSocketLoading(false);
            socket.emit("Join Room", lobbyId)
        })
        socket.on("private-message-recieved", (data) => {
            console.log("private-data", data)
            if (data.sentObj.suggestor != myId) {
                setFriendSuggestedIds(data.sentObj.suggestion)
            }
            setMessages((prev) => [...prev, data.sentObj])
        })
        socket.on("finalize-message-recieved", (data) => {
            // console.log("private-data", data)
            console.log("yeah i have recieved  finalize-message-recieved ")
            const venuePlaceId = data.sentObj.id;
            const venueName = data.sentObj.name;
            const location = data.sentObj.loc;
            navigate(`/myLobby/${slotId}`, {
                state: {
                   slotId,
                   venuePlaceId,
                   venueName,
                   locationCoords : location,
                   guestId:guestId
                }
            })
        })
        return () => {
            socket.disconnect();
        };
    }, []);

    const handleSubmit2 = (e) => {
        const lobbyId = slotId;
        e.preventDefault();
        const sentObj = {
            message: inputValue,
            sender: myId
        }
        socket.emit("PrivateMessage", { sentObj, lobbyId })
        setInputValue('');
    };


    const suggest = (placeid, placename) => {
        const lobbyId = slotId;
        const sentObj = {
            suggestion: placeid,
            suggestionname: placename,
            suggestor: myId
        }
        socket.emit("PrivateMessage", { sentObj, lobbyId })
    }


    const finalize = (placeid, placename , location) => {
      console.log("inside the finalise event listener")
        const lobbyId = slotId;
        const sentObj = {
            id : placeid,
            name : placename,
            loc : location
        }
        socket.emit("FinalizeMessage", { sentObj, lobbyId })

    }


    useEffect(() => {
        const fetchOtherPreferences = async () => {
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
                } else if (response.status === 404) {
                    alert("Please ask your partner to fill in their preferences.");
                }
            } catch (error) {
                console.log("Error:", error);
            }
        };

        fetchOtherPreferences();
    }, [slotId, guestId]);


    useEffect(() => {
        if (myoptions) {
            setMyOptions(myoptions);
        }
    }, [myoptions]);

    useEffect(() => {
        if (othersOption.length === 0 || myOptions.length === 0) return;

        const commonPref = [];
        preferencemy.typeOfPlace.forEach((element) => {
            if (preferenceother.typeOfPlace.includes(element)) {
                commonPref.push(element);
            }
        });

        setCommonPreference(commonPref);

        const commonOpts = [];
        commonPref.forEach((placeType) => {
            const myPlace = myOptions.find((opt) => opt.typeOfPlace === placeType);
            const otherPlace = othersOption.find((opt) => opt.typeOfPlace === placeType);

            if (myPlace && otherPlace) {
                const resultArray = [];
                myPlace.result.forEach((myItem) => {
                    otherPlace.result.forEach((otherItem) => {
                        if (myItem.place_id === otherItem.place_id) {
                            if (!resultArray.some(opt => opt.place_id === myItem.place_id)) {
                                resultArray.push(myItem);
                            }
                        }
                    });
                });

                if (resultArray.length > 0) {
                    commonOpts.push({
                        typeOfPlace: placeType,
                        result: resultArray,
                    });
                }
            }
        });

        setCommonOptions(applySorting(commonOpts));
        setLoading(false);

    }, [othersOption, preferencemy, preferenceother, myOptions, sortOption]);

    // Function to apply sorting
    
    const applySorting = (options) => {
      return options.map(category => ({
          ...category,
          result: [...category.result].sort((a, b) => {
              console.log("inside applySorting : ", a, b);
  
              if (sortOption === 'rating') {
                  return (b.rating || 0) - (a.rating || 0); // Sort by rating, descending
              } else if (sortOption === 'distance') {
                  // Calculate absolute difference of distances for each place
                  const user1DistanceA = parseFloat(a.distances[0].distance.rows[0].elements[0].distance.value);
                  const user2DistanceA = parseFloat(a.distances[1].distance.rows[0].elements[0].distance.value);
  
                  const user1DistanceB = parseFloat(b.distances[0].distance.rows[0].elements[0].distance.value);
                  const user2DistanceB = parseFloat(b.distances[1].distance.rows[0].elements[0].distance.value);
  
                  const absDifferenceA = Math.abs(user1DistanceA - user2DistanceA);
                  const absDifferenceB = Math.abs(user1DistanceB - user2DistanceB);
  
                  return absDifferenceA - absDifferenceB; // Sort by absolute difference, ascending
              }
              return 0;
          })
      }));
  };
  

    // Function to filter results by type
    const filteredCommonOptions = commonOptions.filter(option =>
        !filterType || option.typeOfPlace === filterType
    );

    const filteredMyOptions = myOptions.filter(option =>
        !filterType || option.typeOfPlace === filterType
    );


    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };


    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };
    const HandlerNavigateMoreDetailsPage = (item)=>{
      navigate('/preference/moredetails',{
        state:{
            item:item,
            mylocation:mylocation,
            destinationLocation:item.geometry.location
        }})
    }

    if (loading) {
        return (<h1>We are trying our best to give you the best suggestions...</h1>);
    }
    console.log(filteredCommonOptions)


   
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left Side: Options */}
      <div className="flex flex-col w-3/5 p-5 gap-6">
        <div className="flex items-center gap-4">
          <label className="text-gray-300 font-medium">Sort by:</label>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg"
          >
            <option value="rating">Rating (High to Low)</option>
            <option value="distance">Distance (Closest)</option>
          </select>

          <label className="text-gray-300 font-medium">Filter by Type:</label>
          <select
            value={filterType}
            onChange={handleFilterChange}
            className="px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg"
          >
            <option value="">All</option>
            <option value="cafe">Cafe</option>
            <option value="bars">Bars</option>
            <option value="restaurant">Restaurant</option>
            <option value="park">Park</option>
            <option value="bakery">Bakery</option>
          </select>
        </div>

        {/* Common Options */}
        <div className="bg-gray-100 p-4 rounded-lg">
                 <h3 className="text-lg font-semibold mb-4 text-stone-950">Common Options</h3>
                   {filteredCommonOptions.length > 0 ? (
                      <div className="flex gap-4 overflow-x-auto">
                          {filteredCommonOptions.map((element, index) => (
                              element.result.map((item, itemIndex) => (
                                  <div key={`${index}-${itemIndex}`} className="bg-white p-4 rounded-lg min-w-[400px] shadow text-stone-950	">
                                      <p className="font-bold">Name: <span className="font-normal">{item.name || 'N/A'}</span></p>
                                      <p className="font-bold">Rating: <span className="font-normal">{item.rating || 'N/A'}</span></p>
                                      <p className="font-bold">Distance (You): <span className="font-normal">{item.distances[0].distance.rows[0].elements[0].distance.text || 'N/A'}</span></p>
                                      <p className="font-bold">Distance (Your Partner): <span className="font-normal">{item.distances[1].distance.rows[0].elements[0].distance.text || 'N/A'}</span></p>
                                      <p className="font-bold">Open Now: <span className="font-normal">{item.additionalDetails.result.current_opening_hours?.open_now ? 'Yes' : 'No'}</span></p>
                                      <p className="font-bold">Tags: <span className="font-normal">{item.tags?.join(', ') || 'N/A'}</span></p>
                                      <p className="font-bold">Address: <span className="font-normal">{item.additionalDetails.result.formatted_address || 'N/A'}</span></p>
                                      <p className="font-bold">Phone Number: <span className="font-normal">{item.additionalDetails.result.formatted_phone_number || 'N/A'}</span></p>
                                      <p className="font-bold">Serves Dinner: <span className="font-normal">{item.additionalDetails.result.serves_dinner ? 'Yes' : 'No'}</span></p>
                                      <p className="font-bold">Delivery: <span className="font-normal">{item.additionalDetails.result.delivery ? 'Available' : 'Not Available'}</span></p>
                                      <p className="font-bold">Takeout: <span className="font-normal">{item.additionalDetails.result.takeout ? 'Available' : 'Not Available'}</span></p>
                                      <button onClick={() => suggest(item.place_id, item.name)} className="bg-blue-500 text-white px-4 py-2 mt-3 rounded-lg">Suggest Your Partner</button>
                                      <button onClick={() => HandlerNavigateMoreDetailsPage(item)} className="bg-green-500 text-white px-4 py-2 mt-3 rounded-lg">More Details</button>
                                  </div>
                              ))
                          ))}
                      </div>
                  ) : (
                      <h1 className="text-lg font-medium text-stone-950	">Nothing to show</h1>
                  )}
              </div>

        {/* My Options */}
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">My Options</h3>
          {/* Render my options */}
          {filteredMyOptions.length > 0 ? (
                      <div className="flex gap-4 overflow-x-auto">
                          {filteredMyOptions.map((element, index) => (
                              element.result.map((item, itemIndex) => (
                                <div key={`${index}-${itemIndex}`} className="bg-white p-4 rounded-lg min-w-[400px] shadow text-stone-950	" >
                                <p className="font-bold">Name: <span className="font-normal">{item.name || 'N/A'}</span></p>
                                <p className="font-bold">Rating: <span className="font-normal">{item.rating || 'N/A'}</span></p>
                                <p className="font-bold">Distance (You): <span className="font-normal">{item.distances[0].distance.rows[0].elements[0].distance.text || 'N/A'}</span></p>
                                <p className="font-bold">Distance (Your Partner): <span className="font-normal">{item.distances[1].distance.rows[0].elements[0].distance.text || 'N/A'}</span></p>
                                <p className="font-bold">Open Now: <span className="font-normal">{item.additionalDetails.result.current_opening_hours?.open_now ? 'Yes' : 'No'}</span></p>
                                <p className="font-bold">Tags: <span className="font-normal">{item.tags?.join(', ') || 'N/A'}</span></p>
                                <p className="font-bold">Address: <span className="font-normal">{item.additionalDetails.result.formatted_address || 'N/A'}</span></p>
                                <p className="font-bold">Phone Number: <span className="font-normal">{item.additionalDetails.result.formatted_phone_number || 'N/A'}</span></p>
                                <p className="font-bold">Serves Dinner: <span className="font-normal">{item.additionalDetails.result.serves_dinner ? 'Yes' : 'No'}</span></p>
                                <p className="font-bold">Delivery: <span className="font-normal">{item.additionalDetails.result.delivery ? 'Available' : 'Not Available'}</span></p>
                                <p className="font-bold">Takeout: <span className="font-normal">{item.additionalDetails.result.takeout ? 'Available' : 'Not Available'}</span></p>
                                <button onClick={() => suggest(item.place_id, item.name)} className="bg-blue-500 text-white px-4 py-2 mt-3 rounded-lg">Suggest Your Partner</button>
                                <button onClick={() => HandlerNavigateMoreDetailsPage(item)} className="bg-green-500 text-white px-4 py-2 mt-3 rounded-lg">More Details</button>
                            </div>
                              ))
                          ))}
                      </div>
                  ) : (
                      <h1 className="text-lg font-medium text-stone-950	">No options available</h1>
                  )}
        </div>

        {/* Suggested Options */}
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-white	">Suggested Options</h3>
          {/* Render suggested options */}
          {suggested.length == 0 ?  <></>:
          suggested.map((item,index) => (
                                        <div key={index} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', minWidth: '400px',color:'black' }}>
                                        <p><strong>Name:</strong> {item.name || 'N/A'}</p>
                                        <p><strong>Rating:</strong> {item.rating || 'N/A'}</p>
                                        <p><strong>Distance (You):</strong> {item.distances[0].distance.rows[0].elements[0].distance.text || 'N/A'}</p>
                                        <p><strong>Distance (Your Partner):</strong> {item.distances[1].distance.rows[0].elements[0].distance.text || 'N/A'}</p>
                                        <p><strong>Open Now:</strong> {item.additionalDetails.result.current_opening_hours?.open_now ? 'Yes' : 'No'}</p>
                                        <p><strong>Tags:</strong> {item.tags?.join(', ') || 'N/A'}</p>
                                        <p><strong>Address:</strong>{item.additionalDetails.result.formatted_address || 'N/A'}</p>
                                        <p><strong>Phone Number:</strong> {item.additionalDetails.result.formatted_phone_number || 'N/A'}</p>
                                        <p><strong>Serves Dinner:</strong> {item.additionalDetails.result.serves_dinner ? 'Yes' : 'No'}</p>
                                        <p><strong>Delivery:</strong> {item.additionalDetails.result.delivery ? 'Available' : 'Not Available'}</p>
                                        <p><strong>Takeout:</strong> {item.additionalDetails.result.takeout ? 'Available' : 'Not Available'}</p>
                                        <button onClick={() => finalize(item.place_id, item.name,item.geometry.location)}> 
                                                  Finalize Your Partner
                                                </button>
                                                <button onClick={() => HandlerNavigateMoreDetailsPage(item)}>
                                                More Details
                                                </button>
                                    </div>     
                            ))
                        }
        </div>
      </div>

      {/* Right Side: Chat
      <div className="w-2/5 p-4 bg-gray-800 text-white rounded-lg flex flex-col gap-4">
        <h3 className="font-semibold text-gray-300 mb-2">Chat</h3>
        <div className="flex flex-col gap-3 overflow-y-auto h-full">
          {messages.map((payload, index) => (
            <p key={index} className="flex items-center gap-2">
              <span
                className={`${
                  payload.sender === myId ? 'bg-green-500' : 'bg-blue-500'
                } text-sm font-semibold px-2 py-1 rounded-full`}
              >
                {payload.sender === myId ? 'You:' : 'Your friend:'}
              </span>
              <span>{payload.message}</span>
            </p>
          ))}
        </div>
        <form onSubmit={handleSubmit2} className="mt-auto flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter something..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
          <button
            type="submit"
            disabled={socketLoading}
            className="px-4 py-2 bg-blue-600 rounded-lg text-white"
          >
            Send
          </button>
        </form>
      </div> */}
      {/* Right Side: Chat */}
      <div className="w-2/5 p-4 bg-gray-800 text-white rounded-lg flex flex-col gap-4 mt-4">
        <h3 className="font-semibold text-gray-300 mb-2">Chat</h3>
        <div className="flex flex-col gap-3 overflow-y-auto h-full">
        {messages.map((payload, index) => {
                  return (
                      payload.suggestion ? (
                          payload.suggestor === myId ? (
                              <p>
                                  <span className="bg-green-200 text-green-800 text-sm font-semibold px-2 py-1 rounded-full mr-2">
                                      You have suggested {payload.suggestionname}
                                  </span>
                              </p>
                          ) : (
                              <p>
                                  <span className="bg-blue-200 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full mr-2">
                                      Your friend has suggested {payload.suggestionname}
                                  </span>
                              </p>
                          )
                      ) : (
                          <p key={index}>
                              {payload.sender === myId ? (
                                  <span className="bg-green-200 text-green-800 text-sm font-semibold px-2 py-1 rounded-full mr-2">
                                      You:
                                  </span>
                              ) : (
                                  <span className="bg-blue-200 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full mr-2">
                                      Your friend:
                                  </span>
                              )}
                              <span>{payload.message}</span>
                          </p>
                      )
                  );
              })}
        </div>
        <form onSubmit={handleSubmit2} className="mt-auto flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter something..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
          <button
            type="submit"
            disabled={socketLoading && inputValue==""}
            className="px-4 py-2 bg-blue-600 rounded-lg text-white"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};




//     return (
//       <div className="flex h-screen">
//           <div className="flex flex-col gap-5 w-3/5 p-5 overflow-y-auto">
//               <div className="flex items-center gap-4">
//                   <label className="text-gray-600 font-medium">Sort by:</label>
//                   <select value={sortOption} onChange={handleSortChange} className="px-3 py-2 border border-gray-300 rounded-lg">
//                       <option value="rating">Rating (High to Low)</option>
//                       <option value="distance">Distance (Closest)</option>
//                   </select>

//                   <label className="text-gray-600 font-medium">Filter by Type:</label>
//                   <select value={filterType} onChange={handleFilterChange} className="px-3 py-2 border border-gray-300 rounded-lg">
//                       <option value="">All</option>
//                       <option value="cafe">Cafe</option>
//                       <option value="bars">Bars</option>
//                       <option value="restaurant">Restaurant</option>
//                       <option value="park">Park</option>
//                       <option value="bakery">Bakery</option>
//                   </select>
//               </div>

//               <div className="bg-gray-100 p-4 rounded-lg">
//                   <h3 className="text-lg font-semibold mb-4">Common Options</h3>
//                   {filteredCommonOptions.length > 0 ? (
//                       <div className="flex gap-4 overflow-x-auto">
//                           {filteredCommonOptions.map((element, index) => (
//                               element.result.map((item, itemIndex) => (
//                                   <div key={`${index}-${itemIndex}`} className="bg-white p-4 rounded-lg min-w-[400px] shadow">
//                                       <p className="font-bold">Name: <span className="font-normal">{item.name || 'N/A'}</span></p>
//                                       <p className="font-bold">Rating: <span className="font-normal">{item.rating || 'N/A'}</span></p>
//                                       <p className="font-bold">Distance (You): <span className="font-normal">{item.distances[0].distance.rows[0].elements[0].distance.text || 'N/A'}</span></p>
//                                       <p className="font-bold">Distance (Your Partner): <span className="font-normal">{item.distances[1].distance.rows[0].elements[0].distance.text || 'N/A'}</span></p>
//                                       <p className="font-bold">Open Now: <span className="font-normal">{item.additionalDetails.result.current_opening_hours?.open_now ? 'Yes' : 'No'}</span></p>
//                                       <p className="font-bold">Tags: <span className="font-normal">{item.tags?.join(', ') || 'N/A'}</span></p>
//                                       <p className="font-bold">Address: <span className="font-normal">{item.additionalDetails.result.formatted_address || 'N/A'}</span></p>
//                                       <p className="font-bold">Phone Number: <span className="font-normal">{item.additionalDetails.result.formatted_phone_number || 'N/A'}</span></p>
//                                       <p className="font-bold">Serves Dinner: <span className="font-normal">{item.additionalDetails.result.serves_dinner ? 'Yes' : 'No'}</span></p>
//                                       <p className="font-bold">Delivery: <span className="font-normal">{item.additionalDetails.result.delivery ? 'Available' : 'Not Available'}</span></p>
//                                       <p className="font-bold">Takeout: <span className="font-normal">{item.additionalDetails.result.takeout ? 'Available' : 'Not Available'}</span></p>
//                                       <button onClick={() => suggest(item.place_id, item.name)} className="bg-blue-500 text-white px-4 py-2 mt-3 rounded-lg">Suggest Your Partner</button>
//                                       <button onClick={() => HandlerNavigateMoreDetailsPage(item)} className="bg-green-500 text-white px-4 py-2 mt-3 rounded-lg">More Details</button>
//                                   </div>
//                               ))
//                           ))}
//                       </div>
//                   ) : (
//                       <h1 className="text-lg font-medium text-gray-500">Nothing to show</h1>
//                   )}
//               </div>

//               <div className="bg-gray-200 p-4 rounded-lg">
//                   <h3 className="text-lg font-semibold mb-4">My Options</h3>
//                   {filteredMyOptions.length > 0 ? (
//                       <div className="flex gap-4 overflow-x-auto">
//                           {filteredMyOptions.map((element, index) => (
//                               element.result.map((item, itemIndex) => (
//                                 <div key={`${index}-${itemIndex}`} className="bg-white p-4 rounded-lg min-w-[400px] shadow">
//                                 <p className="font-bold">Name: <span className="font-normal">{item.name || 'N/A'}</span></p>
//                                 <p className="font-bold">Rating: <span className="font-normal">{item.rating || 'N/A'}</span></p>
//                                 <p className="font-bold">Distance (You): <span className="font-normal">{item.distances[0].distance.rows[0].elements[0].distance.text || 'N/A'}</span></p>
//                                 <p className="font-bold">Distance (Your Partner): <span className="font-normal">{item.distances[1].distance.rows[0].elements[0].distance.text || 'N/A'}</span></p>
//                                 <p className="font-bold">Open Now: <span className="font-normal">{item.additionalDetails.result.current_opening_hours?.open_now ? 'Yes' : 'No'}</span></p>
//                                 <p className="font-bold">Tags: <span className="font-normal">{item.tags?.join(', ') || 'N/A'}</span></p>
//                                 <p className="font-bold">Address: <span className="font-normal">{item.additionalDetails.result.formatted_address || 'N/A'}</span></p>
//                                 <p className="font-bold">Phone Number: <span className="font-normal">{item.additionalDetails.result.formatted_phone_number || 'N/A'}</span></p>
//                                 <p className="font-bold">Serves Dinner: <span className="font-normal">{item.additionalDetails.result.serves_dinner ? 'Yes' : 'No'}</span></p>
//                                 <p className="font-bold">Delivery: <span className="font-normal">{item.additionalDetails.result.delivery ? 'Available' : 'Not Available'}</span></p>
//                                 <p className="font-bold">Takeout: <span className="font-normal">{item.additionalDetails.result.takeout ? 'Available' : 'Not Available'}</span></p>
//                                 <button onClick={() => suggest(item.place_id, item.name)} className="bg-blue-500 text-white px-4 py-2 mt-3 rounded-lg">Suggest Your Partner</button>
//                                 <button onClick={() => HandlerNavigateMoreDetailsPage(item)} className="bg-green-500 text-white px-4 py-2 mt-3 rounded-lg">More Details</button>
//                             </div>
//                               ))
//                           ))}
//                       </div>
//                   ) : (
//                       <h1 className="text-lg font-medium text-gray-500">No options available</h1>
//                   )}
//               </div>
//               <>
//               {suggested.map((item,index) => (
//                                         <div key={index} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', minWidth: '400px' }}>
//                                         <p><strong>Name:</strong> {item.name || 'N/A'}</p>
//                                         <p><strong>Rating:</strong> {item.rating || 'N/A'}</p>
//                                         <p><strong>Distance (You):</strong> {item.distances[0].distance.rows[0].elements[0].distance.text || 'N/A'}</p>
//                                         <p><strong>Distance (Your Partner):</strong> {item.distances[1].distance.rows[0].elements[0].distance.text || 'N/A'}</p>
//                                         <p><strong>Open Now:</strong> {item.additionalDetails.result.current_opening_hours?.open_now ? 'Yes' : 'No'}</p>
//                                         <p><strong>Tags:</strong> {item.tags?.join(', ') || 'N/A'}</p>
//                                         <p><strong>Address:</strong>{item.additionalDetails.result.formatted_address || 'N/A'}</p>
//                                         <p><strong>Phone Number:</strong> {item.additionalDetails.result.formatted_phone_number || 'N/A'}</p>
//                                         <p><strong>Serves Dinner:</strong> {item.additionalDetails.result.serves_dinner ? 'Yes' : 'No'}</p>
//                                         <p><strong>Delivery:</strong> {item.additionalDetails.result.delivery ? 'Available' : 'Not Available'}</p>
//                                         <p><strong>Takeout:</strong> {item.additionalDetails.result.takeout ? 'Available' : 'Not Available'}</p>
//                                         <button onClick={() => finalize(item.place_id, item.name,item.geometry.location)}> 
//                                                   Finalize Your Partner
//                                                 </button>
//                                                 <button onClick={() => HandlerNavigateMoreDetailsPage(item)}>
//   More Details
// </button>
//                                     </div>     
//                             ))
//                         }
//                     </div>
//                 </div>

//             </div>

//             <div style={{
//                 flex: '0 0 40%',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center'
//             }}></div>
//               </>

              
//           </div>
//           {/* the chat section */}
//           <div className="w-3/5 bg-gray-200 p-4 rounded-lg" style={{ minHeight: '500px' }}>
//           <h3 className="font-semibold text-gray-700 mb-2">Chat</h3>
//           <form onSubmit={handleSubmit2}>
//               {messages.map((payload, index) => {
//                   return (
//                       payload.suggestion ? (
//                           payload.suggestor === myId ? (
//                               <p>
//                                   <span className="bg-green-200 text-green-800 text-sm font-semibold px-2 py-1 rounded-full mr-2">
//                                       You have suggested {payload.suggestionname}
//                                   </span>
//                               </p>
//                           ) : (
//                               <p>
//                                   <span className="bg-blue-200 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full mr-2">
//                                       Your friend has suggested {payload.suggestionname}
//                                   </span>
//                               </p>
//                           )
//                       ) : (
//                           <p key={index}>
//                               {payload.sender === myId ? (
//                                   <span className="bg-green-200 text-green-800 text-sm font-semibold px-2 py-1 rounded-full mr-2">
//                                       You:
//                                   </span>
//                               ) : (
//                                   <span className="bg-blue-200 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full mr-2">
//                                       Your friend:
//                                   </span>
//                               )}
//                               <span>{payload.message}</span>
//                           </p>
//                       )
//                   );
//               })}
//               <input
//                   type="text"
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)} // Update state on input change
//                   placeholder="Enter something..."
//               />
//               <button type="submit" disabled={socketLoading}>Submit</button>
//           </form>
//       </div>
//   </div>
// </div>
//       </div>
//   );


