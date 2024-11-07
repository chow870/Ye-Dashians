const { Purchase } = require("../models/purchaseModel");
const { Eventmodel } = require("../models/eventsModel");

const EventsPurchased = async (req, res) => {
    try {
      const userId = req.headers['userid']; // Assuming userId is passed in the headers
  
      if (!userId) {
        return res.status(400).json({ message: 'UserId is required in headers' });
      }
  
      // Find purchases made by the user
      const purchases = await Purchase.find({ userId }).populate('eventId');
  
      // Extract events from purchases
      const eventsBought = purchases.map((purchase) => ({
        eventId: purchase.eventId._id,
        locationName: purchase.eventId.locationName,
        organiserName: purchase.eventId.organiserName,
        details: purchase.eventId.details,
        date: purchase.eventId.date,
        time: purchase.eventId.time,
        pricePerTicket: purchase.eventId.pricePerTicket,
        ticketsBought: purchase.ticketsBought
      }));
  
      res.status(200).json(eventsBought); // array is sent as the response.
    } catch (error) {
      console.error('Error fetching user events:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  module.exports= {EventsPurchased}