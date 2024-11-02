import React, { useEffect, useState } from 'react'

function EventNearby() {
    const [events, setEvents] = useState(null)
    const [currentLocation, setCurrentLocation] = useState(null);
    const [records, setRecords] = useState([{}])

    const searchEventsNearMe = async () => {
        if(currentLocation==null){
            return ;
        }
        
    
        try {
          const response = await fetch(`/api/events?lat=${currentLocation.lat}&lng=${currentLocation.lng}`);
          const data = await response.json();
          console.log(data);
          setEvents(data.results);
        } catch (error) {
          console.error('Error fetching events:', error);
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

      const searchRecords = async ({destination})=>{
            
    try {
        const response = await fetch(`/api/recordslat=${currentLocation.lat}&lng=${currentLocation.lng}&destinations=${destination}`);
        const data = await response.json();
  
        if (data.status === 'OK') {
          const distancesMap = {};
          data.rows[0].elements.forEach((element, index) => {
            distancesMap[places[index].place_id] = {
              distance: element.distance.text,
              duration: element.duration.text,
            };
          });
          setDistances(distancesMap);
        } else {
          console.error("Distance Matrix Error:", data.error_message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
        }

      useEffect(() => {
        if(currentLocation == null ) return ;
        if (currentLocation.lat && currentLocation.lng) {
          searchEventsNearMe();
        }
        if(events != null){
            searchRecords();

        }
      }, [currentLocation]);
 
  return (
    <div className='h-32 w-96 border-2 border-black mx-5 my-2'>events near me</div>
  )
}

export default EventNearby