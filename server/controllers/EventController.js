const EventsModel = require("../models/eventsModel");
const EventFetch = async (req, res) => {
    try {
      const types = req.query.types ? req.query.types.split(',') : [];
      console.log("the types received in the backend of EventFetch: ", types);
      const events = await EventsModel.find({
        type: { $in: types } 
      });
      console.log(events)
      res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Error fetching events' });
    }
  }

  module.exports={EventFetch}