const mongoose = require('mongoose');

const EventsSchema = new mongoose.Schema({
  locationCoordinates: {
    
      type: Object,
      default: {},
      required: true,
  },
  locationName: {
    type: String,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  pricePerTicket: {
    type: Number,
    required: true,
  },
  organiserId: {
    type: String,
    required: true,
  },
  organiserName: {
    type: String,
    required: true,
  },
  organiserBankDetails: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ["Music", "Concert", "Meetup", "Festival", "Celebrations", "Events"],
    required: true,
  },
  attendees: {
    type: [String],
    default: [],
  },
});

const EventsModel = mongoose.model('Events', EventsSchema);
module.exports = EventsModel;
