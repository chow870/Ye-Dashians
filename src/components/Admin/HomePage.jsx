import React, { useState,useEffect } from 'react'
import CreateEventForm from './CreateNewEvent';
import axios from "axios"
function HomePage() {

 const [isDeleting,setIsDeleting] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const BackendBaseUrl = "https://ye-dashians-backend.onrender.com"
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BackendBaseUrl}/api/v1/fetchAdminEvents`, {
          params: { organiserId },
          withCredentials : true
        });
        setEvents(response.data);
      } catch (err) {
        setError("Error fetching events.");
      } finally {
        setLoading(false);
      }
    };

    if (organiserId) {
      fetchEvents();
    }
    }, []);

  
    const handleDeletion = async (eventId) => {
        setIsDeleting(true);
        try {
          const response = await axios.delete(`${BackendBaseUrl}/api/v1/deleteEvent/${eventId}`,{
            withCredentials : true
          });
          console.log(response.data.message); // "Event deleted successfully"
          onEventDeleted(eventId); // Callback to remove the event from the UI, if needed
        } catch (error) {
          console.error("Error deleting event:", error);
        } finally {
          setIsDeleting(false);
        }
      };

        if (loading) return <p>Loading events...</p>;
        if (error) return <p>{error}</p>;
        console.log(events)
  return (
    <div>HomePage
        {/* here i will show the card prop that will display the username, email, id, phone no, photo */}
        {/* create a new event */}
        {/* here  i will do the traversal */}
        < CreateEventForm/>
        
    </div>
  )
}

export default HomePage