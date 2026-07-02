'use client';

import { useState } from 'react';
import { ArrowLeft, Landmark, Zap, Compass, Calculator } from 'lucide-react';

export default function CalculatorPage() {
  const [commute, setCommute] = useState(40); // km/day
  const [petrolPrice, setPetrolPrice] = useState(105); // Rs/litre
  const [mileage, setMileage] = useState(45); // km/litre
  const [electricityCost, setElectricityCost] = useState(7); // Rs/unit

  // Calculation logic
  // Assume electric scooter average energy consumption is ~ 0.03 kWh per km (30 Wh/km)
  const evEfficiency = 0.03; // kWh per km
  const annualDays = 300; // Average working/travel days in a year

  const dailyIceCost = (commute / mileage) * petrolPrice;
  const monthlyIceCost = dailyIceCost * 26;
  const annualIceCost = dailyIceCost * annualDays;

  const dailyEvCost = commute * evEfficiency * electricityCost;
  const monthlyEvCost = dailyEvCost * 26;
  const annualEvCost = dailyEvCost * annualDays;

  const monthlySavings = monthlyIceCost - monthlyEvCost;
  const annualSavings = annualIceCost - annualEvCost;
  const fiveYearSavings = annualSavings * 5;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased">
      {/* Header */}

      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 text-white">

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
            <a href="/compare" className="text-neutral-400 hover:text-white transition-colors">Comparison</a>
            <a href="/brands" className="text-neutral-400 hover:text-white transition-colors">Brands</a>
            <a href="/calculator" className="text-white border-b border-white/40 pb-0.5">EV Calculator</a>
            <a href="/Find-EV" className="text-neutral-400 hover:text-white transition-colors">Find-EV</a>
            <a href="/charging-stations" className="text-neutral-400 hover:text-white transition-colors">Charging Stations</a>
          </nav>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10 text-center md:text-left">
          <span className="text-[#79b947] font-mono text-[10px] uppercase tracking-[0.2em] mb-3 block">// Calculator</span>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase">EV Savings Calculator</h1>
          <p className="text-neutral-500 text-sm mt-1">See how much you save switching from a petrol two-wheeler to electric</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800/80 rounded-3xl p-6 md:p-8 space-y-8">
            <h2 className="text-lg font-bold uppercase tracking-wide border-b border-neutral-800 pb-3 flex items-center gap-2">
              <Calculator className="size-4 text-[#79b947]" /> Commute Parameters
            </h2>

            {/* Commute Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-neutral-400">Daily Commute</span>
                <span className="text-white">{commute} km</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={commute}
                onChange={(e) => setCommute(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#79b947]"
              />
              <div className="flex justify-between text-[10px] text-neutral-600 font-mono">
                <span>10 km</span>
                <span>150 km</span>
              </div>
            </div>

            {/* Petrol Cost Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-neutral-400">Petrol Price (per L)</span>
                <span className="text-white">₹{petrolPrice}</span>
              </div>
              <input
                type="range"
                min="90"
                max="120"
                step="1"
                value={petrolPrice}
                onChange={(e) => setPetrolPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#79b947]"
              />
              <div className="flex justify-between text-[10px] text-neutral-600 font-mono">
                <span>₹90</span>
                <span>₹120</span>
              </div>
            </div>

            {/* ICE Mileage Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-neutral-400">ICE Vehicle Mileage</span>
                <span className="text-white">{mileage} km/l</span>
              </div>
              <input
                type="range"
                min="20"
                max="70"
                step="2"
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#79b947]"
              />
              <div className="flex justify-between text-[10px] text-neutral-600 font-mono">
                <span>20 km/l</span>
                <span>70 km/l</span>
              </div>
            </div>

            {/* Electricity cost Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-neutral-400">Electricity Tariff (per Unit)</span>
                <span className="text-white">₹{electricityCost}</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                step="0.5"
                value={electricityCost}
                onChange={(e) => setElectricityCost(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#79b947]"
              />
              <div className="flex justify-between text-[10px] text-neutral-600 font-mono">
                <span>₹3</span>
                <span>₹15</span>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Main Savings Card */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-[#79b947]/30 rounded-3xl p-8 relative overflow-hidden shadow-xl flex-1 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#79b947]/5 rounded-full blur-3xl pointer-events-none" />

              <div>
                <span className="text-[10px] font-mono font-bold text-[#79b947] uppercase tracking-[0.2em] mb-1 block">// Real-Time Savings</span>
                <h3 className="text-3xl font-black uppercase text-white leading-none">Your EV ROI</h3>

                <div className="mt-8 space-y-6">
                  <div>
                    <span className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Monthly Savings</span>
                    <div className="text-4xl font-extrabold text-[#79b947]">₹{Math.round(monthlySavings).toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Annual Savings</span>
                    <div className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">₹{Math.round(annualSavings).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-neutral-800 pt-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500 uppercase tracking-wider font-bold">5-Year Cumulative Savings</span>
                  <span className="text-[#aaff00] font-black text-lg">₹{Math.round(fiveYearSavings).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-neutral-900 border border-neutral-800/80 rounded-3xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4 border-b border-neutral-800 pb-2">Running Cost Comparison</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Petrol Vehicle (Daily)</span>
                  <span className="font-bold text-neutral-200">₹{dailyIceCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Electric Vehicle (Daily)</span>
                  <span className="font-bold text-[#79b947]">₹{dailyEvCost.toFixed(2)}</span>
                </div>
                <div className="border-t border-neutral-800/60 pt-3 flex justify-between text-xs font-bold">
                  <span className="text-neutral-300">Savings per Kilometer</span>
                  <span className="text-[#aaff00]">₹{((dailyIceCost - dailyEvCost) / commute).toFixed(2)} / km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
