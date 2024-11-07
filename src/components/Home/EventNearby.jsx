import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

function EventSearchForm() {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [events, setEvents] = useState([]);
  const [load, setLoad]=useState(false);
  const navigate = useNavigate();

  // Available event types
  const typesOptions = ["Music", "Concert", "Meetup", "Festival", "Celebrations", "Events"];

  // Handle type selection
  const handleTypeChange = (type) => {
    setSelectedTypes((prevSelectedTypes) =>
      prevSelectedTypes.includes(type)
        ? prevSelectedTypes.filter((t) => t !== type)
        : [...prevSelectedTypes, type]
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const typesQuery = selectedTypes.join(',');
    setLoad(true);
    fetch(`/api/v1/fetchEvents?types=${typesQuery}`)
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
      setLoad(false)
  };
  if(load){
    return (<p> We are loading the Nearby events for You </p>)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Search Events by Type</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="flex flex-wrap gap-4">
          <legend className="text-lg font-semibold mb-2">Select Types</legend>
          {typesOptions.map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={type}
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
                className="form-checkbox h-4 w-4 text-blue-500"
              />
              <span>{type}</span>
            </label>
          ))}
        </fieldset>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Search
        </button>
      </form>

      {/* Carousel Display for Events */}
      {events.length > 0 ? (
        <div className="mt-8 relative">
          <div className="flex overflow-x-auto space-x-4">
            {events.map((event, index) => (
              <div
                key={event._id}
                className="min-w-[300px] bg-white rounded-lg shadow-md p-4 space-y-2 border border-gray-200"
              >
                <h3 className="text-xl font-semibold">{event.locationName}</h3>
                <p className="text-gray-600">Organiser: {event.organiserName}</p>
                <p className="text-gray-500">{event.details}</p>
                <p className="text-gray-600">Date: {new Date(event.date).toLocaleDateString()}</p>
                <p className="text-gray-600">Time: {event.time}</p>
                {event.availableSeats > 0 ? (
                  <>
                  <p className="text-green-600 font-bold">Tickets Available</p>
                  <button >Book The Seats !!!</button>
                  <button
                  onClick={()=>{
                    navigate('/createlobby',)
                  }} 
                  > Share And Plan It With your Friend </button>
                  </>
                  
                ) : (
                  <p className="text-red-500 font-bold">Sold Out</p>
                )}
                <p className="text-blue-500 font-semibold">Price: ${event.pricePerTicket}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-8 text-gray-500">No events found for the selected types.</p>
      )}
    </div>
  );
}

export default EventSearchForm;
