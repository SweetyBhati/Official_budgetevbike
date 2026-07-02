'use client';

import { useEffect, useState } from 'react';
import { supabase, getBikeImageUrl } from '@/lib/supabase';
import { ArrowLeft, Zap, Gauge, BatteryCharging, ShieldAlert } from 'lucide-react';

interface ElectricBike {
  id: number;
  name: string;
  brand: string;
  price: number;
  range_km: number;
  top_speed: number;
  battery_capacity: string;
  charge_time: string;
  image_url: string;
  segment?: string;
  vehicle_type?: string;
}

export default function ComparePage() {
  const [bikes, setBikes] = useState<ElectricBike[]>([]);
  const [bikeA, setBikeA] = useState<ElectricBike | null>(null);
  const [bikeB, setBikeB] = useState<ElectricBike | null>(null);
  const [bikeC, setBikeC] = useState<ElectricBike | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSelectC = (id: string) => {
    const selected = bikes.find((b) => String(b.id) === String(id));
    setBikeC(selected || null);
  };
  useEffect(() => {
    async function fetchBikes() {
      try {
        const { data, error } = await supabase
          .from('electric_bikes')
          .select('*');

        if (!error && data) {
          const mappedBikes: ElectricBike[] = data.map((item: any) => {
            const range = Number(item['Certified Range (km)']) || 0;
            const topSpeed = Number(item['Top Speed (km/h)']) || 0;
            const battery = Number(item['Battery Capacity (kWh)']) || 2;

            let estimatedPrice = 80000 + (range * 300) + (topSpeed * 400) + (battery * 5000);
            estimatedPrice = Math.round(estimatedPrice / 1000) * 1000;

            const image_url = getBikeImageUrl(item['Brand / OEM'] || 'Unknown', item['Model Name'] || 'E-Bike');

            return {
              id: item['S.No.'] || Math.random(),
              name: item['Model Name'] || 'E-Bike',
              brand: item['Brand / OEM'] || 'Unknown',
              price: estimatedPrice,
              range_km: range,
              top_speed: topSpeed,
              battery_capacity: item['Battery Capacity (kWh)'] ? `${item['Battery Capacity (kWh)']} kWh` : '2 kWh',
              charge_time: item['Charge Time'] || '4-5 Hours',
              image_url: image_url,
              segment: item['Segment'] || 'N/A',
              vehicle_type: item['Vehicle Type'] || 'N/A'
            };
          });

          setBikes(mappedBikes);
          if (mappedBikes.length > 0) {
            setBikeA(mappedBikes[0]);
          }
          if (mappedBikes.length > 1) {
            setBikeB(mappedBikes[1]);
          }
          if (mappedBikes.length > 2) {
            setBikeC(mappedBikes[2]);
          }
        }
      } catch (err) {
        console.error("Error fetching comparison bikes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBikes();
  }, []);

  const handleSelectA = (id: string) => {
    const selected = bikes.find(b => b.id.toString() === id);
    if (selected) setBikeA(selected);
  };

  const handleSelectB = (id: string) => {
    const selected = bikes.find(b => b.id.toString() === id);
    if (selected) setBikeB(selected);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 text-white">
        {/* Yahan max-w-7xl ko max-w-[1400px] aur h-16 ko h-24 kar diya */}
        <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">

          <a href="/" className="flex items-center gap-3 cursor-pointer">
            {/* Yahan logo ki height h-8 se badha kar h-9 kar di */}
            <img src="/logo.png" alt="ev.BIKE Logo" className="h-9 w-auto object-contain" />
            <span className="text-xl font-black tracking-tighter uppercase">
              ev.<span className="text-[#79b947]">bike</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-[0.15em]">
            <a href="/" className="text-neutral-400 hover:text-white transition-colors">Home</a>
            <a href="/compare" className="text-white border-b border-white/40 pb-0.5">Comparison</a>
            <a href="/brands" className="text-neutral-400 hover:text-white transition-colors">Brands</a>
            <a href="/calculator" className="text-neutral-400 hover:text-white transition-colors"> EV Calculator</a>
            <a href="/Find-EV" className="text-neutral-400 hover:text-white transition-colors">Find-EV</a>
            <a href="/charging-stations" className="text-neutral-400 hover:text-white transition-colors">Charging Stations</a>
          </nav>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <span className="text-[#79b947] font-mono text-[10px] uppercase tracking-[0.2em] mb-3 block">// Side-By-Side Spec Comparison</span>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase">Compare E-Bikes</h1>
          <p className="text-neutral-500 text-sm mt-1">Select two electric two-wheelers to compare technical specifications side-by-side</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#79b947]"></div>
            <p className="text-neutral-500 text-xs mt-3 font-mono tracking-wider">LOADING COMPARISON DATA...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Pickers Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Bike A Selector */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col gap-4">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Select Bike A</span>
                <select
                  value={bikeA?.id || ''}
                  onChange={(e) => handleSelectA(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-bold text-neutral-200 outline-none focus:ring-2 ring-[#79b947]/20"
                >
                  {bikes.map(b => (
                    <option key={`a-${b.id}`} value={b.id}>{b.brand} {b.name} ({b.segment})</option>
                  ))}
                </select>
              </div>

              {/* Bike B Selector */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col gap-4">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Select Bike B</span>
                <select
                  value={bikeB?.id || ''}
                  onChange={(e) => handleSelectB(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-bold text-neutral-200 outline-none focus:ring-2 ring-[#79b947]/20"
                >
                  {bikes.map(b => (
                    <option key={`b-${b.id}`} value={b.id}>{b.brand} {b.name} ({b.segment})</option>
                  ))}
                </select>
              </div>

              {/* /* Bike C Selector */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  SELECT BIKE C
                </span>
                <select
                  value={bikeC?.id || ''}
                  onChange={(e) => handleSelectC(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-700 transition-colors"
                >
                  <option value="">Select a bike...</option>
                  {bikes.map((b) => (
                    <option key={`c-${b.id}`} value={b.id}>
                      {b.brand} {b.name} ({b.segment})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Side-by-Side Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card A */}
              {bikeA && (
                <div className="bg-neutral-900 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-lg flex flex-col">
                  <div className="aspect-[16/8] bg-neutral-800 relative">
                    <img src={bikeA.image_url} alt={bikeA.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-neutral-950/90 border border-neutral-800 px-3 py-1 rounded text-xs font-black uppercase text-[#79b947]">
                      {bikeA.brand}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-extrabold text-white">{bikeA.brand} {bikeA.name}</h2>
                      <div className="text-xl font-black text-[#79b947] mt-2">
                        ₹{bikeA.price.toLocaleString('en-IN')} <span className="text-[10px] text-neutral-500 uppercase font-mono tracking-normal">Estimated Price</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Card B */}
              {bikeB && (
                <div className="bg-neutral-900 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-lg flex flex-col">
                  <div className="aspect-[16/8] bg-neutral-800 relative">
                    <img src={bikeB.image_url} alt={bikeB.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-neutral-950/90 border border-neutral-800 px-3 py-1 rounded text-xs font-black uppercase text-[#79b947]">
                      {bikeB.brand}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-extrabold text-white">{bikeB.brand} {bikeB.name}</h2>
                      <div className="text-xl font-black text-[#79b947] mt-2">
                        ₹{bikeB.price.toLocaleString('en-IN')} <span className="text-[10px] text-neutral-500 uppercase font-mono tracking-normal">Estimated Price</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* /* Card C */}
              {bikeC && (
                <div className="bg-neutral-900 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                  <div className="aspect-[16/8] bg-neutral-800 relative">
                    <img
                      src={bikeC.image_url}
                      alt={bikeC.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-neutral-950/90 border border-neutral-800 px-3 py-1 rounded-md text-[11px] font-bold text-[#79b947] uppercase tracking-wider">
                      {bikeC.brand}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-extrabold text-white">
                        {bikeC.brand} {bikeC.name}
                      </h2>
                      <div className="text-xl font-black text-[#79b947] mt-2">
                        ₹{bikeC.price?.toLocaleString('en-IN')} <span className="text-[10px] text-neutral-500">Estimated Price</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* /* Spec Sheet Table */}
            {bikeA && bikeB && (
              <div className="bg-neutral-900 border border-neutral-800/80 rounded-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-950/50">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">Technical Spec Comparison</h3>
                </div>

                <div className="divide-y divide-neutral-800/60">

                  {/* /* Brand Row */}
                  <div className="grid grid-cols-4 px-6 py-4 text-xs font-medium">
                    <span className="text-neutral-500 uppercase tracking-wider">Brand</span>
                    <span className="text-neutral-200 font-bold">{bikeA.brand}</span>
                    <span className="text-neutral-200 font-bold">{bikeB.brand}</span>
                    <span className="text-neutral-200 font-bold">{bikeC?.brand || '-'}</span>
                  </div>

                  {/* /* Name Row */}
                  <div className="grid grid-cols-4 px-6 py-4 text-xs font-medium">
                    <span className="text-neutral-500 uppercase tracking-wider">Model Name</span>
                    <span className="text-neutral-200 font-bold">{bikeA.name}</span>
                    <span className="text-neutral-200 font-bold">{bikeB.name}</span>
                    <span className="text-neutral-200 font-bold">{bikeC?.name || '-'}</span>
                  </div>

                  {/* /* Certified Range Row */}
                  <div className="grid grid-cols-4 px-6 py-4 text-xs font-medium">
                    <span className="text-neutral-500 uppercase tracking-wider">Certified Range</span>
                    <span className="text-yellow-500 font-bold">{bikeA.range_km} km</span>
                    <span className="text-yellow-500 font-bold">{bikeB.range_km} km</span>
                    <span className="text-yellow-500 font-bold">{bikeC ? bikeC.range_km + " km" : '-'}</span>
                  </div>

                  {/* /* Top Speed Row */}
                  <div className="grid grid-cols-4 px-6 py-4 text-xs font-medium">
                    <span className="text-neutral-500 uppercase tracking-wider">Top Speed</span>
                    <span className="text-blue-400 font-bold">{bikeA.top_speed} km/h</span>
                    <span className="text-blue-400 font-bold">{bikeB.top_speed} km/h</span>
                    <span className="text-blue-400 font-bold">{bikeC?.top_speed ? `${bikeC.top_speed} km/h` : '-'}</span>
                  </div>

                  {/* /* Battery Capacity Row */}
                  <div className="grid grid-cols-4 px-6 py-4 text-xs font-medium">
                    <span className="text-neutral-500 uppercase tracking-wider">Battery Capacity</span>
                    <span className="text-green-400 font-bold">{bikeA.battery_capacity} kWh</span>
                    <span className="text-green-400 font-bold">{bikeB.battery_capacity} kWh</span>
                    <span className="text-green-400 font-bold">{bikeC ? `${bikeC.battery_capacity} kWh` : '-'}</span>
                  </div>

                  {/* /* Segment Row */}
                  <div className="grid grid-cols-4 px-6 py-4 text-xs font-medium">
                    <span className="text-neutral-500 uppercase tracking-wider">Segment</span>
                    <span className="text-neutral-200 font-bold">{bikeA.segment}</span>
                    <span className="text-neutral-200 font-bold">{bikeB.segment}</span>
                    <span className="text-neutral-200 font-bold">{bikeC ? `${bikeC.segment} kWh` : '-'}</span>
                  </div>

                  {/* /* Vehicle Type Row */}
                  <div className="grid grid-cols-4 px-6 py-4 text-xs font-medium">
                    <span className="text-neutral-500 uppercase tracking-wider">Vehicle Type</span>
                    <span className="text-neutral-200 font-bold">{bikeA.vehicle_type}</span>
                    <span className="text-neutral-200 font-bold">{bikeB.vehicle_type}</span>
                    <span className="text-neutral-200 font-bold">{bikeC ? `${bikeC.vehicle_type}` : '-'}</span>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 🌟 START: CLEAN MANUAL FOOTER */}
      <footer className="w-full bg-neutral-950 text-neutral-400 font-sans border-t border-neutral-900 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* Column 1: About Platform */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-black tracking-tighter uppercase text-white">
                ev.<span className="text-[#79b947]">bike</span>
              </span>
            </div>
            <p className="text-neutral-500 text-xs font-medium leading-relaxed">
              India's most trusted platform for finding, comparing, and analyzing electric vehicles within your budget.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-500">// QUICK LINKS</h4>
            <ul className="space-y-2 text-xs font-semibold text-neutral-400">
              <li><a href="/" className="hover:text-[#79b947] transition-colors">New Bikes</a></li>
              <li><a href="/compare" className="hover:text-[#79b947] transition-colors">Comparison</a></li>
              <li><a href="/brands" className="hover:text-[#79b947] transition-colors">Brands</a></li>
              <li><a href="/calculator" className="hover:text-[#79b947] transition-colors">EV Calculator</a></li>
              <li><a href="/Find-EV" className="hover:text-[#79b947] transition-colors">Find-EV</a></li>
              <li><a href="/charging-stations" className="hover:text-[#79b947] transition-colors">Charging Stations</a></li>
            </ul>
          </div>

          {/* Column 3: Popular Brands */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-500">// POPULAR BRANDS</h4>
            <ul className="space-y-2 text-xs font-semibold text-neutral-400">
              <li><a href="/brands" className="hover:text-[#79b947] transition-colors">Revolt Motors</a></li>
              <li><a href="/brands" className="hover:text-[#79b947] transition-colors">Matter Energy</a></li>
              <li><a href="/brands" className="hover:text-[#79b947] transition-colors">Oben Electric</a></li>
              <li><a href="/brands" className="hover:text-[#79b947] transition-colors">Tork Motors</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Support */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-500">// CONTACT SUPPORT</h4>
            <div className="space-y-1.5 text-xs font-semibold text-neutral-400">
              <p className="text-white font-bold text-[13px]">+91 63505-71635</p>
              <p className="text-neutral-500">
                <a href="mailto:info@evbike.com" className="hover:text-[#79b947] transition-colors">info@evbike.com</a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-neutral-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-neutral-600 uppercase tracking-wider">
          <div>© 2026 EV.BIKE MATRIX MEDIA. ALL RIGHTS RESERVED.</div>
          <div className="text-neutral-500 font-sans font-bold">MADE FOR INDIA'S EV REV</div>
        </div>
      </footer>

    </div>
  );
}
