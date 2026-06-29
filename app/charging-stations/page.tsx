'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Client layer injection setup for Next components
const MapContainerComponent = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayerComponent = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const MarkerComponent = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const PopupComponent = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

interface Station {
    id: number;
    name: string;
    provider: string;
    address: string;
    type: string;
    distance: string;
    isFast: boolean;
    position: [number, number];
}

export default function ChargingStationsPage() {
    const [stations, setStations] = useState<Station[]>([]);
    const [filteredStations, setFilteredStations] = useState<Station[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'fast'>('all');
    const [mapCenter, setMapCenter] = useState<[number, number]>([26.8420, 75.7963]); // Precise Center near Jaipur Marriott
    const [map, setMap] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    // 🔑 Secure Fallback for API integration check
    const TOMTOM_API_KEY = process.env.NEXT_PUBLIC_TOMTOM_API_KEY || '0S6Hw73oWlYvK9vXgG0bO2X8u5YFxo3V'; // Explicit string verification fallback

    // Global dynamic raster map grid source path
    const tomtomTileUrl = `https://a.api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=${TOMTOM_API_KEY}`;

    useEffect(() => {
        setIsClient(true);

        import('leaflet').then((L) => {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        });

        fetchStationsByLocation('Jaipur');
    }, []);

    useEffect(() => {
        if (filterType === 'fast') {
            setFilteredStations(stations.filter(s => s.isFast));
        } else {
            setFilteredStations(stations);
        }
    }, [filterType, stations]);

    const fetchStationsByLocation = async (locationName: string) => {
        try {
            setLoading(true);
            generateFallbackMockData(locationName);
        } catch (err) {
            generateFallbackMockData(locationName);
        } finally {
            setLoading(false);
        }
    };

    const generateFallbackMockData = (cityName: string) => {
        const coords: { [key: string]: [number, number] } = {
            delhi: [28.6139, 77.2090],
            mumbai: [19.0760, 72.8777],
            jaipur: [26.8420, 75.7963],
            bangalore: [12.9716, 77.5946]
        };

        const key = cityName.toLowerCase().trim();
        const targetCenter = coords[key] || [26.8420, 75.7963];

        const mockNodes: Station[] = [
            { id: 201, name: "Jaipur Marriott Hotel", provider: "Chargezone (India)", address: "Ashram Marg, Near Jawahar Circle", type: "CCS (Type 2) (30kW)", distance: "8.5 km away", isFast: true, position: [26.8420, 75.7963] },
            { id: 202, name: "Novotel Jaipur Convention Centre", provider: "Chargezone (India)", address: "Sitapur Industrial Area, Tonk Road, NH12", type: "CCS (Type 2) (30kW)", distance: "15 km away", isFast: true, position: [26.7725, 75.8320] },
            { id: 203, name: "Statiq Charging Station", provider: "Statiq (IN)", address: "Entrance Gate, Mahindra World City", type: "CCS (Type 2) (30kW) • Type 2 Connector", distance: "21.2 km away", isFast: true, position: [26.8850, 75.6410] },
            { id: 204, name: "Hotel Highway King", provider: "Statiq (IN)", address: "Jaipur Kishangarh Expressway", type: "AC (Type 2) (7kW) Standard", distance: "34 km away", isFast: false, position: [26.8200, 75.5100] }
        ];

        setStations(mockNodes);
        setMapCenter(targetCenter);
        if (map) map.setView(targetCenter, 13);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) fetchStationsByLocation(searchQuery);
    };

    const handleUseMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const userLoc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setMapCenter(userLoc);
                if (map) map.setView(userLoc, 13);
                fetchStationsByLocation("Near Me");
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white font-sans antialiased flex flex-col justify-between">

            <div className="w-full flex flex-col flex-1">
                {/* Navigation Navbar Bar */}
                <nav className="flex justify-between items-center px-8 py-4 border-b border-neutral-900 bg-[#0d0d0d]">
                    <div className="flex items-center gap-2">
                        <span className="text-[#79b947] text-2xl font-black tracking-tighter">⚡ EV.BIKE</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-xs font-bold tracking-wider text-neutral-400 uppercase">
                        <a href="#" className="hover:text-white transition-colors">Home</a>
                        <a href="#" className="hover:text-white transition-colors">Comparison</a>
                        <a href="#" className="hover:text-white transition-colors">Brands</a>
                        <a href="#" className="hover:text-white transition-colors text-[#79b947]">EV Calculator</a>
                        <a href="#" className="hover:text-white transition-colors">Reviews</a>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">
                        Get Started
                    </button>
                </nav>

                <div className="p-6 max-w-7xl mx-auto w-full flex-1 flex flex-col">
                    {/* Main Controls Layout Row Header */}
                    <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-neutral-100">EV Charging Stations</h1>
                            <p className="text-neutral-400 text-xs mt-0.5">Locate nearby charging stations, explore charger types, and navigate instantly.</p>
                        </div>

                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto max-w-lg">
                            <input
                                type="text"
                                placeholder="Search City (e.g., Delhi, Mumbai...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-[#141414] border border-neutral-800 text-xs rounded-xl block w-full md:w-64 p-3 text-neutral-200 focus:outline-none focus:border-blue-500 transition-all"
                            />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-3 rounded-xl transition-colors">
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={handleUseMyLocation}
                                className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white text-xs font-bold px-4 py-3 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5"
                            >
                                Use My Location
                            </button>
                        </form>
                    </div>

                    <div className="flex justify-between items-center bg-[#111111] border border-neutral-900 rounded-xl p-3 mb-6">
                        <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase pl-2">
                            📍 Showing Stations Near Center
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setFilterType('all')}
                                className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${filterType === 'all' ? 'bg-neutral-800 text-white border border-neutral-700' : 'text-neutral-400 hover:text-white'}`}
                            >
                                All Stations ({stations.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterType('fast')}
                                className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${filterType === 'fast' ? 'bg-neutral-800 text-white border border-neutral-700' : 'text-neutral-400 hover:text-white'}`}
                            >
                                Fast Chargers Only
                            </button>
                        </div>
                    </div>

                    {/* Interactive Grids */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px] flex-1 mb-8">

                        {/* Map Canvas Core Module */}
                        <div className="lg:col-span-7 bg-[#141414] border border-neutral-900 rounded-2xl overflow-hidden relative z-10 min-h-[400px] lg:min-h-full">
                            {isClient && !loading ? (
                                <MapContainerComponent center={mapCenter} zoom={13} style={{ width: '100%', height: '100%' }} ref={setMap}>
                                    <TileLayerComponent
                                        url={tomtomTileUrl}
                                        attribution='© TomTom'
                                    />
                                    {filteredStations.map((station) => (
                                        <MarkerComponent key={station.id} position={station.position}>
                                            <PopupComponent>
                                                <div className="text-neutral-900 p-1">
                                                    <strong className="block text-sm font-bold">{station.name}</strong>
                                                    <span className="text-xs text-neutral-500">{station.address}</span>
                                                </div>
                                            </PopupComponent>
                                        </MarkerComponent>
                                    ))}
                                </MapContainerComponent>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 gap-2 bg-[#141414]">
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-[10px] tracking-widest uppercase text-neutral-400">Loading Map Layer Engine...</p>
                                </div>
                            )}
                        </div>

                        {/* List Panels Layout Cards View */}
                        <div className="lg:col-span-5 bg-[#141414] border border-neutral-900 rounded-2xl p-4 flex flex-col h-[600px] lg:h-auto overflow-hidden">
                            <div className="flex justify-between items-center border-b border-neutral-800 pb-3 mb-3">
                                <h2 className="text-sm font-bold text-neutral-200 tracking-tight">Charging Points</h2>
                                <span className="text-xs text-neutral-500">{filteredStations.length} found</span>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                                {filteredStations.map((station) => (
                                    <div key={station.id} className="bg-[#1a1a1a] border border-neutral-800/80 p-4 rounded-xl hover:border-neutral-700 transition-all flex flex-col gap-2">

                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="font-bold text-base text-neutral-200 tracking-tight leading-tight">{station.name}</h3>
                                                <p className="text-xs text-neutral-400 mt-1">{station.address}</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded whitespace-nowrap">
                                                {station.provider}
                                            </span>
                                        </div>

                                        <div className="text-xs bg-[#222222] p-2.5 rounded-lg text-neutral-300 flex items-center gap-1.5 border border-neutral-800/50 my-1">
                                            <span className="text-[#79b947] font-bold">⚡ Connectors:</span> {station.type}
                                        </div>

                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-800/60">
                                            <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                                                📍 {station.distance}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setMapCenter(station.position);
                                                        if (map) map.setView(station.position, 15);
                                                    }}
                                                    className="text-[11px] font-bold bg-[#262626] text-neutral-300 hover:text-white border border-neutral-700/60 px-3 py-2 rounded-lg hover:bg-neutral-800 transition-all"
                                                >
                                                    View on Map
                                                </button>
                                                <a
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${station.position[0]},${station.position[1]}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[11px] font-bold bg-black text-white border border-neutral-800 hover:bg-neutral-900 px-3 py-2 rounded-lg transition-all flex items-center gap-1"
                                                >
                                                    Navigate
                                                </a>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* 🚀 EXACT MATCH EV.BIKE FOOTER INTEGRATION */}
            <footer className="bg-[#0b0b0b] border-t border-neutral-900/60 text-neutral-400 font-sans w-full pt-16 pb-12 relative z-20">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">

                        <div className="md:col-span-4 flex flex-col gap-4">
                            <span className="text-[#79b947] text-2xl font-black tracking-tighter">EV.BIKE</span>
                            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">
                                India's most trusted platform for finding, comparing, and analyzing electric vehicles within your budget.
                            </p>
                        </div>

                        <div className="md:col-span-2 md:col-start-6 flex flex-col gap-2.5">
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-300 mb-1 font-mono">// QUICK LINKS</h3>
                            <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">New Bikes</a>
                            <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Comparison</a>
                            <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Brands</a>
                            <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">EV Calculator</a>
                            <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Reviews</a>
                            <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Charging Stations</a>
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-2.5">
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-300 mb-1 font-mono">// POPULAR BRANDS</h3>
                            <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Revolt Motors</a>
                            <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Matter Energy</a>
                            <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Oben Electric</a>
                            <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Tork Motors</a>
                        </div>

                        <div className="md:col-span-3 flex flex-col gap-2.5">
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-300 mb-1 font-mono">// CONTACT SUPPORT</h3>
                            <p className="text-xs text-neutral-200 font-medium tracking-wide">+91 63505-71635</p>
                            <a href="mailto:info@evbike.com" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">info@evbike.com</a>
                        </div>

                    </div>

                    <div className="border-t border-neutral-900/40 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-wider text-neutral-600 uppercase font-mono">
                        <p>© 2026 EV.BIKE MATRIX MEDIA. ALL RIGHTS RESERVED.</p>
                        <span className="text-[9px] text-neutral-700 font-sans tracking-normal lowercase italic mt-2 md:mt-0">made for EV revolution</span>
                    </div>
                </div>
            </footer>

        </div>
    );
}