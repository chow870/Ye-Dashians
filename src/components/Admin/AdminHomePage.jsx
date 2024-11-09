import React, { useEffect, useState } from 'react'
import CreateEventForm from './CreateNewEvent';
import { useSelector } from 'react-redux';
import axios from 'axios'
import ProfilePage from './ProfilePage';
import CustomDisplayCard from './CustomDisplayCard';
import { useNavigate } from 'react-router-dom';

function AdminHomePage() {

 const [isDeleting,setIsDeleting] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate= useNavigate()

  const organiserId = useSelector((state) => state.auth.user.uid);


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("inside the fetch events")
        const response = await axios.get('/api/v1/fetchAdminEvents', {
          params: { organiserId }
        });
        setEvents(response.data);
      } catch (err) {
        console.log(err)
        setError("Error fetching events.",err);
      } finally {
        setLoading(false);
      }
    };

    if (organiserId) {
      fetchEvents();
    }
    }, [organiserId,setIsDeleting]);
    console.log(events)



        if (loading) return <p>Loading events...</p>;
        if (error) return <p>{error}</p>;
  return (
    <div className="flex h-screen bg-black text-white">
  {/* Left Section: Profile and Create Event Button */}
  <div className="w-1/2 bg-bright-100 p-4 flex flex-col items-start space-y-4">
    <div className="bg-yellow-100 text-black p-4 rounded-lg shadow-md w-full">
      <ProfilePage />
    </div>
    <button
      onClick={() =>  navigate('/createlobby') }
      className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md w-full hover:bg-blue-600 transition-colors"
    >
      Create New Event
    </button>
  </div>

  {/* Right Section: Events List */}
  <div className="w-1/2 p-4 overflow-x-auto space-x-4 flex bg-black">
    {events.map((item, index) => (
      <div key={index} className="bg-gray-800 rounded-lg p-4 shadow-lg min-w-[300px] mr-4">
        <CustomDisplayCard item={item} events={events} isDeleting={isDeleting} setIsDeleting={setIsDeleting} />
      </div>
    ))}
  </div>
</div>

  )
}

export default AdminHomePage