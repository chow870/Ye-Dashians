import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, LoadScript } from '@react-google-maps/api';

const CreateEventForm = () => {
  const organiserId = useSelector((state) => state.auth.user.uid);
  const organiserName = useSelector((state)=>state.auth.user.name); // ----> undefined.
  console.log(organiserName)
  console.log(organiserId)
  const [currentStep, setCurrentStep] = useState(1);
  const originRef = useRef(null);
  const [formData, setFormData] = useState({
    locationCoordinates: {},
    locationName: '',
    availableSeats: '',
    pricePerTicket: '',
    organiserBankDetails: '',
    details: '',
    time: '',
    date: '',
    type: 'Music',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOriginChange = () => {
    const place = originRef.current.getPlace();

    if (place) {
        setFormData((prevData) => ({
            ...prevData,
            locationName: place.name || '',  // or `place.formatted_address` if you want the full address
            locationCoordinates: place.geometry
                ? { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
                : {}
        }));
    }
};
  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      const response = await axios.post('/api/v1/createNewEvent', {
        ...formData,
        organiserId,
              //  here has to put the organiser name.
      });
      console.log("Event created successfully:", response.data);
      navigate('')
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };
  

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Create Event</h2>

        <form onSubmit={handleSubmit}>

          {currentStep === 1 && (
            <>
              <label className="block mb-4">
                <span className="text-gray-300">Location Details </span>
                      <LoadScript googleMapsApiKey="AIzaSyDN2sqMBvceRuAkBC0UlZ6KLIrEH9OjK2w" libraries={["places"]}>
                            <Autocomplete onLoad={(ref) => (originRef.current = ref)} onPlaceChanged={handleOriginChange}>
                                <input
                                    type="text"
                                    className="w-full p-4 text-lg bg-gray-800 text-gray-100 rounded-md mb-8 border border-gray-700 focus:ring focus:ring-blue-500"
                                    placeholder="Search Your Current Location"
                                />
                            </Autocomplete>
                        </LoadScript>

              </label>

              <button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded mt-4">Next</button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <label className="block mb-4">
                <span className="text-gray-300">Available Seats</span>
                <input
                  type="number"
                  name="availableSeats"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
                  required
                />
              </label>

              <label className="block mb-4">
                <span className="text-gray-300">Price Per Ticket</span>
                <input
                  type="number"
                  name="pricePerTicket"
                  value={formData.pricePerTicket}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
                  required
                />
              </label>

              <div className="flex justify-between mt-4">
                <button type="button" onClick={handleBack} className="bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded">Back</button>
                <button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded">Next</button>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <label className="block mb-4">
                <span className="text-gray-300">Details</span>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
                  required
                />
              </label>

              <label className="block mb-4">
                <span className="text-gray-300">Time</span>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
                  required
                />
              </label>

              <label className="block mb-4">
                <span className="text-gray-300">Date</span>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
                  required
                />
              </label>

              <div className="flex justify-between mt-4">
                <button type="button" onClick={handleBack} className="bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded">Back</button>
                <button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded">Next</button>
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <label className="block mb-4">
                <span className="text-gray-300">Type</span>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
                  required
                >
                  <option value="Music">Music</option>
                  <option value="Concert">Concert</option>
                  <option value="Meetup">Meetup</option>
                  <option value="Festival">Festival</option>
                  <option value="Celebrations">Celebrations</option>
                  <option value="Events">Events</option>
                </select>
              </label>

              <div className="flex justify-between mt-4">
                <button type="button" onClick={handleBack} className="bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded">Back</button>
                <button type="submit" className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded">Submit</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateEventForm;
