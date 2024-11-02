import React, { useEffect, useState } from 'react'

export default function Aqi() {

    const [data,setData]= useState([]);
    const [loading,setLoading] =useState(false);
    const [currentLocation,setCurrentLocation]=useState(null);
    const d = new Date();
    const result = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}T${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}:${String(d.getUTCSeconds()).padStart(2, '0')}Z`;


    const fetchData = async function() {
        if (currentLocation == null) {
            setLoading(false);
            return;
        }
        
        setLoading(true); // Set loading state to true at the start
    
        try {
            let response = await fetch(`/api/aqi?lat=${currentLocation.lat}&lng=${currentLocation.lng}`);
    
            if (response.ok) {
                let result = await response.json();
                setData(result);
            } else {
                console.log("The call was made but response was not okay. Status:", response.status);
            }
        } catch (err) {
            console.error("An error occurred while fetching AQI data:", err);
        } finally {
            setLoading(false); // Set loading state to false after completion
        }
    };
    
    
    useEffect(()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
          } else {
            console.log("Geolocation not supported");
          }
          
          function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            // console.log(Latitude: ${latitude}, Longitude: ${longitude});
            setCurrentLocation({lat: latitude, lng:longitude});
            // setOriginInput({lat: latitude, lng:longitude})
            
          }
          
          function error() {
            console.log("Unable to retrieve your location");
          }
      },[])

    useEffect(()=>{
        fetchData();
    },[currentLocation])
    if(loading){
        return (<p>LOADING IS TRUE</p>)
    }
  return (
    <div className='h-45 w-96 border-2 border-black mx-5 my-2'>
        
            <div className="carousel rounded-box w-88">
               
                {
                    data.map((item,index)=>{
                        return (
                            <div key={index} className="carousel-item w-full flex flex-col " >
                                 <h1>AQI</h1>
                                <p>Time: {item.dateTime.split('T')[1].split('Z')[0]} </p>
                                <p>Date:{item.dateTime.split('T')[0]}</p>
                                <p>{item.indexes[0].displayName} : {item.indexes[0].aqi} </p>
                                <p>{item.indexes[0].category} </p>
                                {/* <div style={{"background-color": rgb( 0 0)}}> colour code </div> */}
                                <p>Dominant Pollutant : {item.indexes[0].dominantPollutant} </p>
                                <h2> Health Recommendations</h2>
                                <p> In General :{item.healthRecommendations.generalPopulation} </p>
                                <p> For Lungs Patients :{item.healthRecommendations.lungDiseasePopulation} </p>
                                <p> For Heart Patients :{item.healthRecommendations.heartDiseasePopulation} </p>

                            </div>
                        )
                    })
                }
           </div>
    </div>
  )
}
