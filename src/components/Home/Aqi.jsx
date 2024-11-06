import React, { useEffect, useState } from 'react';

export default function Aqi() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0); // Track the current carousel slide

    const fetchData = async () => {
        if (currentLocation == null) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        try {
            let response = await fetch(`/maps/v1/WatherSearch?lat=${currentLocation.lat}&lng=${currentLocation.lng}`);
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
                return null;
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
            setActiveIndex((prevIndex) => (prevIndex + 1) % 2); // Switch between 0 and 1
        }, 5000); // 2-second interval

        return () => clearInterval(interval); // Clean up on unmount
    }, []);

    if (loading) return <p>Loading...</p>;

    if (data == null || data.length === 0) return <p>Oops! Something went wrong.</p>;

    return (
        <div className='h-full w-full border-2 border-black rounded-lg shadow-lg'>
            <div className="carousel h-full w-full p-4">
                {activeIndex === 0 && (
                    <div className="p-4 bg-blue-100 rounded">
                        <h2 className="text-xl font-semibold">CURRENT</h2>
                        <p>Place: {data.location.name}, {data.location.country}</p>
                        <p>Feels like: {data.current.feelslike_c}°C</p>
                        <p>Condition: {data.current.condition.text}</p>
                        <img src={data.current.condition.icon} alt="Weather condition" />
                        <p>Wind Speed: {data.current.wind_kph} kph</p>
                        <p>Humidity: {data.current.humidity}%</p>
                        <p>Visibility: {data.current.vis_km} km</p>
                        <p>AQI: {handlerForAqi(data.current.air_quality["us-epa-index"])}</p>
                        <h3 className="font-semibold mt-2">Suggestion</h3>
                        <div>{handlerForSuggestion(data.current.air_quality["us-epa-index"])}</div>
                    </div>
                )}

                {activeIndex === 1 && (
                    <div className="p-4 bg-green-100 rounded">
                        <h2 className="text-xl font-semibold">TODAY</h2>
                        <p>Place: {data.location.name}, {data.location.country}</p>
                        <p>Temperature Range: {data.forecast.forecastday[0].day.maxtemp_c}°C - {data.forecast.forecastday[0].day.mintemp_c}°C</p>
                        <p>Condition: {data.forecast.forecastday[0].day.condition.text}</p>
                        <img src={data.forecast.forecastday[0].day.condition.icon} alt="Weather condition" />
                        <p>Sunrise: {data.forecast.forecastday[0].astro.sunrise}</p>
                        <p>Sunset: {data.forecast.forecastday[0].astro.sunset}</p>
                        <p>Humidity: {data.forecast.forecastday[0].day.avghumidity}%</p>
                        <p>Visibility: {data.forecast.forecastday[0].day.avgvis_km} km</p>
                        <p>AQI: {handlerForAqi(data.forecast.forecastday[0].day.air_quality["us-epa-index"])}</p>
                        <h3 className="font-semibold mt-2">Suggestion</h3>
                        <div>{handlerForSuggestion(data.forecast.forecastday[0].day.air_quality["us-epa-index"])}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
