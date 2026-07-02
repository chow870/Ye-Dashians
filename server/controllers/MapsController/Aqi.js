require('dotenv').config();
const WaetherSearch = async (req, res) => {

    const {lat,lng} = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lng}&days=1&aqi=yes&alerts=no`;
    
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

module.exports = { WaetherSearch};