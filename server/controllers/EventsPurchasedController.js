const { Purchase } = require("../models/purchaseModel");

const EventsPurchased = async (req, res) => {
    try {
      // identity comes from the authenticated JWT (set by protectRoute),
      // NOT a client-supplied header — prevents reading other users' purchases
      const userId = req.id;

      if (!userId) {
        return res.status(401).json({ message: 'not authenticated' });
      }

      // Find purchases made by the user
      const purchases = await Purchase.find({ userId }).populate('eventId');

      // Extract events from purchases, skipping any whose event was deleted
      // (populate returns null for a dangling reference)
      const eventsBought = purchases
        .filter((purchase) => purchase.eventId)
        .map((purchase) => ({
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
