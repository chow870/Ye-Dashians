import React, { useEffect, useState } from 'react';

export default function Aqi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const BackendBaseUrl = "https://ye-dashians-backend.onrender.com"
  const fetchData = async () => {
    if (currentLocation == null) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let response = await fetch(
        `${BackendBaseUrl}/maps/v1/WatherSearch?lat=${currentLocation.lat}&lng=${currentLocation.lng}`
      );
      if (response.ok) {
        let result = await response.json();
        setData(result.data);
      } else {
        console.log("The call was made but response was not okay. Status:", response.status);
      }
    } catch (err) {
      console.error("An error occurred while fetching AQI data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlerForAqi = (val) => {
    switch (val) {
      case 1: return "GOOD";
      case 2: return "Moderate";
      case 3:
      case 4: return "Unhealthy for sensitive groups";
      case 5: return "Very unhealthy";
      case 6: return "Hazardous";
      default: return "Unknown";
    }
  };

  const handlerForSuggestion = (val) => {
    switch (val) {
      case 1:
        return (
          <>
            <p>This is ideal weather to go outdoors and have fun.</p>
            <p>Check out our suggested venues based on previous choices.</p>
          </>
        );
      case 2:
        return (
          <>
            <p>This is fine weather to go outdoors and have fun.</p>
            <p>Check out our suggested venues based on previous choices.</p>
          </>
        );
      case 3:
      case 4:
        return (
          <>
            <p>The weather is generally fine but may be problematic for some people.</p>
            <p>Use a mask and stay hydrated.</p>
            <p>Check out our suggested venues based on previous choices.</p>
          </>
        );
      case 5:
        return (
          <>
            <p>The weather is problematic.</p>
            <p>Use a mask and stay hydrated.</p>
            <p>Check out our suggested venues based on previous choices.</p>
          </>
        );
      case 6:
        return (
          <>
            <p>The weather is unsuitable for outdoor activity.</p>
            <p>Consider rescheduling your plans for another day.</p>
          </>
        );
      default:
        return <p>AQI data is currently unavailable.</p>;
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }

    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setCurrentLocation({ lat: latitude, lng: longitude });
    }

    function error() {
      console.log("Unable to retrieve your location");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentLocation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % 2);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading...</p>;

  if (data == null || data.length === 0) return <p>Oops! Something went wrong.</p>;

  return (
    <div className="min-h-screen w-full p-4 border-2 border-gray-800 rounded-lg shadow-lg bg-black">
      <div className="carousel h-full w-full space-y-6 transition-all duration-700">
        {activeIndex === 0 && (
          <div className="p-6 bg-gray-900 text-gray-200 rounded-lg shadow-md transition-all duration-500 ease-in-out transform hover:scale-105">
            <h2 className="text-2xl font-bold text-blue-500 mb-4">Current Weather</h2>
            <div className="flex items-center space-x-4 mb-4">
              <img src={data.current.condition.icon} alt="Weather condition" className="w-16 h-16" />
              <div>
                <p className="text-lg font-semibold text-gray-100">
                  {data.location.name}, {data.location.country}
                </p>
                <p className="text-gray-400">{data.current.condition.text}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-gray-300">
              <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                <p>Temperature:</p>
                <p className="text-xl font-semibold">{data.current.temp_c}°C</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                <p>Humidity:</p>
                <p className="text-xl font-semibold">{data.current.humidity}%</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                <p>Visibility:</p>
                <p className="text-xl font-semibold">{data.current.vis_km} km</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-500">Suggestion</h3>
              <div className="text-gray-300 mt-2 space-y-1">
                {handlerForSuggestion(data?.current?.air_quality?.["us-epa-index"])}
              </div>
            </div>
          </div>
        )}
        {activeIndex === 1 && (
          <div className="p-6 bg-gray-900 text-gray-200 rounded-lg shadow-md transition-all duration-500 ease-in-out transform hover:scale-105">
            <h2 className="text-2xl font-bold text-green-500 mb-4">Today's Forecast</h2>
            <div className="flex items-center space-x-4 mb-4">
              <img src={data.forecast.forecastday[0].day.condition.icon} alt="Weather condition" className="w-16 h-16" />
              <div>
                <p className="text-lg font-semibold text-gray-100">
                  {data.location.name}, {data.location.country}
                </p>
                <p className="text-gray-400">{data.forecast.forecastday[0].day.condition.text}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-gray-300">
              <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                <p>Temperature Range:</p>
                <p className="text-xl font-semibold">
                  {data.forecast.forecastday[0].day.maxtemp_c}°C - {data.forecast.forecastday[0].day.mintemp_c}°C
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                <p>Sunrise:</p>
                <p className="text-xl font-semibold">{data.forecast.forecastday[0].astro.sunrise}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                <p>Sunset:</p>
                <p className="text-xl font-semibold">{data.forecast.forecastday[0].astro.sunset}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                <p>Humidity:</p>
                <p className="text-xl font-semibold">{data.forecast.forecastday[0].day.avghumidity}%</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
                <p>Visibility:</p>
                <p className="text-xl font-semibold">{data.forecast.forecastday[0].day.avgvis_km} km</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-500">Suggestion</h3>
              <div className="text-gray-300 mt-2 space-y-1">
                {handlerForSuggestion(data?.forecast?.forecastday?.[0]?.day?.air_quality?.["us-epa-index"])}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
