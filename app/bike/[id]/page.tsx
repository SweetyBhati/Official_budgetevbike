'use client';

import React, { useEffect, useState } from 'react';
import { supabase, getBikeImageUrl } from '@/lib/supabase';
import Link from 'next/link';

export default function BikeDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
    const [bike, setBike] = useState<any | null>(null);
    const [similarBikes, setSimilarBikes] = useState<any[]>([]);
    const [brandBikes, setBrandBikes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dbError, setDbError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBikeDetail() {
            try {
                const resolvedParams = params instanceof Promise ? await params : params;
                const targetId = resolvedParams?.id;

                if (!targetId) {
                    setDbError("URL se bike ID nahi mil paayi.");
                    setLoading(false);
                    return;
                }

                const numericId = parseInt(targetId, 10);

                // Fetch everything dynamically matching the S.No.
                const { data, error } = await supabase
                    .from('electric_bikes')
                    .select('*')
                    .eq('"S.No."', numericId)
                    .maybeSingle();

                if (error) {
                    setDbError(error.message);
                } else if (data) {
                    setBike(data);

                    // Fetch Similar Alternative Electric Vehicles based on Segment (Limit 4)
                    const currentSegment = data['Segment'] || 'Mass Market';
                    const { data: recs } = await supabase
                        .from('electric_bikes')
                        .select('*')
                        .eq('Segment', currentSegment)
                        .not('"S.No."', 'eq', numericId)
                        .limit(4);

                    if (recs) setSimilarBikes(recs);

                    // Fetch More Vehicles From the Same Brand/OEM (Limit 4)
                    const currentBrand = data['Brand / OEM'] || data['Brand/OEM'] || 'Ola Electric';
                    const { data: brandDocs } = await supabase
                        .from('electric_bikes')
                        .select('*')
                        .eq('Brand/OEM', currentBrand)
                        .not('"S.No."', 'eq', numericId)
                        .limit(4);

                    if (brandDocs) setBrandBikes(brandDocs);
                } else {
                    setDbError(`Database mein Serial Number ${targetId} ka data nahi mila.`);
                }
            } catch (err: any) {
                setDbError(err.message || "Technical connectivity framework failure.");
            } finally {
                setLoading(false);
            }
        }

        fetchBikeDetail();
    }, [params]);

    if (loading) {
        return (
            <div className="bg-[#0b0c10] min-h-screen text-neutral-300 flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-[#79b947] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#79b947]">LOADING DETAILS...</span>
                </div>
            </div>
        );
    }

    if (dbError || !bike) {
        return (
            <div className="bg-[#0b0c10] min-h-screen text-neutral-300 flex flex-col items-center justify-center p-6 text-center font-sans">
                <h1 className="text-xl font-bold text-red-500 mb-2 font-mono">Oops! Details Not Available</h1>
                <p className="text-neutral-500 text-sm max-w-md font-mono">{dbError}</p>
                <Link href="/" className="mt-4 text-xs text-[#79b947] underline font-mono">Back to Home</Link>
            </div>
        );
    }

    // 🔄 DATABASE COLUMN MAPPING DIRECT FROM YOUR TABLE EDITOR
    const brandName = bike['Brand / OEM'] || bike['Brand/OEM'] || 'Ola Electric';
    const modelName = bike['Model Name'] || 'S1X';
    const variantName = bike['Variant Name'] || '';
    const segmentValue = bike['Segment'] || 'Mass Market';

    const rangeValue = bike['Certified Range (km)'] || 'N/A';
    const speedValue = bike['Top Speed (km/h)'] || 'N/A';
    const batteryValue = bike['Battery Capacity (kWh)'] || 'N/A';
    const bikeId = bike['S.No.'] || 1;

    // 💰 PURE DYNAMIC PRICE RESOLVER (Matches homepage dynamic mapping)
    const range = Number(bike['Certified Range (km)']) || 0;
    const topSpeed = Number(bike['Top Speed (km/h)']) || 0;
    const battery = Number(bike['Battery Capacity (kWh)']) || 2;

    let estimatedPrice = 80000 + (range * 300) + (topSpeed * 400) + (battery * 5000);
    estimatedPrice = Math.round(estimatedPrice / 1000) * 1000;
    const displayPrice = `₹${estimatedPrice.toLocaleString('en-IN')}*`;

    // 📸 TRUE HOME CARD IMAGE RESOLVER PATH
    const finalImageUrl = getBikeImageUrl(brandName, modelName);

    return (
        <div className="bg-[#0b0c10] min-h-screen text-neutral-200 font-sans antialiased flex flex-col justify-between">

            {/* Main Content Wrapper */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 w-full flex-grow">

                {/* Navigation Breadcrumbs */}
                <p className="text-neutral-500 text-[11px] font-mono uppercase tracking-wider mb-6 flex items-center gap-1.5">
                    <Link href="/" className="hover:text-[#79b947] transition-colors">Home</Link>
                    <span className="text-neutral-700">/</span>
                    <Link href="/Find-EV" className="hover:text-[#79b947] transition-colors">Find-EV</Link>
                    <span className="text-neutral-700">/</span>
                    <span className="text-[#79b947] font-bold">{brandName} {modelName}</span>
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">

                    {/* LEFT PANEL: TRUE BIKE CARD IMAGE LOCATION */}
                    <div className="lg:col-span-7">
                        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[360px] md:min-h-[440px] shadow-xl relative group">
                            <img
                                src={finalImageUrl}
                                alt={`${brandName} ${modelName}`}
                                className="max-h-[280px] md:max-h-[350px] object-contain transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    const projectID = 'bwneyzbsohxwlgdludby';
                                    e.currentTarget.src = `https://${projectID}.supabase.co/storage/v1/object/public/bikes/${bikeId}.png`;
                                }}
                            />
                        </div>
                    </div>

                    {/* RIGHT PANEL: FULL SPEC SHEET DETAILS */}
                    <div className="lg:col-span-5 bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
                        <div>
                            <span className="text-[#79b947] text-[10px] font-mono font-bold uppercase tracking-widest block bg-[#79b947]/10 border border-[#79b947]/20 w-fit px-2.5 py-1 rounded-md mb-2">
                                {segmentValue}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                                {brandName} {modelName}
                                {variantName && <span className="text-sm font-medium text-neutral-400 block mt-1">{variantName}</span>}
                            </h1>
                        </div>

                        {/* Technical Specs Data Matrix */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-b border-neutral-800 py-6 font-mono">
                            <div>
                                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider block">⚡ CERTIFIED RANGE</span>
                                <span className="text-white text-sm font-bold mt-1 block">
                                    {rangeValue !== 'N/A' && !String(rangeValue).includes('km') ? `${rangeValue} km` : rangeValue}
                                </span>
                            </div>
                            <div>
                                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider block">🏁 TOP SPEED</span>
                                <span className="text-white text-sm font-bold mt-1 block">
                                    {speedValue !== 'N/A' && !String(speedValue).includes('km/h') ? `${speedValue} km/h` : speedValue}
                                </span>
                            </div>
                            <div>
                                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider block">🔋 BATTERY CAPACITY</span>
                                <span className="text-white text-sm font-bold mt-1 block">
                                    {batteryValue !== 'N/A' && !String(batteryValue).includes('kWh') ? `${batteryValue} kWh` : batteryValue}
                                </span>
                            </div>
                            <div>
                                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider block">🆔 SERIAL NUMBER</span>
                                <span className="text-white text-sm font-bold mt-1 block"># {bikeId}</span>
                            </div>
                        </div>

                        {/* 100% Dynamic Calculated Price Box */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">Estimated Price</span>
                                <span className="text-2xl font-black text-white mt-0.5 block">
                                    {displayPrice}
                                </span>
                            </div>
                            <span className="text-[9px] font-mono font-bold text-neutral-400 tracking-wide border border-neutral-800 rounded px-2 py-1 bg-neutral-950">
                                EX-SHOWROOM
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 mt-2">
                            <Link href={`/compare?id=${bikeId}`} className="w-full text-center block">
                                <button className="w-full bg-[#79b947] hover:bg-[#68a33b] text-neutral-950 font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all shadow-md font-mono">
                                    Compare {modelName}
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>

                {/* ========================================================= */}
                {/* 📝 SECTION: ABOUT THIS VEHICLE */}
                {/* ========================================================= */}
                <div className="border-t border-neutral-900/60 pt-10 mb-12">
                    <h2 className="text-xl font-extrabold text-white tracking-tight">About This Vehicle</h2>
                    <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-2xl p-6 mt-4 font-mono text-xs text-neutral-400 leading-relaxed max-w-4xl">
                        <p>
                            The <span className="text-white font-bold">{brandName} {modelName} {variantName}</span> is engineered for optimal performance in urban commuting. Equipped with advanced smart connectivity features, robust battery management systems, and high efficiency, it stands out as a reliable choice in the {segmentValue} electric vehicle segment.
                        </p>
                        <p className="mt-3">
                            With a certified range of <span className="text-[#79b947] font-bold">{rangeValue}</span> and a top speed of <span className="text-[#79b947] font-bold">{speedValue}</span>, this model ensures a cost-effective, eco-friendly drive experience, requiring minimal maintenance while maximizing energy output via its <span className="text-white font-bold">{batteryValue}</span> power unit configuration.
                        </p>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* SECTION: SIMILAR ELECTRIC VEHICLES */}
                {/* ========================================================= */}
                <div className="border-t border-neutral-900/60 pt-10 mb-16">
                    <h2 className="text-xl font-extrabold text-white tracking-tight">Similar Electric Vehicles</h2>
                    <p className="text-neutral-500 text-xs mt-1 mb-6 font-mono">Compare alternatives with similar pricing, range, body style, and features.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                        {similarBikes && similarBikes.length > 0 ? similarBikes.map((sb) => {
                            const sId = sb['S.No.'];
                            const sRange = Number(sb['Certified Range (km)']) || 0;
                            const sSpeed = Number(sb['Top Speed (km/h)']) || 0;
                            const sBattery = Number(sb['Battery Capacity (kWh)']) || 2;
                            let sPriceCalc = 80000 + (sRange * 300) + (sSpeed * 400) + (sBattery * 5000);
                            sPriceCalc = Math.round(sPriceCalc / 1000) * 1000;

                            return (
                                <div key={sId} className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-4 flex flex-col justify-between shadow-md hover:border-neutral-700/80 transition-all">
                                    <div className="flex items-center justify-center bg-neutral-950/40 rounded-lg p-3 min-h-[140px] mb-3">
                                        <img
                                            src={`https://bwneyzbsohxwlgdludby.supabase.co/storage/v1/object/public/bikes/${sId}.png`}
                                            className="max-h-[100px] object-contain"
                                            alt={`${sb['Brand / OEM'] || ''} ${sb['Model Name'] || ''}`}
                                            onError={(e) => {
                                                const current = e.currentTarget.src;
                                                // Loop rokne ke liye check lagaya hai
                                                if (!current.includes('stop=true')) {
                                                    // Agar main URL kaam na kare toh local standard folder try karega
                                                    const bName = String(sb['Brand / OEM'] || '').trim();
                                                    const mName = String(sb['Model Name'] || '').trim();
                                                    e.currentTarget.src = `/EV_Bikes/${bName}/${mName}.png?stop=true`;
                                                } else {
                                                    // Agar dono jagah na mile toh layout kharab hone ke bajay broken icon gayab ho jayega
                                                    e.currentTarget.style.display = 'none';
                                                }
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-white truncate">{sb['Brand / OEM'] || sb['Brand/OEM']} {sb['Model Name']}</h3>
                                        <p className="text-[11px] font-mono text-[#79b947] mt-0.5">{sb['Variant Name'] || `${sb['Battery Capacity (kWh)']} kWh`}</p>
                                        <p className="text-xs font-mono font-bold text-neutral-400 mt-2">₹{sPriceCalc.toLocaleString('en-IN')}*</p>
                                    </div>
                                    <Link href={`/bike/${sId}`} className="mt-4 w-full text-center bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-[11px] py-2 rounded-md tracking-wide transition-colors block">
                                        View Details
                                    </Link>
                                </div>
                            );
                        }) : (
                            <div className="col-span-4 text-center py-6 border border-dashed border-neutral-800 rounded-xl text-neutral-600 text-xs font-mono">No similar alternative vehicles found matching this segment range.</div>
                        )}
                    </div>
                </div>

            </div> {/* Main Content Wrapper Ends */}

            {/* ========================================================= */}
            {/* 🌟 EXACT MATCHED 4-COLUMN FOOTER COMPONENT */}
            {/* ========================================================= */}
            <footer className="w-full bg-neutral-950 border-t border-neutral-900/80 py-12 text-neutral-400 font-mono text-xs mt-auto">
                <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                    {/* COLUMN 1 */}
                    <div className="md:col-span-4 flex flex-col gap-3">
                        <div className="text-white font-black tracking-tighter text-base uppercase flex items-center gap-1">
                            EV<span className="text-[#79b947]">.BIKE</span>
                        </div>
                        <p className="text-neutral-500 leading-relaxed max-w-sm text-[11px]">
                            India's most trusted platform for finding, comparing, and analyzing electric vehicles within your budget.
                        </p>
                    </div>

                    {/* COLUMN 2 */}
                    <div className="md:col-span-2 flex flex-col gap-2">
                        <span className="text-neutral-500 font-bold uppercase text-[11px] tracking-wider mb-1">// QUICK LINKS</span>
                        <Link href="/" className="hover:text-[#79b947] transition-colors">Home</Link>
                        <Link href="/" className="hover:text-[#79b947] transition-colors">Comparison</Link>
                        <Link href="/" className="hover:text-[#79b947] transition-colors">Brands</Link>
                        <Link href="/" className="hover:text-[#79b947] transition-colors">EV Calculator</Link>
                        <Link href="/" className="hover:text-[#79b947] transition-colors">Find-EV</Link>
                        <Link href="/" className="hover:text-[#79b947] transition-colors">Charging Stations</Link>
                    </div>

                    {/* COLUMN 3 */}
                    <div className="md:col-span-3 flex flex-col gap-2">
                        <span className="text-neutral-500 font-bold uppercase text-[11px] tracking-wider mb-1">// POPULAR BRANDS</span>
                        <span className="hover:text-[#79b947] cursor-pointer transition-colors">Revolt Motors</span>
                        <span className="hover:text-[#79b947] cursor-pointer transition-colors">Matter Energy</span>
                        <span className="hover:text-[#79b947] cursor-pointer transition-colors">Oben Electric</span>
                        <span className="hover:text-[#79b947] cursor-pointer transition-colors">Tork Motors</span>
                    </div>

                    {/* COLUMN 4 */}
                    <div className="md:col-span-3 flex flex-col gap-2">
                        <span className="text-neutral-500 font-bold uppercase text-[11px] tracking-wider mb-1">// CONTACT SUPPORT</span>
                        <p className="text-neutral-300 font-bold">+91 63506-71636</p>
                        <a href="mailto:info@evbike.com" className="hover:text-[#79b947] transition-colors text-neutral-400 break-all">info@evbike.com</a>
                    </div>

                </div>

                {/* COPYRIGHT TRACK */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-neutral-900/60 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-neutral-600 gap-2">
                    <p>© 2026 EV.BIKE MATRIX MEDIA. ALL RIGHTS RESERVED.</p>
                    <p className="tracking-widest uppercase text-neutral-500 text-[9px]">MADE FOR INDIA'S EV REVOLUTION</p>
                </div>
            </footer>

        </div>
    );
}