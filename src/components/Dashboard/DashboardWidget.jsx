import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../features/auth/AuthContext'; 
import apiClient from '../../api/apiClient'; 
import { format } from 'date-fns';
import { 
    WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm, WiFog, WiDayCloudy 
} from 'react-icons/wi';
import { BsSun } from 'react-icons/bs'; // Simple sun icon for date line

const DashboardWidget = () => {
    const { user } = useContext(AuthContext);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Helper to get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // 2. Helper to map API icon codes to React Icons
    const getWeatherIcon = (code) => {
        // OpenWeatherMap icon codes mapping
        switch (code) {
            case '01d': return <WiDaySunny className="text-5xl text-yellow-300" />;
            case '01n': return <WiDaySunny className="text-5xl text-gray-200" />; // Clear night
            case '02d': 
            case '02n': return <WiDayCloudy className="text-5xl text-gray-100" />;
            case '03d': 
            case '03n': 
            case '04d': 
            case '04n': return <WiCloud className="text-5xl text-gray-200" />;
            case '09d': 
            case '09n': 
            case '10d': 
            case '10n': return <WiRain className="text-5xl text-blue-200" />;
            case '11d': 
            case '11n': return <WiThunderstorm className="text-5xl text-yellow-200" />;
            case '13d': 
            case '13n': return <WiSnow className="text-5xl text-white" />;
            case '50d': 
            case '50n': return <WiFog className="text-5xl text-gray-300" />;
            default: return <WiDaySunny className="text-5xl text-yellow-300" />;
        }
    };

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Adjust route to match your backend setup
                const { data } = await apiClient.get('/weather/current');
                setWeather(data);
            } catch (error) {
                console.error("Failed to load weather widget", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    const todayDate = format(new Date(), 'EEEE, MMMM d, yyyy');
    const displayRole = user?.role === 'Hotel' ? 'Grand Palace Hotel' : user?.username || 'User'; 
    // ^ logic: If Hotel, you might want to fetch the real Hotel Name. 
    // For now, I hardcoded "Grand Palace Hotel" based on your image doodle, 
    // but ideally you replace 'Grand Palace Hotel' with user.username if that holds the hotel name.

    return (
        <div className="w-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] rounded-[2rem] p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
            
            {/* Background decoration (optional) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

            {/* LEFT SIDE: Greeting & Info */}
            <div className="z-10 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-blue-100 text-sm font-medium">
                    <BsSun className="animate-spin-slow" />
                    <span>{todayDate}</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mt-1">
                    {getGreeting()}, <span className="opacity-90">{user?.username || 'Guest'}</span>
                </h1>
                
                <p className="text-blue-100 text-sm md:text-base mt-1">
                    Here's what's happening at your property today
                </p>
            </div>

            {/* RIGHT SIDE: Weather Data */}
            <div className="z-10 flex items-center gap-4 mt-6 md:mt-0 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
                {loading ? (
                    <div className="animate-pulse flex items-center gap-4">
                        <div className="h-10 w-10 bg-white/20 rounded-full"></div>
                        <div className="h-8 w-16 bg-white/20 rounded"></div>
                    </div>
                ) : (
                    <>
                        {/* Weather Icon */}
                        <div>
                            {getWeatherIcon(weather?.iconCode)}
                        </div>

                        {/* Temp & Text */}
                        <div className="flex flex-col text-right">
                            <span className="text-3xl font-bold leading-none">
                                {weather?.temp}°C
                            </span>
                            <span className="text-sm text-blue-100 capitalize">
                                {weather?.description}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardWidget;