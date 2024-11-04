import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client'

export default function ShowingResults() {
    const [commonOptions, setCommonOptions] = useState([]);
    const [othersOption, setOthersOptions] = useState([]);
    const [commonPreference, setCommonPreference] = useState([]);
    const [loading, setLoading] = useState(true);
    const [finalized , setFinaliized] = useState();
    const location = useLocation();
    const [messages, setMessages] = useState([])
    const [inputValue , setInputValue] = useState()
    const [socketLoading, setSocketLoading] = useState(true)
    const socket = io.connect('http://localhost:5000')
    const [friendSuggestedIds, setFriendSuggestedIds] = useState([])
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
        // this is the filtering algorithm 
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




    useEffect(() => {
        const lobbyId = slotId
        socket.on("connect" , () => {
          console.log("frontend says connected with socket id" , socket.id)
          setSocketLoading(false);
          socket.emit("Join Room" , lobbyId)
        })
        socket.on("private-message-recieved" , (data) => {
          console.log("private-data" , data)
          if(data.sentObj.suggestor!=myId)
          {
            setFriendSuggestedIds((prev)=>[...prev , data.sentObj.suggestion])
          }
          setMessages((prev)=>[...prev , data.sentObj])
        })
        return () => {
          socket.disconnect();
        };
      }, []);

      const handleSubmit2 = (e) => {
        const lobbyId = slotId;
        e.preventDefault(); 
        const sentObj = {
            message : inputValue
        }
        socket.emit("PrivateMessage" , {sentObj,lobbyId})
        setInputValue(''); 
      };


      const suggest = (placeid,placename) =>  {
        const lobbyId = slotId;
        const sentObj = {
            suggestion : placeid,
            suggestionname : placename,
            suggestor : myId
        }
        socket.emit("PrivateMessage" , {sentObj,lobbyId})
      } 



    // Loading message
    if (loading) {
        return (<h1>We are trying our best to give you the best suggestions...</h1>);
    }

    // Render the results
    console.log("the common options are : ", commonOptions);



    

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Side Content - Vertically stacked divs */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ width: '100%' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Showing Results</h2>

          {/* Common Preferences */}
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Common Preferences</h3>
            {commonPreference.length > 0 ? (
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                {commonPreference.map((place, index) => (
                  <li key={index}>{place}</li>
                ))}
              </ul>
            ) : (
              <p>No common preferences found.</p>
            )}
          </div>
        </div>

        {/* Common Options */}
        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Common Options</h3>
          {commonOptions.length > 0 ? (
            <div style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              padding: '16px',
              backgroundColor: '#e5e7eb',
              borderRadius: '8px'
            }}>
              {commonOptions.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  minWidth:'300px'
                }}>
                  <p style={{ fontWeight: '600' }}>{item.name}</p>
                  <p>Opened Now: {item.open_now ? 'Yes' : 'No'}</p>
                  <p>Ratings: {item.rating}</p>
                  <p>Tags: {item.tags}</p>
                  <button style={{
                    marginTop: '8px',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '4px'
                  }}>More Details</button>
                  <button onClick = {()=>{
                        console.log(item.place_id)
                        suggest(item.place_id,item.name);
                  }} style={{
                    marginTop: '8px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '4px'
                  }}>Suggest Your Partner</button>
                </div>
              ))}
            </div>
          ) : (
            <h1>Nothing to show</h1>
          )}
        </div>

        {/* Your Options */}
        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Your Options</h3>
          <div style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            padding: '16px',
            backgroundColor: '#e5e7eb',
            borderRadius: '8px'
          }}>
            {myoptions.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                minWidth:'300px'
              }}>
                <p style={{ fontWeight: '600' }}>{item.name}</p>
                <p>Opened Now: {item.open_now ? 'Yes' : 'No'}</p>
                <p>Ratings: {item.rating}</p>
                <p>Tags: {item.result.tags}</p>
                <button style={{
                  marginTop: '8px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '4px'
                }}>More Details</button>
                <button style={{
                  marginTop: '8px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '4px'
                }}>Suggest Your Partner</button>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested By Partner */}
        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Suggested By Your Partner</h3>
            {
                friendSuggestedIds.map((id)=>(
                    <p>{id}</p>
                ))
            }
        </div>
      </div>

      {/* the chat section*/}
      <div style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <div className="w-2/5 bg-gray-200 p-4 rounded-lg" style={{ minHeight: '500px' }}>
    <h3 className="font-semibold text-gray-700 mb-2">Chat</h3>
    <form onSubmit={handleSubmit2}>
      {messages.map((payload , index)=>{
          return (
            payload.suggestion?(payload.suggestor===myId?<p><span className="bg-green-200 text-greens-800 text-sm font-semibold px-2 py-1 rounded-full mr-2">
                you have suggested {payload.suggestionname}
              </span></p>:<p><span className="bg-blue-200 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full mr-2">
                your friend has suggested {payload.suggestionname}
              </span></p>):<p key = {index}>{payload.message}</p>
            
          )
        })}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update state on input change
          placeholder="Enter something..."
        />
        <button type="submit" disabled={socketLoading}>Submit</button>
        </form>
  </div>
      </div>
    </div>

    );
}
