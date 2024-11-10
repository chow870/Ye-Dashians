require('dotenv').config();
const PlaceIdSearch = async (req, res) => {
  let { keyword, type, userId1, userId2, coordinate1, coordinate2, place_id } = req.query;
  console.log("The place_id is:", place_id);
  const apiKey = process.env.GOOGLE_MAPS_API;

  if (!place_id || !keyword || !type || !userId1 || !userId2 || !coordinate1 || !coordinate2) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Fetch place details first to get the coordinates
    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=delivery,dine_in,serves_dinner,takeout,reviews,photos,formatted_address,formatted_phone_number,current_opening_hours,wheelchair_accessible_entrance,geometry&key=AIzaSyDN2sqMBvceRuAkBC0UlZ6KLIrEH9OjK2w`;
    
    const placesResponse = await fetch(placeDetailsUrl);
    const placesData = await placesResponse.json();
    
    if (!placesData.result || !placesData.result.geometry) {
      return res.status(404).json({ error: 'Place details not found' });
    }

    // Extract latitude and longitude from place details
    const lat = placesData.result.geometry.location.lat;
    const lng = placesData.result.geometry.location.lng;
    console.log("Updated coordinates:", lat, lng);

    // Now, use the updated lat and lng to create distance matrix URLs
    const distanceUrl1 = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${coordinate1}&destinations=${lat},${lng}&units=metric&key=AIzaSyDN2sqMBvceRuAkBC0UlZ6KLIrEH9OjK2w`;
    const distanceUrl2 = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${coordinate2}&destinations=${lat},${lng}&units=metric&key=AIzaSyDN2sqMBvceRuAkBC0UlZ6KLIrEH9OjK2w`;

    // Make concurrent requests for distance
    const [user1DistanceResponse, user2DistanceResponse] = await Promise.all([
      fetch(distanceUrl1),
      fetch(distanceUrl2)
    ]);

    const user1DistanceData = await user1DistanceResponse.json();
    const user2DistanceData = await user2DistanceResponse.json();

    // Send final response
    res.json({
      additionalDetails: placesData,
      distances: [
        {
          userId: userId1,
          distance: user1DistanceData
        },
        {
          userId: userId2,
          distance: user2DistanceData
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching place details or distances:', error);
    res.status(500).json({ error: 'Error fetching place details or distances' });
  }
};

module.exports = { PlaceIdSearch };
