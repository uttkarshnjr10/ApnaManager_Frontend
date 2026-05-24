import { useCallback, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../features/auth/AuthContext';
import apiClient from '../../api/apiClient';
import { format } from 'date-fns';
import {
    WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm, WiFog, WiDayCloudy
} from 'react-icons/wi';
import { BsSun } from 'react-icons/bs';
import { FaMapMarkerAlt } from 'react-icons/fa';

// ── Geolocation helpers ──────────────────────────────────────
const GEO_STORAGE_KEY = 'apna_user_location';

/**
 * Retrieves saved location from localStorage.
 * @returns {{ lat: number, lon: number } | null}
 */
const getSavedLocation = () => {
    try {
        const raw = localStorage.getItem(GEO_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (typeof parsed.lat === 'number' && typeof parsed.lon === 'number') {
            return parsed;
        }
        return null;
    } catch {
        return null;
    }
};

/**
 * Saves location to localStorage for future sessions.
 * @param {number} lat
 * @param {number} lon
 */
const saveLocation = (lat, lon) => {
    try {
        localStorage.setItem(GEO_STORAGE_KEY, JSON.stringify({ lat, lon }));
    } catch {
        // localStorage full or blocked — silently ignore
    }
};

/**
 * Requests device geolocation via the browser API.
 * Returns a promise that resolves to { lat, lon } or rejects on denial/timeout.
 */
const requestGeolocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject(new Error('Geolocation not supported'));
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },
            (error) => reject(error),
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
        );
    });
};

// Helper for time-based content and aesthetics
const getTimeTheme = (hour) => {
    // Morning: 5 AM - 11:59 AM
    if (hour >= 5 && hour < 12) {
        return {
            gradient: 'from-amber-400 via-orange-500 to-sky-600',
            greeting: 'Good Morning',
            message: 'Have a wonderful and productive day!',
            icon: '☀️',
            badgeBg: 'bg-amber-500/20 text-amber-100 border-amber-500/30'
        };
    }
    // Afternoon: 12 PM - 4:59 PM
    if (hour >= 12 && hour < 17) {
        return {
            gradient: 'from-sky-400 via-blue-500 to-indigo-600',
            greeting: 'Good Afternoon',
            message: 'Hope you are having a productive afternoon!',
            icon: '🌤️',
            badgeBg: 'bg-sky-500/20 text-sky-100 border-sky-500/30'
        };
    }
    // Evening: 5 PM - 9:59 PM
    if (hour >= 17 && hour < 22) {
        return {
            gradient: 'from-indigo-600 via-purple-600 to-pink-700',
            greeting: 'Good Evening',
            message: 'Time to wind down. Have a relaxing evening!',
            icon: '🌙',
            badgeBg: 'bg-purple-500/20 text-purple-100 border-purple-500/30'
        };
    }
    // Night: 10 PM - 4:59 AM
    return {
        gradient: 'from-slate-900 via-slate-800 to-indigo-950',
        greeting: 'Good Night',
        message: 'Rest well and recharge for tomorrow.',
        icon: '🌌',
        badgeBg: 'bg-indigo-500/20 text-indigo-100 border-indigo-500/30'
    };
};

// ── Component ────────────────────────────────────────────────

