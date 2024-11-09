const FetchAdminEvents = async (req, res) => {
    const { organiserId } = req.query;
    
    if (!organiserId) {
      return res.status(400).json({ message: "organiserId is required" });
    }
  
    try {
      const events = await EventsModel.find({ organiserId });
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: "Error fetching events", error });
    }
  };

  module.exports ={FetchAdminEvents}