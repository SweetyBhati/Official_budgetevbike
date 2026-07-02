'use client';

import { useEffect, useState } from 'react';
import { getBikeImageUrl } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Library, ShieldAlert, Award, Star } from 'lucide-react';

interface ElectricBike {
  id: number;
  name: string;
  brand: string;
  range_km: number;
  top_speed: number;
  battery_capacity: string;
  segment?: string;
}

interface BrandAggregate {
  brand: string;
  bikeCount: number;
  avgRange: number;
  avgTopSpeed: number;
  models: string[];
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<BrandAggregate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const { data, error } = await supabase
          .from('electric_bikes')
          .select('*');

        if (!error && data) {
          const aggregates: { [key: string]: { ranges: number[], speeds: number[], models: string[] } } = {};

          data.forEach((item: any) => {
            const brand = item['Brand / OEM'] || 'Unknown';
            const range = Number(item['Certified Range (km)']) || 0;
            const topSpeed = Number(item['Top Speed (km/h)']) || 0;
            const model = item['Model Name'] || 'E-Bike';

            if (!aggregates[brand]) {
              aggregates[brand] = { ranges: [], speeds: [], models: [] };
            }
            aggregates[brand].ranges.push(range);
            aggregates[brand].speeds.push(topSpeed);
            if (!aggregates[brand].models.includes(model)) {
              aggregates[brand].models.push(model);
            }
          });

          const brandList: BrandAggregate[] = Object.keys(aggregates).map(brandName => {
            const group = aggregates[brandName];
            const avgRange = group.ranges.reduce((a, b) => a + b, 0) / group.ranges.length;
            const avgTopSpeed = group.speeds.reduce((a, b) => a + b, 0) / group.speeds.length;

            return {
              brand: brandName,
              bikeCount: group.ranges.length,
              avgRange: Math.round(avgRange),
              avgTopSpeed: Math.round(avgTopSpeed),
              models: group.models
            };
          });

          setBrands(brandList);
        }
      } catch (err) {
        console.error("Error aggregating brand data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased">
      {/* Header */}

      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 text-white">
        {/* Yahan max-w-[1400px] aur h-24 kar diya */}
        <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">

          <a href="/" className="flex items-center gap-3 cursor-pointer">
            {/* Yahan logo ki height h-9 kar di */}
            <img src="/logo.png" alt="ev.BIKE Logo" className="h-9 w-auto object-contain" />
            <span className="text-xl font-black tracking-tighter uppercase">
              ev.<span className="text-[#79b947]">bike</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-[0.15em]">
            <a href="/" className="text-neutral-400 hover:text-white transition-colors">Home</a>
            <a href="/compare" className="text-neutral-400 hover:text-white transition-colors">Comparison</a>
            <a href="/brands" className="text-white border-b border-white/40 pb-0.5">Brands</a>
            <a href="/calculator" className="text-neutral-400 hover:text-white transition-colors">EV Calculator</a>
            <a href="/Find-EV" className="text-neutral-400 hover:text-white transition-colors">Find-EV</a>
            <a href="/charging-stations" className="text-neutral-400 hover:text-white transition-colors">Charging Stations</a>
          </nav>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10 text-center md:text-left">
          <span className="text-[#79b947] font-mono text-[10px] uppercase tracking-[0.2em] mb-3 block">// Manufacturers</span>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase">EV Brands</h1>
          <p className="text-neutral-500 text-sm mt-1">Explore electric vehicle manufacturers and their dynamic catalog stats</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#79b947]"></div>
            <p className="text-neutral-500 text-xs mt-3 font-mono tracking-wider">LOADING BRANDS DIRECTORY...</p>
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900 rounded-xl border border-neutral-800">
            <p className="text-neutral-400 font-medium text-sm">No brands found in the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.map((brandInfo, index) => (
              <div key={index} className="group bg-neutral-900 border border-neutral-800/60 rounded-2xl p-6 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between">
                <div>

                  <div className="w-full h-36 bg-neutral-950 rounded-xl overflow-hidden mb-4 relative">
                    <img
                      src={getBikeImageUrl(brandInfo.brand, brandInfo.models[0] || brandInfo.brand)}
                      alt={brandInfo.brand}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {

                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold group-hover:text-[#79b947] transition-colors">{brandInfo.brand}</h2>
                    <span className="bg-neutral-950 border border-neutral-800 text-[10px] font-black uppercase tracking-wider text-[#79b947] px-2.5 py-1 rounded">
                      {brandInfo.bikeCount} {brandInfo.bikeCount === 1 ? 'Model' : 'Models'}
                    </span>
                  </div>

                  {/* Brand stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/40">
                      <div className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider">Avg Range</div>
                      <div className="text-lg font-black text-neutral-200 mt-1">{brandInfo.avgRange} km</div>
                    </div>
                    <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/40">
                      <div className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider">Avg Top Speed</div>
                      <div className="text-lg font-black text-neutral-200 mt-1">{brandInfo.avgTopSpeed} km/h</div>
                    </div>
                  </div>

                  {/* Models list */}
                  <div className="space-y-2 mb-6">
                    <div className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Models Catalog</div>
                    <div className="flex flex-wrap gap-2">
                      {brandInfo.models.map((model, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-1 bg-neutral-950/60 border border-neutral-800/40 rounded-md font-semibold text-neutral-400">
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <a href={`/?brand=${encodeURIComponent(brandInfo.brand)}`} className="w-full">
                  <button className="w-full py-2.5 bg-neutral-800 hover:bg-[#79b947] hover:text-black font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all border border-neutral-700/50 hover:border-[#79b947]">
                    View Models
                  </button>
                </a>
              </div>
            ))}
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
              <li><a href="#" className="hover:text-[#79b947] transition-colors">Revolt Motors</a></li>
              <li><a href="#" className="hover:text-[#79b947] transition-colors">Matter Energy</a></li>
              <li><a href="#" className="hover:text-[#79b947] transition-colors">Oben Electric</a></li>
              <li><a href="#" className="hover:text-[#79b947] transition-colors">Tork Motors</a></li>
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
