
const NearbySearch = async (req, res) => {
  
    const {lat,lng,type,keyword} = req.query;
    console.log("inside the NearbySearch controller with type and keyword ",type,keyword )
    const apiKey = 'AIzaSyDN2sqMBvceRuAkBC0UlZ6KLIrEH9OjK2w';
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=${keyword}&type=${type}&key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      res.status(200).json({
        success:true,
        data:data
      });
    } catch (error) {
      res.status(500).json({
        success:false,
        error: 'Error fetching events' });
    }
  };

module.exports = { NearbySearch };