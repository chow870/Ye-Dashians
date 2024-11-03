import { Co2Sharp } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

// till now/ at reaching to this place i expect that both the users have given
// there preferences,have there user ids, uuIds so that the specific ones may 
// called and taken into the consideration. 

// now from the backend i have to get the myoptions, othersoptions
// also i have to get the prefernces of the both for that i will also require the userIds, slotIds


export default function ShowingResults() {
                const [commonOptions,setCommonOptions]=useState([]);
                const [othersOption,setOthersOptions]=useState([]); // isko fix karne kai liye vackend hit karna parega
                const [commonPreference,setcommonPreference] = useState([]);
                const [loading, setLoading] = useState(true);

                const location = useLocation();
                const {slotId,
                    myId,
                    mylocation,
                    preferencemy,
                    guestId,
                    guestlocation,
                    preferenceother,
                    myoptions } = location.state || {};
    console.log("reached the Showing Results page with ",slotId,
        myId,
        mylocation,
        preferencemy,
        guestId,
        guestlocation,
        preferenceother,
        myoptions  )

    
     useEffect(()=>{
        const  FetchOtherPreference = async ()=> {
            console.log("about to hit the backend to yield the FetchOtherPreference ")
            try{
                let response = await fetch(`/api/v1/fetchOthersPreference?slotId=${slotId}&userId=${guestId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
        
                if(response.ok){
                    let result = await response.json();
                    setOthersOptions(result.data);
                    console.log("other options have been set now");
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
        FetchOtherPreference();
    })

    useEffect(()=>{

        // immediately call the backend to load the myoptions and othersOptions
        // just filter begins.
        // {key match kar, then if place id}
        // first match kar le
        console.log("now entered the other useEffect of Showing Results with otherPreference as : ", preferenceother);

        preferencemy.typeOfPlaces.map((element)=>{
            preferenceother.typeOfPlaces((element2)=>{
                if(element==element2){
                    setcommonPreference((prev)=>[...prev , element])
                }

            })
        })

        commonPreference.map((places)=>{
            myoptions.places.map((entry)=>{
                othersOption.places.map((entry2)=>{
                    if(entry.place_id == entry2.place_id){
                        setCommonOptions((prev)=>[...prev,entry])
                    }
                })
            })
        })
        setLoading(false)

    },[othersOption]);

    if(loading){
        return (<h1>WE ARE TRYING OUR BEST TO GIVE YOU THE BEST SUGGESTIONS</h1>)
    }


  return (
    <div>ShowingResults 
        {/* the custom cards to display */}
        {/* also the chatting option */}

    </div>
  )
}
