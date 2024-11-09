const EventsModel = require("../models/eventsModel");
const CreateNewEvent = async (req, res) => {
    const {
      locationCoordinates,
      locationName,
      availableSeats,
      pricePerTicket,
      organiserId, // You’ll pass this directly from the global store on the frontend
      organiserName,
      organiserBankDetails,
      details,
      time,
      date,
      type
    } = req.body;
  
    try {
      const newEvent = new EventsModel({
        locationCoordinates,
        locationName,
        availableSeats,
        pricePerTicket,
        organiserId,
        organiserName,
        organiserBankDetails,
        details,
        time,
        date,
        type,
        attendees: [] // Initialize attendees as an empty array
      });
      
      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create event" });
    }
  };

  module.exports = {CreateNewEvent};