import { useCallback, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../features/auth/AuthContext';
import apiClient from '../../api/apiClient';
import { format } from 'date-fns';
import {
    WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm, WiFog, WiDayCloudy
} from 'react-icons/wi';
import { BsSun, BsStars } from 'react-icons/bs';
import { FaSyncAlt, FaMapMarkerAlt } from 'react-icons/fa';

import { fetchDailyAIReport } from '../../services/reportService';

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

// ── Component ────────────────────────────────────────────────

const DashboardWidget = () => {
    const { user } = useContext(AuthContext);

    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'requesting' | 'granted' | 'denied'
    const [aiReport, setAiReport] = useState('');
    const [aiLoading, setAiLoading] = useState(true);
    const [aiError, setAiError] = useState(false);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getWeatherIcon = (code) => {
        switch (code) {
            case '01d': return <WiDaySunny className="text-3xl text-amber-200" />;
            case '01n': return <WiDaySunny className="text-3xl text-blue-100" />;
            case '02d': case '02n': return <WiDayCloudy className="text-3xl text-blue-100" />;
            case '03d': case '03n': case '04d': case '04n': return <WiCloud className="text-3xl text-blue-100" />;
            case '09d': case '09n': case '10d': case '10n': return <WiRain className="text-3xl text-blue-100" />;
            case '11d': case '11n': return <WiThunderstorm className="text-3xl text-amber-100" />;
            case '13d': case '13n': return <WiSnow className="text-3xl text-white" />;
            case '50d': case '50n': return <WiFog className="text-3xl text-blue-100" />;
            default: return <WiDaySunny className="text-3xl text-amber-200" />;
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

    const getAIAnalysis = useCallback(async () => {
        if (user?.role === 'Police') {
            setAiReport('Daily intelligence summaries are currently optimized for Admin & Hotel use only.');
            setAiLoading(false);
            return;
        }

        setAiLoading(true);
        setAiError(false);
        try {
            const data = await fetchDailyAIReport();
            setAiReport(data.summary);
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setAiReport('AI Insights are not enabled for this account type.');
            } else {
                setAiError(true);
            }
        } finally {
            setAiLoading(false);
        }
    }, [user?.role]);

    useEffect(() => {
        getAIAnalysis();
    }, [getAIAnalysis]);

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

    return (
        <div className="w-full rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-blue-100">
                        <BsSun className="flex-shrink-0" />
                        <span className="truncate">{todayDate}</span>
                    </div>
                    <h2 className="text-lg font-semibold leading-tight md:text-xl">
                        {getGreeting()}, <span>{user?.username || 'Guest'}</span>
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex w-fit items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2">
                        {loading ? (
                            <div className="flex items-center gap-2 animate-pulse">
                                <div className="h-6 w-6 rounded-full bg-white/20" />
                                <div className="h-4 w-12 rounded bg-white/20" />
                            </div>
                        ) : (
                            <>
                                <div>{getWeatherIcon(weather?.iconCode)}</div>
                                <div className="text-right">
                                    <span className="block text-base font-bold leading-none">{weather?.temp}°C</span>
                                    <span className="text-xs capitalize text-blue-100">{weather?.location}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Retry location button — only visible when location was denied */}
                    {locationStatus === 'denied' && (
                        <button
                            type="button"
                            onClick={handleRetryLocation}
                            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-2 text-xs font-medium text-blue-100 transition-colors hover:bg-white/20"
                            title="Enable location for accurate weather"
                        >
                            <FaMapMarkerAlt size={12} />
                            <span className="hidden sm:inline">Enable Location</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                        <BsStars className="text-amber-200" />
                        Daily Intelligence Briefing
                    </h3>
                    <button
                        onClick={getAIAnalysis}
                        className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-white/15 px-3 text-xs font-medium text-white transition-colors hover:bg-white/25 ${aiLoading ? 'cursor-wait' : ''}`}
                        type="button"
                    >
                        <FaSyncAlt className={aiLoading ? 'animate-spin' : ''} size={12} />
                        Generate Report
                    </button>
                </div>

                {aiLoading ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-3 w-3/4 rounded bg-white/20" />
                        <div className="h-3 w-full rounded bg-white/20" />
                    </div>
                ) : aiError ? (
                    <p className="text-sm text-red-100">Unable to generate report right now.</p>
                ) : (
                    <p className="text-sm leading-relaxed text-blue-50">
                        {aiReport || 'No significant activity recorded yet for today.'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default DashboardWidget;
