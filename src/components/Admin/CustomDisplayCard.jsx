import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTicketAlt } from 'react-icons/fa';
import axios from 'axios'

function CustomDisplayCard({ item,events,setIsDeleting,isDeleting}) {
const BackendBaseUrl = "https://ye-dashians-backend.onrender.com"
const handleDeletion = async (eventId) => {
        setIsDeleting(true);
        try {
          const response = await axios.delete(`${BackendBaseUrl}/api/v1/deleteEvent/${eventId}`, {
  withCredentials: true
});
          console.log(response.data.message); // "Event deleted successfully"
        //   onEventDeleted(eventId); // Callback to remove the event from the UI, if needed
        } catch (error) {
          console.error("Error deleting event:", error);
        } finally {
          setIsDeleting(false);
        }
      };
      if(isDeleting){
        <p>Loading</p>
      }
  return (
    <div className="border border-gray-200 shadow-lg rounded-xl p-6 w-80 m-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{item.locationName}</h2>
        <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none" onClick={()=>{
            handleDeletion(item._id)
        }}>
          Delete/Completed
        </button>
      </div>

      <p className="text-gray-600 mb-2">
        <span className="font-medium">Details:</span> {item.details}
      </p>
      <div className="flex items-center text-gray-700 mb-2">
        <FaTicketAlt className="mr-2 text-indigo-500" />
        <span className="font-medium">Available Seats:</span> {item.availableSeats}
      </div>
      <div className="flex items-center text-gray-700 mb-2">
        <FaMapMarkerAlt className="mr-2 text-green-500" />
        <span className="font-medium">Venue:</span> {item.locationName}
      </div>
      <div className="flex items-center text-gray-700 mb-2">
        <FaCalendarAlt className="mr-2 text-blue-500" />
        <span className="font-medium">Date:</span> {new Date(item.date).toLocaleDateString()}
      </div>
      <div className="flex items-center text-gray-700 mb-2">
        <FaClock className="mr-2 text-purple-500" />
        <span className="font-medium">Time:</span> {item.time}
      </div>
      <div className="flex items-center text-gray-700 mb-2">
        <FaTicketAlt className="mr-2 text-orange-500" />
        <span className="font-medium">Price:</span> ₹{item.pricePerTicket}
      </div>
    </div>
  );
}

export default CustomDisplayCard;
