import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../features/auth/AuthContext'; 
import apiClient from '../../api/apiClient'; 
import { format } from 'date-fns';
import { 
    WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm, WiFog, WiDayCloudy 
} from 'react-icons/wi';
import { BsSun, BsStars } from 'react-icons/bs'; // Added BsStars for AI
import { FaSyncAlt } from 'react-icons/fa'; // For refresh button

// Import the service we created
import { fetchDailyAIReport } from '../../services/reportService';

const DashboardWidget = () => {
    const { user } = useContext(AuthContext);
    
    // Existing States
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    // New AI Report States
    const [aiReport, setAiReport] = useState('');
    const [aiLoading, setAiLoading] = useState(true);
    const [aiError, setAiError] = useState(false);

    // 1. Helper to get greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // 2. Helper for Weather Icons
    const getWeatherIcon = (code) => {
        switch (code) {
            case '01d': return <WiDaySunny className="text-5xl text-yellow-300" />;
            case '01n': return <WiDaySunny className="text-5xl text-gray-200" />;
            case '02d': case '02n': return <WiDayCloudy className="text-5xl text-gray-100" />;
            case '03d': case '03n': case '04d': case '04n': return <WiCloud className="text-5xl text-gray-200" />;
            case '09d': case '09n': case '10d': case '10n': return <WiRain className="text-5xl text-blue-200" />;
            case '11d': case '11n': return <WiThunderstorm className="text-5xl text-yellow-200" />;
            case '13d': case '13n': return <WiSnow className="text-5xl text-white" />;
            case '50d': case '50n': return <WiFog className="text-5xl text-gray-300" />;
            default: return <WiDaySunny className="text-5xl text-yellow-300" />;
        }
    };

    // Fetch Weather (Existing)
    useEffect(() => {
        const fetchWeather = async () => {
            try {
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

    // Fetch AI Report (New)
   const getAIAnalysis = async () => {
        // If user is Police, don't even try (Optimization)
        if (user?.role === 'Police') {
            setAiReport("Daily intelligence summaries are currently optimized for Admin & Hotel use only.");
            setAiLoading(false);
            return;
        }

        setAiLoading(true);
        setAiError(false);
        try {
            const data = await fetchDailyAIReport();
            setAiReport(data.summary);
        } catch (err) {
            // If API returns 403 (Forbidden/Disabled), show a gentle message
            if (err.response && err.response.status === 403) {
               setAiReport("AI Insights are not enabled for this account type.");
            } else {
               setAiError(true);
            }
        } finally {
            setAiLoading(false);
        }
    };

    useEffect(() => {
        getAIAnalysis();
    }, []);

    const todayDate = format(new Date(), 'EEEE, MMMM d, yyyy');

    return (
        <div className="w-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

            {/* TOP ROW: Greeting & Weather */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10">
                {/* LEFT: Greeting */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-blue-100 text-sm font-medium">
                        <BsSun className="animate-spin-slow" />
                        <span>{todayDate}</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold mt-1">
                        {getGreeting()}, <span className="opacity-90">{user?.username || 'Guest'}</span>
                    </h1>
                </div>

                {/* RIGHT: Weather Data */}
                <div className="flex items-center gap-4 mt-6 md:mt-0 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
                    {loading ? (
                        <div className="animate-pulse flex items-center gap-4">
                            <div className="h-10 w-10 bg-white/20 rounded-full"></div>
                            <div className="h-8 w-16 bg-white/20 rounded"></div>
                        </div>
                    ) : (
                        <>
                            <div>{getWeatherIcon(weather?.iconCode)}</div>
                            <div className="flex flex-col text-right">
                                <span className="text-3xl font-bold leading-none">{weather?.temp}°C</span>
                                <span className="text-sm text-blue-100 capitalize">{weather?.description}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* BOTTOM ROW: AI Intelligence Briefing */}
            <div className="relative z-10 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-100 flex items-center gap-2">
                        <BsStars className="text-yellow-300" /> 
                        Daily Intelligence Briefing
                    </h3>
                    <button 
                        onClick={getAIAnalysis} 
                        className={`hover:bg-white/10 p-1.5 rounded-full transition-colors ${aiLoading ? 'animate-spin' : ''}`}
                        title="Refresh Analysis"
                    >
                        <FaSyncAlt size={12} />
                    </button>
                </div>

                <div className="bg-black/10 rounded-xl p-4 backdrop-blur-sm border border-white/5 min-h-[60px]">
                    {aiLoading ? (
                        <div className="space-y-2 animate-pulse">
                            <div className="h-3 bg-white/20 rounded w-3/4"></div>
                            <div className="h-3 bg-white/20 rounded w-full"></div>
                        </div>
                    ) : aiError ? (
                        <p className="text-sm text-red-200">Unable to generate report right now.</p>
                    ) : (
                        <p className="text-sm md:text-base leading-relaxed text-blue-50">
                            {aiReport || "No significant activity recorded yet for today."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardWidget;