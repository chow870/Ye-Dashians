const mongoose = require('mongoose');
const preferenceModel = require('../models/preferenceModel');
const preferenceSubmit = async (req, res) => {
    try {
        console.log("Reached the preferenceSubmit function");

        const formData = req.body; // Parsed JSON body
        const { slotId, myId } = req.query; // Extract query parameters

        if (!slotId || !myId || !formData) {
            return res.status(400).json({
                success: false,
                message: 'slotId, myId, and formData are required'
            });
        }

        const NewSlotId = new mongoose.Types.ObjectId(slotId);

        console.log("Received formData:", formData);

        // Create a new document in the preference collection
        const result = await preferenceModel.create({
            slotId: NewSlotId,
            userId: myId,
            preference: formData  // Store preferences
        });

        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Record inserted successfully',
            data: result
        });

    } catch (error) {
        console.error('Error inserting record:', error);

        // Send error response
        res.status(500).json({
            success: false,
            message: 'Error inserting record',
            error: error.message
        });
    }
};

const deletePreference = async (req, res) => {
    try {
        const {slotId} = req.query
        const idToDelete = slotId;
        
        if (!idToDelete) {
            throw new Error("Please provide a slot ID");
        }
        
        const deletedPreference = await preferenceModel.deleteMany({ slotId: idToDelete });
        
        if (deletedPreference) {
            return res.status(200).json({
                message: "Lobby prefenreces deleted successfully"
            });
        } else {
            return res.status(200).json({
                // in this case also the success needs to be true because if the lobby isnt present on the database (deleted by the users friend) then alos we have no problems
                success: true,
                message: "Lobby not found"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = { preferenceSubmit , deletePreference};
