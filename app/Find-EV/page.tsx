'use client';

import React, { useState, useMemo } from 'react';

// Indian Market Live Real-Time EV Two-Wheeler Database
interface EVBike {
  id: number;
  name: string;
  brand: string;
  variant: string;
  price: number; // In Lakhs
  battery: string;
  bodyType: 'Hatchback' | 'SUV / MUV' | 'Sedan' | 'Compact' | 'Commuter' | 'Sports' | 'Scooter';
  range: number; // In KM
  chargingTime: number; // In Hours
  image: string;
}

const EV_BIKE_DATABASE: EVBike[] = [
  { id: 1, name: "Revolt RV400", brand: "Revolt Motors", variant: "BRRC PREMIUM STAGE", price: 1.45, battery: "3.24 kWh", bodyType: "Commuter", range: 150, chargingTime: 4.5, image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&q=80" },
  { id: 2, name: "Matter AERA 5000", brand: "Matter Energy", variant: "4-SPEED ACTIVE GEAR", price: 1.74, battery: "5.0 kWh", bodyType: "Sports", range: 125, chargingTime: 5, image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=400&q=80" },
  { id: 3, name: "Oben Rorr", brand: "Oben Electric", variant: "LFP HIGH PERFORMANCE", price: 1.50, battery: "4.4 kWh", bodyType: "Sports", range: 187, chargingTime: 2, image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80" },
  { id: 4, name: "Tork Kratos R", brand: "Tork Motors", variant: "ECO SYNC AXIAL", price: 1.68, battery: "4.0 kWh", bodyType: "Commuter", range: 180, chargingTime: 4, image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80" },
  { id: 5, name: "Ola S1 Pro Gen 2", brand: "Ola Electric", variant: "HYPERDRIVE PERFORMANCE", price: 1.40, battery: "4.0 kWh", bodyType: "Scooter", range: 195, chargingTime: 6.5, image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=400&q=80" },
  { id: 6, name: "Ather 450X Apex", brand: "Ather Energy", variant: "WARP PLUS WARP MODE", price: 1.75, battery: "3.7 kWh", bodyType: "Scooter", range: 157, chargingTime: 5.5, image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=400&q=80" }
];

export default function FindEVPage() {
  // Filters States setup mirroring the reference panel
  const [maxPrice, setMaxPrice] = useState<number>(2.5); // Default Max slider up to 2.5 Lakhs
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
  const [minRange, setMinRange] = useState<number>(0);
  const [speedFilter, setSpeedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const brandOptions = ["Revolt Motors", "Matter Energy", "Oben Electric", "Tork Motors", "Ola Electric", "Ather Energy"];
  const bodyTypes: { label: string; icon: string }[] = [
    { label: "Scooter", icon: "🛵" },
    { label: "Commuter", icon: "🏍️" },
    { label: "Sports", icon: "⚡" }
  ];

  // Helper toggle logic for checkbox layouts
  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleBodyTypeToggle = (type: string) => {
    setSelectedBodyTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleClearAll = () => {
    setMaxPrice(2.5);
    setSelectedBrands([]);
    setSelectedBodyTypes([]);
    setMinRange(0);
    setSpeedFilter('All');
    setSearchQuery('');
  };

  // Complex multi-layer dynamic execution pipeline
  const filteredBikes = useMemo(() => {
    return EV_BIKE_DATABASE.filter(bike => {
      if (bike.price > maxPrice) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(bike.brand)) return false;
      if (selectedBodyTypes.length > 0 && !selectedBodyTypes.includes(bike.bodyType)) return false;
      if (bike.range < minRange) return false;

      if (speedFilter === 'Fast' && bike.chargingTime > 3) return false;
      if (speedFilter === 'Normal' && bike.chargingTime <= 3) return false;

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesQuery = bike.name.toLowerCase().includes(query) || bike.brand.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [maxPrice, selectedBrands, selectedBodyTypes, minRange, speedFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans antialiased flex flex-col justify-between">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 text-white w-full">
        <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">

          {/* Logo Section */}
          <a href="/" className="flex items-center gap-3 cursor-pointer">
            <img src="/logo.png" alt="ev.BIKE Logo" className="h-9 w-auto object-contain" />
            <span className="text-xl font-black tracking-tighter uppercase">
              ev.<span className="text-[#79b947]">bike</span>
            </span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em]">
            <a href="/" className="text-neutral-400 hover:text-white transition-colors">Home</a>
            <a href="/compare" className="text-neutral-400 hover:text-white transition-colors">Comparison</a>
            <a href="/brands" className="text-neutral-400 hover:text-white transition-colors">Brands</a>
            <a href="/calculator" className="text-neutral-400 hover:text-white transition-colors">EV Calculator</a>
            <a href="/Find-EV" className="text-white border-b border-white/40 pb-0.5">Find-EV</a>
            <a href="/charging-stations" className="text-neutral-400 hover:text-white transition-colors">Charging Stations</a>
          </nav>

          {/* Get Started Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">
            Get Started
          </button>

        </div>
      </header>
      {/* Main Structural Framework Body */}
      <div className="max-w-[1400px] mx-auto w-full px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: FILTERS ENGINE PANEL */}
        <div className="lg:col-span-3 bg-[#111111] border border-neutral-900 rounded-2xl p-5 h-fit sticky top-6">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-4 mb-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-neutral-200">Filters</h2>
            <button onClick={handleClearAll} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors">
              Clear All ({selectedBrands.length + selectedBodyTypes.length})
            </button>
          </div>

          {/* 1. Price Range Custom Slider Control */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Price Range</h3>
            <div className="flex justify-between text-xs text-neutral-500 mb-2 font-mono">
              <span>₹0.5L</span>
              <span className="text-blue-400 font-bold">Up to ₹{maxPrice.toFixed(2)} Lakh</span>
              <span>₹2.5L+</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.05"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* 2. Brand Checkboxes Group Selector */}
          <div className="mb-6 border-t border-neutral-900 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Brand</h3>
            <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {brandOptions.map((brand) => (
                <label key={brand} className="flex items-center gap-3 text-xs text-neutral-300 cursor-pointer hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-4 h-4 rounded border-neutral-800 bg-neutral-900 text-blue-600 focus:ring-0 focus:ring-offset-0"
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          {/* 3. Body Type Grid Box Array Mapping */}
          <div className="mb-6 border-t border-neutral-900 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Vehicle Type</h3>
            <div className="grid grid-cols-3 gap-2">
              {bodyTypes.map((type) => {
                const active = selectedBodyTypes.includes(type.label);
                return (
                  <button
                    key={type.label}
                    onClick={() => handleBodyTypeToggle(type.label)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${active ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-[#161616] border-neutral-800 text-neutral-400 hover:border-neutral-700'}`}
                  >
                    <span className="text-sm">{type.icon}</span>
                    <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Range Filters Horizontal Nodes Array */}
          <div className="mb-6 border-t border-neutral-900 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Range (KM)</h3>
            <div className="grid grid-cols-2 gap-2">
              {[100, 150].map((rangeVal) => (
                <button
                  key={rangeVal}
                  onClick={() => setMinRange(minRange === rangeVal ? 0 : rangeVal)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${minRange === rangeVal ? 'bg-neutral-800 text-white border-neutral-600' : 'bg-[#161616] border-neutral-800/80 text-neutral-400 hover:text-white'}`}
                >
                  {rangeVal}+ KM
                </button>
              ))}
            </div>
          </div>

          {/* 5. Fast Charging Speed Toggles Array */}
          <div className="border-t border-neutral-900 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Charging Time</h3>
            <div className="space-y-2">
              {['All', 'Fast', 'Normal'].map((mode) => (
                <label key={mode} className="flex items-center gap-3 text-xs text-neutral-300 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="speed"
                    checked={speedFilter === mode}
                    onChange={() => setSpeedFilter(mode)}
                    className="w-4 h-4 border-neutral-800 bg-neutral-900 text-blue-600 focus:ring-0 focus:ring-offset-0"
                  />
                  {mode === 'All' ? 'All Speeds' : mode === 'Fast' ? 'Fast Charging (< 3 hrs)' : 'Normal Mode'}
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE LIVE EV CARDS VIEWPORT GRID PANEL */}
        <div className="lg:col-span-9 flex flex-col gap-6">

          {/* Header Subhead Node Descriptor Area */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111111] border border-neutral-900 rounded-2xl p-5">
            <div>
              <h1 className="text-xl font-black tracking-tight text-neutral-100">Search Results</h1>
              <p className="text-neutral-500 text-xs font-medium mt-0.5 font-mono">// {filteredBikes.length} VEHICLES MATCHING YOUR SCHEME</p>
            </div>

            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search brand, model, variant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161616] border border-neutral-800 text-xs rounded-xl p-3 pl-4 pr-10 text-neutral-200 focus:outline-none focus:border-blue-500 transition-all placeholder-neutral-600"
              />
              <span className="absolute right-3 top-3.5 text-neutral-600 text-sm">🔍</span>
            </div>
          </div>

          {/* Dynamic Core Grid Generator Component Loop */}
          {filteredBikes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredBikes.map((bike) => (
                <div key={bike.id} className="bg-[#141414] border border-neutral-900 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-neutral-800 transition-all group">

                  {/* Visual Frame Block Layout */}
                  <div className="relative h-44 bg-neutral-900 overflow-hidden">
                    <img
                      src={bike.image}
                      alt={bike.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 border border-neutral-800 backdrop-blur-md text-[9px] font-bold text-[#79b947] uppercase tracking-widest px-2 py-0.5 rounded-md font-mono">
                      {bike.bodyType}
                    </div>
                  </div>

                  {/* Node Content Meta Parameters Block */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-black text-lg text-neutral-100 tracking-tight leading-tight">{bike.name}</h3>
                        <span className="text-base font-black text-blue-400 font-mono whitespace-nowrap">₹{bike.price.toFixed(2)} Lakh</span>
                      </div>
                      <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5 font-mono">{bike.brand} • {bike.variant}</p>
                    </div>

                    {/* Specifications Metrics Horizontal Strip Panel */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-[#191919] p-3 rounded-xl border border-neutral-900/50">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider font-mono">🔋 Battery Pack:</span>
                        <span className="text-neutral-200 font-semibold">{bike.battery}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider font-mono">⚡ True Range:</span>
                        <span className="text-[#79b947] font-bold">{bike.range} KM</span>
                      </div>
                    </div>

                    {/* View Details Interactive Redirection Routing Buttons */}
                    <button
                      onClick={() => {
                        const currentBike = bike as any;
                        const targetId = currentBike["S.No."] || currentBike.id || currentBike["s_no"];

                        if (targetId) {
                          window.location.href = `/bike/${targetId}`;
                        } else {
                          alert("S.No. Key field mapping clear nahi hai client side par!");
                        }
                      }}
                      className="block w-full text-center text-xs font-bold bg-[#79b947] hover:bg-[#68a33b] text-neutral-950 py-3.5 rounded-xl tracking-wider transition-all uppercase font-mono shadow-lg"
                    >
                      View Full Details
                    </button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#111111] border border-neutral-900 rounded-2xl py-20 px-4 text-center text-neutral-500 flex flex-col items-center justify-center gap-3">
              <span className="text-3xl">🚴‍♂️</span>
              <p className="text-sm font-semibold text-neutral-400">No Electric Vehicles match your current filter array.</p>
              <button onClick={handleClearAll} className="text-xs text-blue-400 hover:underline font-bold mt-1">Reset Filter Criteria</button>
            </div>
          )}

        </div>

      </div>

      {/* Synchronized Unified Global EV.BIKE Platform Footer Section */}
      <footer className="bg-[#0b0b0b] border-t border-neutral-900/60 text-neutral-400 font-sans w-full pt-16 pb-12 mt-12 relative z-20">
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
              <a href="/home" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Home</a>
              <a href="/comparison" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Comparison</a>
              <a href="/brands" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Brands</a>
              <a href="/ev-calculator" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">EV Calculator</a>
              <a href="/Find-EV" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Find-EV</a>
              <a href="/charging-stations" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Charging Stations</a>
            </div>

            <div className="md:col-span-2 flex flex-col gap-2.5">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-300 mb-1 font-mono">// POPULAR BRANDS</h3>
              <a href="/brands/revolt-motors" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Revolt Motors</a>
              <a href="/brands/matter-energy" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Matter Energy</a>
              <a href="/brands/oben-electric" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Oben Electric</a>
              <a href="/brands/tork-motors" className="text-xs text-neutral-500 hover:text-white transition-colors w-fit">Tork Motors</a>
            </div>

            <div className="md:col-span-3 flex flex-col gap-2.5">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-300 mb-1 font-mono">// CONTACT SUPPORT</h3>
              <a href="tel:+916350571635" className="text-xs text-neutral-200 font-medium tracking-wide hover:text-[#79b947] transition-colors w-fit">+91 63505-71635</a>
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