const DashboardWidget = () => {
    const { user } = useContext(AuthContext);

    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'requesting' | 'granted' | 'denied'

    const getWeatherIcon = (code) => {
        switch (code) {
            case '01d': return <WiDaySunny className="text-2xl sm:text-3xl text-amber-300" />;
            case '01n': return <WiDaySunny className="text-2xl sm:text-3xl text-blue-200" />;
            case '02d': case '02n': return <WiDayCloudy className="text-2xl sm:text-3xl text-blue-200" />;
            case '03d': case '03n': case '04d': case '04n': return <WiCloud className="text-2xl sm:text-3xl text-blue-200" />;
            case '09d': case '09n': case '10d': case '10n': return <WiRain className="text-2xl sm:text-3xl text-blue-200" />;
            case '11d': case '11n': return <WiThunderstorm className="text-2xl sm:text-3xl text-amber-200" />;
            case '13d': case '13n': return <WiSnow className="text-2xl sm:text-3xl text-white" />;
            case '50d': case '50n': return <WiFog className="text-2xl sm:text-3xl text-blue-200" />;
            default: return <WiDaySunny className="text-2xl sm:text-3xl text-amber-300" />;
        }
    };

    /**
     * Fetches weather from the API.
     * Accepts optional coords — if not provided, the backend falls back to hotel state / default city.
     */
    const fetchWeather = useCallback(async (coords) => {
        try {
            const params = {};
            if (coords) {
                params.lat = coords.lat;
                params.lon = coords.lon;
            }
            const { data } = await apiClient.get('/weather/current', { params });
            setWeather(data);
        } catch (error) {
            console.error("Failed to load weather widget", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        const initWeather = async () => {
            // 1. Check for a previously saved location
            const saved = getSavedLocation();
            if (saved) {
                setLocationStatus('granted');
                fetchWeather(saved);
                return;
            }

            // 2. Request geolocation from the browser
            setLocationStatus('requesting');
            try {
                const coords = await requestGeolocation();
                if (cancelled) return;
                saveLocation(coords.lat, coords.lon);
                setLocationStatus('granted');
                fetchWeather(coords);
            } catch {
                if (cancelled) return;
                // Permission denied or timeout — fall back to server-side default
                setLocationStatus('denied');
                fetchWeather(null);
            }
        };

        initWeather();
        return () => { cancelled = true; };
    }, [fetchWeather]);

    /**
     * Allows the user to manually re-request location if they initially denied it.
     */
    const handleRetryLocation = async () => {
        setLocationStatus('requesting');
        setLoading(true);
        try {
            const coords = await requestGeolocation();
            saveLocation(coords.lat, coords.lon);
            setLocationStatus('granted');
            fetchWeather(coords);
        } catch {
            setLocationStatus('denied');
            setLoading(false);
        }
    };

    const todayDate = format(new Date(), 'EEEE, MMMM d, yyyy');
    const currentHour = new Date().getHours();
    const theme = getTimeTheme(currentHour);

    return (
        <div className={`w-full rounded-2xl bg-gradient-to-br ${theme.gradient} p-4 sm:p-6 text-white shadow-md border border-white/10 transition-all duration-500`}>
            <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between">
                {/* Left side: Date, Time-appropriate greeting, Username, and custom time message */}
                <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold backdrop-blur-sm ${theme.badgeBg}`}>
                            <BsSun className="flex-shrink-0 animate-[spin_8s_linear_infinite]" />
                            <span>{todayDate}</span>
                        </span>
                        <span className="text-sm sm:text-lg">{theme.icon}</span>
                    </div>

                    <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl leading-tight">
                        {theme.greeting}, <span className="text-white/95">{user?.username || 'Guest'}</span>
                    </h2>

                    <p className="text-xs font-medium text-white/80 sm:text-sm md:text-base max-w-xl">
                        {theme.message}
                    </p>
                </div>

                {/* Right side: Weather display */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md shadow-inner transition-all hover:bg-white/20">
                        {loading ? (
                            <div className="flex items-center gap-2 animate-pulse">
                                <div className="h-6 w-6 rounded-full bg-white/20" />
                                <div className="space-y-1">
                                    <div className="h-3.5 w-10 rounded bg-white/20" />
                                    <div className="h-2.5 w-12 rounded bg-white/20" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="drop-shadow-md">{getWeatherIcon(weather?.iconCode)}</div>
                                <div className="flex flex-col">
                                    <span className="text-sm sm:text-base md:text-lg font-bold leading-none">{weather?.temp ?? '--'}°C</span>
                                    <span className="mt-0.5 text-[10px] sm:text-xs font-medium capitalize text-white/80 leading-none">{weather?.location || 'Unknown'}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {locationStatus === 'denied' && (
                        <button
                            type="button"
                            onClick={handleRetryLocation}
                            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-[10px] sm:text-xs font-semibold text-white transition-all hover:bg-white/25 active:scale-95"
                            title="Enable location for accurate weather"
                        >
                            <FaMapMarkerAlt size={11} className="animate-bounce" />
                            <span>Enable Location</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardWidget;
