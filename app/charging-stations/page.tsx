'use client';

import React, { useState, useEffect } from 'react';

// Dynamically import map only on client
let MapContainer: any;
let TileLayer: any;
let Marker: any;
let Popup: any;

// Dummy Data
const STATIONS_DATA = [
    {
        id: 1,
        name: "Jaipur Marriott Hotel",
        provider: "Chargezone (India)",
        address: "Ashram Marg, Near Jawahar Circle",
        type: "CCS (Type 2) (30kW)",
        distance: "8.5 km away",
        position: [26.8524, 75.8052] as [number, number]
    },
    {
        id: 2,
        name: "Novotel Jaipur Convention Centre",
        provider: "Chargezone (India)",
        address: "Sitapur Industrial Area, Tonk Road, NH 12",
        type: "CCS (Type 2) (30kW)",
        distance: "15 km away",
        position: [26.7820, 75.8250] as [number, number]
    },
    {
        id: 3,
        name: "Statiq Charging Station",
        provider: "Statiq (IN)",
        address: "Entrance Gate, Mahindra World City",
        type: "CCS (Type 2) (30kW) · Type 2",
        distance: "21.2 km away",
        position: [26.8710, 75.6020] as [number, number]
    },
    {
        id: 4,
        name: "Hotel Highway King",
        provider: "Statiq (IN)",
        address: "Jaipur Kishangarh Expressway",
        type: "CCS (Type 2) (60kW)",
        distance: "35 km away",
        position: [26.8900, 75.5200] as [number, number]
    }
];

export default function ChargingStationsPage() {
    const [mapCenter, setMapCenter] = useState<[number, number]>([26.8524, 75.8052]);
    const [map, setMap] = useState<any>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Dynamically load leaflet and react-leaflet only on client
        // Inject leaflet CSS dynamically
        if (!document.querySelector('#leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        Promise.all([
            import('leaflet'),
            import('react-leaflet'),
        ]).then(([L, RL]) => {
            // Fix default marker icons
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
            MapContainer = RL.MapContainer;
            TileLayer = RL.TileLayer;
            Marker = RL.Marker;
            Popup = RL.Popup;
            setIsClient(true);
        });
    }, []);

    const handleViewOnMap = (position: [number, number]) => {
        setMapCenter(position);
        if (map) {
            map.setView(position, 14);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 text-white">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                    <a href="/" className="flex items-center gap-3 cursor-pointer">
                        <img src="/logo.png" alt="ev.BIKE Logo" className="h-8 w-auto object-contain" />
                        <span className="text-xl font-black tracking-tighter uppercase">
                            ev.<span className="text-[#79b947]">bike</span>
                        </span>
                    </a>

                    <nav className="hidden md:flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <a href="/" className="text-neutral-400 hover:text-white transition-colors">Home</a>
                        <a href="/compare" className="text-neutral-400 hover:text-white transition-colors">Comparison</a>
                        <a href="/brands" className="text-neutral-400 hover:text-white transition-colors">Brands</a>
                        <a href="/calculator" className="text-neutral-400 hover:text-white transition-colors">EV Calculator</a>
                        <a href="/reviews" className="text-neutral-400 hover:text-white transition-colors">Reviews</a>
                        <a href="/charging-stations" className="text-white border-b border-white/40 pb-0.5">Charging Stations</a>
                    </nav>

                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Title Header */}
                <div className="mb-6">
                    <span className="text-xs font-bold tracking-widest text-[#79b947] uppercase">// Location Services</span>
                    <h1 className="text-4xl font-extrabold mt-1">EV Charging Stations</h1>
                    <p className="text-neutral-400 text-sm mt-1">Locate nearby charging stations, explore charger types, and navigate instantly.</p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[550px]">

                    {/* Left: Map Box */}
                    <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800/60 rounded-2xl overflow-hidden relative">
                        {isClient && MapContainer ? (
                            <MapContainer
                                center={mapCenter}
                                zoom={11}
                                style={{ width: '100%', height: '100%' }}
                                ref={setMap}
                            >
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {STATIONS_DATA.map((station) => (
                                    <Marker key={station.id} position={station.position}>
                                        <Popup>
                                            <div style={{ color: '#000', fontWeight: 600 }}>{station.name}</div>
                                            <div style={{ color: '#333', fontSize: '12px' }}>{station.address}</div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-500">
                                <div className="text-center">
                                    <div className="text-3xl mb-3">🗺️</div>
                                    <p className="text-sm">Loading Map...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Sidebar */}
                    <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800/60 rounded-2xl p-4 flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center border-b border-neutral-800 pb-3 mb-3">
                            <h2 className="text-lg font-bold">Charging Points</h2>
                            <span className="text-xs text-blue-400 font-semibold">{STATIONS_DATA.length} found</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                            {STATIONS_DATA.map((station) => (
                                <div key={station.id} className="bg-neutral-950 border border-neutral-800/50 hover:border-neutral-700 p-4 rounded-xl transition-all group">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h3 className="font-bold text-base text-neutral-100 group-hover:text-[#79b947] transition-colors">{station.name}</h3>
                                            <p className="text-xs text-neutral-400 mt-0.5">{station.address}</p>
                                        </div>
                                        <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-900 px-2 py-0.5 rounded font-medium whitespace-nowrap">
                                            {station.provider}
                                        </span>
                                    </div>

                                    <div className="mt-3 text-xs text-neutral-400 bg-neutral-900/60 p-2 rounded-lg border border-neutral-800/40">
                                        <span className="text-[#79b947] font-semibold">⚡ Connectors: </span>
                                        {station.type}
                                    </div>

                                    <div className="mt-4 flex justify-between items-center gap-3">
                                        <span className="text-xs text-red-400 font-medium flex items-center gap-1">📍 {station.distance}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewOnMap(station.position)}
                                                className="text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg border border-neutral-700 transition-colors"
                                            >
                                                View on Map
                                            </button>
                                            <button className="text-xs font-bold bg-white text-black hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors">
                                                🚀 Navigate
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}