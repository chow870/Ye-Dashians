const axios = require('axios');

const FetchPictures = async (req, res) => {
    const { photo_reference } = req.query;
    const apiKey = 'AIzaSyDN2sqMBvceRuAkBC0UlZ6KLIrEH9OjK2w';

    if (!photo_reference) {
        return res.status(400).json({ error: 'Missing photo reference' });
    }

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/photo`, {
            params: {
                photoreference: photo_reference,
                key: apiKey,
                maxwidth: 400
            },
            responseType: 'arraybuffer'
        });

        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        res.json({ image: `data:image/jpeg;base64,${base64Image}` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve photo' });
    }
};

module.exports = { FetchPictures };
