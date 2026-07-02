'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase, getBikeImageUrl } from '@/lib/supabase';
import { ArrowRight, Plus, Zap, Gauge, BatteryCharging, Menu } from 'lucide-react';
import Link from 'next/link';

// TypeScript interfaces for database types
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
}

export default function Home() {
  const [bikes, setBikes] = useState<ElectricBike[]>([]);
  const [filteredBikes, setFilteredBikes] = useState<ElectricBike[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filters State
  const [selectedBrand, setSelectedBrand] = useState('Select Brand');
  const [selectedBudget, setSelectedBudget] = useState('Any Budget');
  const [selectedRange, setSelectedRange] = useState('Any Range');

  // 🎲 Initial load par sirf 6 popular bikes dikhane ke liye logic
  const displayedBikes = useMemo(() => {
    if (filteredBikes && filteredBikes.length > 10) {
      return filteredBikes.slice(0, 6); // 
    }
    return filteredBikes || []; // Filter select hone par strictly wahi dikhengi
  }, [filteredBikes]);
  // Fetch data from Supabase
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

            // Deterministic estimated price calculation based on specs
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
              image_url: image_url
            };
          });
          setBikes(mappedBikes);
          setFilteredBikes(mappedBikes);
        }
      } catch (err) {
        console.error("Error fetching bikes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBikes();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = bikes;

    // Brand Filter
    if (selectedBrand !== 'Select Brand' && selectedBrand !== 'All Brands') {
      result = result.filter(bike => bike.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Budget Filter
    if (selectedBudget !== 'Any Budget') {
      if (selectedBudget === 'Under ₹1.25 Lakh') result = result.filter(bike => bike.price <= 125000);
      if (selectedBudget === '₹1.25 Lakh – ₹1.40 Lakh') result = result.filter(bike => bike.price > 125000 && bike.price <= 140000);
      if (selectedBudget === '₹1.40 Lakh+') result = result.filter(bike => bike.price > 140000);
    }

    // Range Filter
    if (selectedRange !== 'Any Range') {
      if (selectedRange === '145+ km') result = result.filter(bike => bike.range_km >= 145);
      if (selectedRange === '150+ km') result = result.filter(bike => bike.range_km >= 150);
      if (selectedRange === '190+ km') result = result.filter(bike => bike.range_km >= 190);
    }

    setFilteredBikes(result);
  }, [selectedBrand, selectedBudget, selectedRange, bikes]);

  // Unique Brands dynamic generation
  const dynamicBrands = ['All Brands', ...Array.from(new Set(bikes.map(b => b.brand)))];

  const formatPrice = (price?: number) =>
    typeof price === 'number' ? price.toLocaleString('en-IN') : '—';

  // Static expert reviews section (Lovable style template)
  const dummyReviews = [
    { tag: "LAB TEST", date: "JUNE 2026", title: "In-Depth: Real-world range test of the latest urban high-speed electric scooters.", excerpt: "We push the limits on Indian city roads to see if advertised specifications live up to reality under heavy traffic conditions." },
    { tag: "VERDICT", date: "MAY 2026", title: "Revolt RV400 vs Ather 450X: The ultimate commuter battle.", excerpt: "A classic showdown between performance-oriented electric scooters and motorcycle form-factors for daily office travel." },
    { tag: "PREVIEW", date: "APRIL 2026", title: "Next-gen battery tech and thermal management arriving next quarter.", excerpt: "An exclusive technical analysis of solid-state developments coming to high-performance two-wheelers." }
  ];

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!subscriberEmail) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email: subscriberEmail }]);

      if (error) {
        if (error.code === '23505') {
          alert('This email is already subscribed! ✨');
        } else {
          throw error;
        }
      } else {
        alert('Thank you for subscribing! ⚡');
        setSubscriberEmail('');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased">

      {/* 1. Header Component */}
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="ev.BIKE Logo"
              className="h-9 w-auto object-contain"
            />
            <span className="text-xl font-black tracking-tighter uppercase">
              ev.<span className="text-[#79b947]">bike</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-[0.15em]">
            <a href="/" className="text-white border-b border-white/40 pb-0.5">

              Home
            </a>
            <a href="/compare" className="hover:text-white transition-colors">
              Comparison
            </a>
            <a href="/brands" className="hover:text-white transition-colors">
              Brands
            </a>
            <a href="/calculator" className="hover:text-[#aaff00] transition-colors font-extrabold text-neutral-300">
              EV Calculator
            </a>
            <a href="/Find-EV" className="hover:text-white transition-colors">
              Find-EV
            </a>
            <a href="/charging-stations" className="hover:text-white transition-colors">
              Charging Stations
            </a>
          </nav>

          <button className="md:hidden text-neutral-400 hover:text-white">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative border-b border-neutral-800 overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative z-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#79b947] mb-5">// Comparison engine v2.0</p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 max-w-4xl leading-none">
            Find your perfect{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#79b947] to-emerald-400">electric pulse.</span>
          </h1>
          <p className="text-base md:text-lg text-neutral-400 max-w-xl mb-10">
            The definitive technical database for electric bikes. Compare range, motor, battery and price across top models instantly.
          </p>

          {/* Filter Box */}
          <div className="bg-neutral-900/90 ring-1 ring-neutral-800 shadow-2xl rounded-2xl p-3 max-w-4xl flex flex-col md:flex-row gap-2">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="flex-1 px-4 py-3.5 rounded-xl bg-neutral-800 border-none text-xs font-bold uppercase tracking-wider text-neutral-200 focus:ring-2 ring-[#79b947]/20 outline-none cursor-pointer"
            >
              <option>Select Brand</option>
              {dynamicBrands.map((b, idx) => (
                <option key={`${b}-${idx}`} value={b ?? ''}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="flex-1 px-4 py-3.5 rounded-xl bg-neutral-800 border-none text-xs font-bold uppercase tracking-wider text-neutral-200 focus:ring-2 ring-[#79b947]/20 outline-none cursor-pointer"
            >
              <option>Any Budget</option>
              <option>Under ₹1.25 Lakh</option>
              <option>₹1.25 Lakh – ₹1.40 Lakh</option>
              <option>₹1.40 Lakh+</option>
            </select>

            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="flex-1 px-4 py-3.5 rounded-xl bg-neutral-800 border-none text-xs font-bold uppercase tracking-wider text-neutral-200 focus:ring-2 ring-[#79b947]/20 outline-none cursor-pointer"
            >
              <option>Any Range</option>
              <option>145+ km</option>
              <option>150+ km</option>
              <option>190+ km</option>
            </select>

            <button
              onClick={() => { setSelectedBrand('Select Brand'); setSelectedBudget('Any Budget'); setSelectedRange('Any Range'); }}
              className="px-6 py-3.5 bg-[#79b947] text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-emerald-400 active:scale-[0.98] transition-all text-center"
            >
              Reset Filters
            </button>
          </div>
        </div>
        <div aria-hidden className="absolute right-0 top-0 w-1/2 h-full opacity-[0.02] pointer-events-none select-none overflow-hidden">
          <div className="text-[280px] font-black leading-none rotate-90 translate-x-1/3 translate-y-1/4"></div>
        </div>
      </section>

      {/* 3. Popular Bikes Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase">Popular E-Bikes</h2>
            <p className="text-neutral-500 text-xs font-medium tracking-wide mt-1">Live technical data loaded direct from database</p>
          </div>
          <div className="text-xs font-bold text-[#79b947] border-b border-[#79b947]/20 pb-1 flex items-center gap-1">
            Total Available: {filteredBikes.length} Models
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#79b947]"></div>
            <p className="text-neutral-500 text-xs mt-3 font-mono tracking-wider">CONNECTING TO DATABASE...</p>
          </div>
        ) : filteredBikes.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900 rounded-xl border border-neutral-800">
            <p className="text-neutral-400 font-medium text-sm">No e-bikes found matching the filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayedBikes.map((bike, idx) => (
              <div key={bike.id || idx} className="group bg-neutral-900 border border-neutral-800/60 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all duration-300 flex flex-col">
                <div className="aspect-[16/10] bg-neutral-800 relative overflow-hidden">
                  <img
                    src={bike.image_url || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500'}
                    alt={bike.name}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.15] transform -rotate-12">
                    <p className="text-sm md:text-base font-black tracking-[0.3em] text-white uppercase border border-white/40 px-3 py-1 rounded bg-black/20 backdrop-blur-[0.5px]">
                      BUDGET EV BIKE
                    </p>
                  </div>

                  <div className="absolute top-3 left-3 bg-neutral-950/90 backdrop-blur-sm border border-neutral-800 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-[#79b947]">
                    {bike.brand}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold group-hover:text-[#79b947] transition-colors tracking-tight mb-1">{bike.brand} {bike.name}</h3>
                  <div className="text-lg font-black text-neutral-100 mb-4">
                    ₹{formatPrice(bike.price)} <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-normal">Ex-Showroom</span>
                  </div>

                  {/* Technical Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                    <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/40 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-[#79b947]" />
                      <div>
                        <div className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider">Range</div>
                        <div className="font-bold text-neutral-200">{bike.range_km} km</div>
                      </div>
                    </div>
                    <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/40 flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-blue-400" />
                      <div>
                        <div className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider">Top Speed</div>
                        <div className="font-bold text-neutral-200">{bike.top_speed} km/h</div>
                      </div>
                    </div>
                    <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/40 flex items-center gap-2">
                      <BatteryCharging className="h-4 w-4 text-emerald-400" />
                      <div>
                        <div className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider">Battery</div>
                        <div className="font-bold text-neutral-200 truncate max-w-[80px]">{bike.battery_capacity}</div>
                      </div>
                    </div>
                    <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/40 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-400" />
                      <div>
                        <div className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider">Charge Time</div>
                        <div className="font-bold text-neutral-200">{bike.charge_time}</div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/bike/${bike.id}`}
                    className="w-full text-center mt-auto py-2.5 bg-neutral-800 hover:bg-[#79b947] hover:text-black transition-all rounded-xl text-xs font-bold font-mono text-neutral-200 block"
                  >
                    Full Spec Sheet
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Compare CTA Section */}
      <section className="bg-neutral-900 border-y border-neutral-800 py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#79b947] font-mono text-[10px] uppercase tracking-[0.2em] mb-4 block">// Side-by-side</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase mb-6 leading-tight">
              Spec analysis,<br />without the noise.
            </h2>
            <p className="text-neutral-400 text-sm mb-8 max-w-md leading-relaxed">
              Overlay torque curves, weight distribution and real-world range data from our database metrics. Two bikes, one definitive verdict.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-black uppercase tracking-wider text-xs rounded-lg hover:bg-[#79b947] hover:text-black transition-colors">
              Start Comparison <ArrowRight className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center gap-4 hover:bg-neutral-800/50 transition-colors cursor-pointer group"
              >
                <div className="size-10 rounded-full border border-dashed border-neutral-700 group-hover:border-[#79b947] flex items-center justify-center transition-colors">
                  <Plus className="size-4 text-neutral-500 group-hover:text-[#79b947]" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-300">
                  Add Bike {i === 0 ? "A" : "B"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Expert Reviews Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight uppercase">Expert Reviews</h2>
          <div className="text-xs font-bold text-[#79b947] inline-flex items-center gap-1 cursor-pointer hover:underline">
            All Reviews <ArrowRight className="size-4" />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {dummyReviews.map((r, index) => (
            <article key={index} className="group cursor-pointer">
              <div className="aspect-[16/10] bg-neutral-900 border border-neutral-800 rounded-xl mb-5 overflow-hidden flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-[#79b947]/10 to-neutral-900 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-neutral-600 group-hover:text-[#79b947]/40 transition-colors">
                  {r.tag} OVERLAY
                </div>
              </div>
              <div className="flex gap-2 mb-2">
                <span className="px-2 py-0.5 bg-[#79b947]/10 text-[#79b947] text-[9px] font-mono font-bold uppercase rounded">{r.tag}</span>
                <span className="text-neutral-600 text-[9px] font-mono pt-0.5">{r.date}</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-[#79b947] transition-colors text-balance leading-snug">{r.title}</h3>
              <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3">{r.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      {/* EV Info Feature Section */}
      <section className="bg-[#0a0f12] py-24 px-4 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div>
              <p className="text-xs font-mono font-bold text-[#aaff00] tracking-widest uppercase mb-3">
                // COMPARISON ENGINE V2.0
              </p>
              <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
                The Future is <span className="text-[#aaff00] drop-shadow-[0_0_15px_rgba(170,255,0,0.2)]">Electric</span>
              </h2>
              <p className="mt-4 text-neutral-400 text-sm md:text-base max-w-md leading-relaxed">
                Switching to an EV is more than a purchase; it's an investment in a cleaner, more efficient way to travel.
              </p>
            </div>

            <div className="space-y-6 max-w-lg">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/40 border border-neutral-900/60 hover:border-[#aaff00]/20 transition-colors">
                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 text-[#aaff00] rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-inner">
                  ₹
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white tracking-wide">Huge Savings</h4>
                  <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-relaxed">
                    Save up to ₹1.5L per year on fuel and maintenance compared to ICE vehicles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/40 border border-neutral-900/60 hover:border-[#aaff00]/20 transition-colors">
                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 text-[#aaff00] rounded-xl flex items-center justify-center flex-shrink-0 text-xl shadow-inner">
                  🍃
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white tracking-wide">Zero Emissions</h4>
                  <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-relaxed">
                    Help reduce the carbon footprint and noise pollution in your city.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/40 border border-neutral-900/60 hover:border-[#aaff00]/20 transition-colors">
                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 text-[#aaff00] rounded-xl flex items-center justify-center flex-shrink-0 text-xl shadow-inner">
                  🛡️
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white tracking-wide">Advanced Safety</h4>
                  <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-relaxed">
                    Modern EVs come with the latest driver-assistance and advanced safety technologies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#11181c]/80 border border-neutral-900 rounded-[2.5rem] p-8 lg:p-14 text-white relative overflow-hidden shadow-2xl min-h-[440px] flex flex-col justify-between backdrop-blur-md">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#aaff00]/5 rounded-full blur-[80px] pointer-events-none" />
            <div>
              <p className="text-xs font-mono font-bold text-[#aaff00] tracking-widest uppercase mb-4">
                INDIAN EV ECOSYSTEM
              </p>
              <h3 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight mt-2 max-w-md text-white">
                Calculate Your <span className="text-[#aaff00]">Monthly</span> Savings Instantly
              </h3>
              <p className="text-neutral-400 text-sm md:text-base mt-6 max-w-sm leading-relaxed">
                Input your daily commute and current fuel price to see how much you can save by switching to an EV.
              </p>
            </div>
            <div className="mt-10">
              <a href="/calculator">
                <button className="w-full sm:w-auto bg-[#aaff00] hover:bg-[#c2ff33] text-[#0a0f12] font-extrabold px-10 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-sm uppercase tracking-wider shadow-lg shadow-[#aaff00]/10 hover:shadow-[#aaff00]/20">
                  Go to Calculator
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action Banner */}
      <section className="bg-[#0a0f12] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#11181c] to-[#161f25] border border-neutral-900 rounded-[2rem] p-10 md:p-14 text-center shadow-2xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#aaff00]/5 rounded-full blur-[100px] pointer-events-none" />
            <h3 className="relative text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to Find Your <span className="text-[#aaff00] drop-shadow-[0_0_15px_rgba(170,255,0,0.25)]">Perfect EV Bike?</span>
            </h3>
            <p className="relative mt-4 text-neutral-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Compare models, find charging networks, and see fuel cost savings instantly. No commitment, just pure electric bike data.
            </p>
            {/* Buttons Container */}
            <div className="relative mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">

              {/* Explore Bikes Link -> Links to Find-EV */}
              <a href="/Find-EV" className="w-full sm:w-auto">
                <button className="w-full bg-[#aaff00] hover:bg-[#c2ff33] text-[#0a0f12] font-extrabold px-10 py-4 rounded-lg uppercase tracking-wider text-sm transition-all">
                  Explore Bikes
                </button>
              </a>

              {/* Compare Bikes Link -> Links to compare */}
              <a href="/compare" className="w-full sm:w-auto">
                <button className="w-full bg-neutral-900/50 hover:bg-neutral-900 text-white border border-neutral-700 font-extrabold px-10 py-4 rounded-lg uppercase tracking-wider text-sm transition-all">
                  Compare Bikes
                </button>
              </a>

            </div>
          </div>
        </div>
      </section>

      {/* 6. Premium Footer */}
      <footer className="w-full bg-neutral-950 text-neutral-400 font-sans border-t border-neutral-900 mt-20">
        <div className="max-w-7xl mx-auto px-6 pt-12">
          <div className="w-full bg-neutral-900/40 border border-neutral-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-2">
              Stay Updated on Indian EVs
            </h2>
            <p className="text-neutral-500 text-xs md:text-sm max-w-lg mx-auto mb-6 font-medium">
              Get the latest news, price updates, and exclusive offers on electric vehicles delivered straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-center justify-center">
              <input
                type="email"
                required
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 outline-none focus:border-[#79b947]/40 transition-colors"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-[#79b947] hover:bg-[#6aa43e] text-neutral-950 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all font-mono disabled:opacity-50"
              >
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 border-b border-neutral-900/60 mt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-black tracking-tighter uppercase text-white">
                ev.<span className="text-[#79b947]">bike</span>
              </span>
            </div>
            <p className="text-neutral-500 text-xs font-medium">
              India's most trusted platform for finding, comparing, and analyzing electric vehicles within your budget.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-500">// Quick Links</h4>
            <ul className="space-y-2 text-xs font-semibold text-neutral-400">
              <li><a href="/" className="hover:text-[#79b947]">Home</a></li>
              <li><a href="/compare" className="hover:text-[#79b947]">Comparison</a></li>
              <li><a href="/brands" className="hover:text-[#79b947]">Brands</a></li>
              <li><a href="/calculator" className="hover:text-[#79b947]">EV Calculator</a></li>
              <li><a href="/Find-EV" className="hover:text-[#79b947]">Find-EV</a></li>
              <li><a href="/charging-stations" className="hover:text-[#79b947]">Charging Stations</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-500">// Popular Brands</h4>
            <ul className="space-y-2 text-xs font-semibold text-neutral-400">
              <li><a href="/brands" className="hover:text-[#79b947]">Revolt Motors</a></li>
              <li><a href="/brands" className="hover:text-[#79b947]">Matter Energy</a></li>
              <li><a href="/brands" className="hover:text-[#79b947]">Oben Electric</a></li>
              <li><a href="/brands" className="hover:text-[#79b947]">Tork Motors</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-500">// Contact Support</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-neutral-400">
              <li className="text-neutral-300 font-sans">+91 63506-71636</li>
              <li className="text-neutral-300 break-all font-sans">info@evbike.com</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-700">
          <div>© 2026 ev.BIKE Matrix Media. All rights reserved.</div>
          <div className="text-neutral-600 font-sans tracking-normal font-medium text-xs">
            Made for India's EV revolution ⚡
          </div>
        </div>
      </footer >

    </div >
  );
}