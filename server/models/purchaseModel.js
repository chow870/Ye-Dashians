const mongoose = require('mongoose');

const PurchasesSchema = new mongoose.Schema({
    userId: {
      type:String,
      required: true
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventsModel',
      required: true
    },
    ticketsBought: {
      type: Number,
      required: true
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    }
  });
  const Purchase = mongoose.model('Purchase', PurchasesSchema);
  module.exports ={Purchase}
