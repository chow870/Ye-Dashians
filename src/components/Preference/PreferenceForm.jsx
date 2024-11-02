import { Autocomplete } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

function PreferenceForm() {
    // in the props i will have the slotId
    const [preference,setPreference]=useState(null) // it will be like [{what : []},{what : []}, {what :[]}];
    const [typeOfPlace,setTypeOfPlace]=useState({});
    const [ambience,setAmbiene]=useState({});
    const [foodPreference,setFoodPreference]=useState({});
    const [otherServices,setOtherServices]=useState({});
    const [originInput,setOriginInput]= useState(null);
    const originRef = useRef(null);
    const location = useLocation();
    const {slotId,myId,guestId} =location.state||{}

    useEffect(()=>{
      console.log("reached the PreferenceForm component")
    },[])

    const handleOriginChange = ()=>{
            
    const place = originRef.current.getPlace();
    if (place && place.geometry) {
      const location = place.geometry.location;
      setOriginInput({ lat: location.lat(), lng: location.lng() });
    }
}

    const  HandleBackendPreferenceSubmission = async ()=>{
        try {
          //  submit the preference {userId, slotid, preference}
          console.log("reached the HandleBackendPreferenceSubmission ")
        } catch (error) {   
        }
}

    const HandlePrefernceSubmission = ()=>{

        for (let i =1; i<=4; i++){
            let selectedValues;
            let selectElement;

            switch (i) {
                case 1:
                     selectElement = document.getElementById('TypeOfPlace');
                     selectedValues = Array.from(selectElement.selectedOptions).map(option => option.value);
                    setTypeOfPlace({typeOfPlace:selectedValues})
                    break;
                case 2:
                        selectElement = document.getElementById('Ambience');
                        selectedValues = Array.from(selectElement.selectedOptions).map(option => option.value);
                        setAmbiene({ambience:selectedValues})
                        break;
                case 3:
                            selectElement = document.getElementById('foodPreference');
                            selectedValues = Array.from(selectElement.selectedOptions).map(option => option.value);
                            setFoodPreference({foodPreference:selectedValues})
                            break;
                case 4:
                                selectElement = document.getElementById('Services');
                                selectedValues = Array.from(selectElement.selectedOptions).map(option => option.value);
                                setOtherServices({otherServices:selectedValues})
                                break;  
            }
            console.log(selectedValues)

        }
        // here have to send to the backend; but do send : tempPreference to avoid sening null in the backedn+ userId + groupId
        const tempPreference= [typeOfPlace,ambience,foodPreference,otherServices];
        setPreference(tempPreference)
        HandleBackendPreferenceSubmission();
        
    }
    
    useEffect(()=>{
        console.log(preference);
        console.log(slotId,myId);
        alert("you will be navigated to next page and this will be stored in the backend so that user B can filter it out")

    },[preference])  

  return (
    <div>
         <Autocomplete onLoad={(ref) => (originRef.current = ref)} onPlaceChanged={handleOriginChange}>
            <input
              type="text"
              className="bg-slate-100"
              placeholder="Search Your Current Location"
            />
          </Autocomplete>
        PreferenceForm
        <label htmlFor="TypeOfPlace">Select For the Type of Place : </label>
        <select 
        id='TypeOfPlace'
        name='TypeOfPlace'
        multiple
        required
        >
                <option value="cafe">Cafe/Coffee Shop/Tea Shop</option>
                <option value="bakery">Bakery </option>
                <option value="resturant">Resturant</option>
                <option value="park">Park</option>
                <option value="bar">Bar</option>
        </select>
        <label htmlFor="Ambience">Select For the Ambience : </label>
        <select 
        id='Ambience'
        name='Ambience'
        multiple>
                <option value="quiet||peaceful||relaxed">Cozy/Relaxed/Peaceful</option>
                <option value="lively||music">Lively/Music</option>
                <option value="indoor">Indoors</option>
                <option value="outdoor">Outdoors</option>
                
        </select>
        <label htmlFor="foodPreference">Select For the Food Preference : </label>
        <select 
        id='foodPreference'
        name='foodPreference'
        >
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="any">No Restrictions</option> 
        </select>
        <label htmlFor="Services">Select For Other Services: </label>
        <select 
        id='Services'
        name='Services'
        multiple
        >
                <option value="delivery">Delivery</option>
                <option value="dine_in">Dine In </option> 
                <option value="serves_dinner">Serves Dinner</option>
                <option value="takeout">Take Out</option> 

        </select>

        <button onClick={HandlePrefernceSubmission}>
            Submit
        </button>
    </div>
  )
}

export default PreferenceForm