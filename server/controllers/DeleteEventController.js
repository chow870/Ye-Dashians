const DeleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedEvent = await EventsModel.findByIdAndDelete(id);
      if (!deletedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting event", error });
    }
  }

  module.exports = {DeleteEvent}