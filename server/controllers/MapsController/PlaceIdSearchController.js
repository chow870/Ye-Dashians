const PlaceIdSearch = async (req, res) => {
    const { lat, lng, keyword, type, userId1, userId2, coordinate1, coordinate2 } = req.query;
    const apiKey = 'AIzaSyDN2sqMBvceRuAkBC0UlZ6KLIrEH9OjK2w';
  
    if (!lat || !lng || !keyword || !type || !userId1 || !userId2 || !coordinate1 || !coordinate2) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
  
    const nearbyPlacesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=${keyword}&type=${type}&key=${apiKey}`;
    const distanceUrl1 = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${coordinate1}&destinations=${lat},${lng}&key=${apiKey}`;
    const distanceUrl2 = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${coordinate2}&destinations=${lat},${lng}&key=${apiKey}`;
  
    try {
      // Make concurrent requests
      const [placesResponse, user1DistanceResponse, user2DistanceResponse] = await Promise.all([
        fetch(nearbyPlacesUrl),
        fetch(distanceUrl1),
        fetch(distanceUrl2)
      ]);
  
      const placesData = await placesResponse.json();
      const user1DistanceData = await user1DistanceResponse.json();
      const user2DistanceData = await user2DistanceResponse.json();
  
      res.json({
        additionalDetails: placesData,
        distances:[
            {userId1,
              distance:user1DistanceData},
            {userId2,
              distance:user2DistanceData}
        ]
      });
    } catch (error) {
      console.error('Error fetching place details:', error);
      res.status(500).json({ error: 'Error fetching place details' });
    }
  };

  module.exports= {PlaceIdSearch}
  
  