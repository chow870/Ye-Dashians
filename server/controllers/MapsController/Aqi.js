const WaetherSearch = async (req, res) => {
  
    const {lat,lng} = req.query;
    // console.log("inside the Weather Search controller with type and keyword ", )
    const url = `http://api.weatherapi.com/v1/forecast.json?key=314673ea789f4a8e8e4142958240611&q=${lat},${lng}&days=1&aqi=yes&alerts=no`;
    
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