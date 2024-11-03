const mongoose = require('mongoose');
const preferenceModel = require('../models/preferenceModel');

const retryFindPreference = async (slotId, userId, retries, delay) => {
    // Convert slotId to ObjectId if not already
    console.log("retryFindPreference with slotId and UserId as : ",slotId, userId)
    const NewSlotId = new mongoose.Types.ObjectId(slotId);

    // Try to find the entry
    const result = await preferenceModel.findOne({
        slotId: NewSlotId,
        userId: userId,
    });

    // If found, return it
    if (result) {
        return result;
    }

    // If not found and retries remain, wait and try again
    if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay)); // Wait for the specified delay
        return retryFindPreference(slotId, userId, retries - 1, delay); // Retry
    }

    // If retries exhausted, return null or an appropriate value
    return null;
};

const FetchCoordinates = async (req, res) => {
    try {
        const { slotId, userId } = req.query; // Adjust as necessary
        const maxRetries = 5;  // Number of times to retry
        const delay = 3000;     // Delay in milliseconds between retries (2 seconds)

        // Poll for the document
        const result = await retryFindPreference(slotId, userId, maxRetries, delay);
        if (result) {
            res.status(200).json({
                success: true,
                message: 'Record found successfully',
                data: result
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Record not found within the timeout period {60 secs}'
            });
        }

    } catch (error) {
        console.error('Error finding record:', error);
        res.status(500).json({
            success: false,
            message: 'Error finding record',
            error: error.message
        });
    }
};

module.exports = { FetchCoordinates };
