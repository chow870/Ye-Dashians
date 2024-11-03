const mongoose = require('mongoose');
const preferenceMatchingModel = require('../models/PreferenceMatchingModel');

const retryFindOtherPreference = async (slotId, userId, retries, delay) => {
    // Convert slotId to ObjectId if not already
    const NewSlotId = new mongoose.Types.ObjectId(slotId);

    // Try to find the entry
    const result = await preferenceMatchingModel.findOne({
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
        return retryFindOtherPreference(slotId, userId, retries - 1, delay); // Retry
    }

    // If retries exhausted, return null or an appropriate value
    return null;
};

const FetchOtherPreference = async (req, res) => {
    try {
        const { slotId, userId } = req.query; // Adjust as necessary
        const maxRetries = 20;  // Number of times to retry
        const delay = 3000;     // Delay in milliseconds between retries (2 seconds)

        // Poll for the document
        const result = await retryFindOtherPreference(slotId, userId, maxRetries, delay);
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

module.exports = { FetchOtherPreference };
