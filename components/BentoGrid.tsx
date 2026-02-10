
import React, { useState, useEffect } from 'react';
import { Shield, Wind, MapPin, Activity, Search, Camera, Map, Languages, Navigation, UserCheck } from 'lucide-react';
import { CityData, UserProfile } from '../types';

interface BentoGridProps {
  city: CityData | null;
  user: UserProfile | null;
}

const BentoGrid: React.FC<BentoGridProps> = ({ city, user }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (city?.imageUrls && city.imageUrls.length > 1) {
      setCurrentImageIndex(0);
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % city.imageUrls!.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [city]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[160px] p-4 pb-40 max-w-[1600px] mx-auto overflow-y-auto h-full scroll-smooth scrollbar-hide">
      {/* Sector Header Card */}
      <div className="col-span-1 md:col-span-2 row-span-2 bento-card p-12 flex flex-col justify-between group overflow-hidden relative border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.05)]">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/[0.05] to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <span className={`w-2 h-2 rounded-full ${city ? 'bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,1)]' : 'bg-white/20'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400">
              {city ? 'Active Surveillance' : 'SENTRY CORE // ONLINE'}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-syne font-bold leading-none tracking-tighter mb-6 group-hover:tracking-tight transition-all duration-700">
            {city ? city.name : 'SYSTEM IDLE'}
          </h1>
          <div className="flex items-center text-white/40 text-xs font-bold uppercase tracking-[0.3em]">
            {city ? (
              <><MapPin className="w-4 h-4 mr-2 text-blue-500" /> {city.country}</>
            ) : 'AWAITING MISSION VECTOR'}
          </div>
        </div>
        <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between">
           <div className="flex items-center space-x-4">
              <Activity className="w-4 h-4 text-blue-500/50" />
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.4em]">
                {city ? 'Linkage: Solid' : 'Operational Status: Standby'}
              </p>
           </div>
           {!city && (
             <div className="text-[10px] text-blue-400/40 font-mono italic flex items-center animate-pulse">
               <Search className="w-3 h-3 mr-2" />
               CMD+K to scan targets
             </div>
           )}
        </div>
      </div>

      {/* Visual Asset Gallery */}
      <div className="col-span-1 md:col-span-1 row-span-2 bento-card overflow-hidden relative group border-white/5">
        {city && city.imageUrls && city.imageUrls.length > 0 ? (
          <div className="relative w-full h-full">
            {city.imageUrls.map((url, idx) => (
              <div 
                key={url}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentImageIndex ? 'opacity-60 scale-105' : 'opacity-0 scale-100'}`}
              >
                <img 
                  src={url} 
                  alt={`${city.name} asset ${idx}`} 
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" 
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-80" />
            <div className="absolute top-6 left-6 flex items-center space-x-3">
              <div className="w-10 h-10 glass rounded-full flex items-center justify-center border border-white/20 shadow-xl">
                <Camera className="w-4 h-4 text-white/80" />
              </div>
              <span className="text-[9px] font-black text-white uppercase tracking-[0.4em] bg-blue-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-blue-500/30">Asset {currentImageIndex + 1}</span>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex space-x-2">
                {city.imageUrls.slice(0, 5).map((_, idx) => (
                  <div key={idx} className={`h-1 flex-1 transition-all duration-500 rounded-full ${idx === currentImageIndex ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-10 grayscale">
            <Camera className="w-12 h-12" />
            <p className="text-[10px] font-bold uppercase tracking-[0.5em]">Awaiting Uplink</p>
          </div>
        )}
      </div>

      {/* Cultural Protocols & Traditions - FIXED OVERFLOW */}
      <div className="col-span-1 md:col-span-1 bento-card p-6 flex flex-col border-blue-500/10 hover:border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.02)] relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 shrink-0">
           <Languages className="w-4 h-4 text-blue-500" />
           <span className="text-[8px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-blue-400/20">Protocol</span>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide pr-1">
          {city && city.intelligence.traditions ? (
            <p className="text-[11px] text-white font-medium leading-relaxed italic border-l-2 border-blue-500/40 pl-3 py-1">
              "{city.intelligence.traditions[0]}"
            </p>
          ) : (
            <div className="space-y-2 opacity-5">
              <div className="h-2 w-full bg-white rounded" />
              <div className="h-2 w-2/3 bg-white rounded" />
            </div>
          )}
        </div>
        <p className="text-[8px] uppercase font-black text-white/20 tracking-[0.4em] pt-3 border-t border-white/5 mt-auto shrink-0">Local Nuance</p>
      </div>

      {/* Strategic Landmarks */}
      <div className="col-span-1 md:col-span-1 row-span-2 bento-card p-8 flex flex-col border-emerald-500/10 hover:border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.02)] transition-all">
        <div className="flex items-center justify-between mb-8">
           <Map className="w-5 h-5 text-emerald-500" />
           <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-400/20">Landmarks</span>
        </div>
        <div className="space-y-4 flex-1 scrollbar-hide overflow-y-auto pr-1">
          {city && city.intelligence.nearbySpots ? (
            city.intelligence.nearbySpots.slice(0, 4).map((spot, i) => (
              <div key={i} className="group/spot p-4 rounded-2xl hover:bg-emerald-500/[0.03] transition-all border border-transparent hover:border-emerald-500/10 cursor-default">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">{spot.type}</p>
                  <Navigation className="w-3 h-3 text-emerald-500/0 group-hover/spot:text-emerald-500/40 transition-all" />
                </div>
                <p className="text-xs font-bold text-white group-hover/spot:translate-x-1 transition-transform uppercase tracking-wider truncate">{spot.name}</p>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col justify-center opacity-5 space-y-8">
              {[1, 2, 3].map(i => <div key={i} className="h-2.5 w-full bg-white rounded" />)}
            </div>
          )}
        </div>
      </div>

      {/* Sector Ambience (Weather) */}
      <div className="bento-card p-8 flex flex-col justify-between border-orange-500/10 hover:border-orange-500/30 group transition-all">
        <div className="flex justify-between items-start">
          <Wind className="text-orange-500/20 w-8 h-8 group-hover:scale-110 group-hover:text-orange-500/50 transition-all" />
          <span className="text-[9px] font-bold text-orange-400/60 uppercase tracking-[0.3em] bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">Meteo</span>
        </div>
        <div className="mt-4">
          <p className="text-5xl font-syne font-bold tracking-tighter">{city ? `${Math.round(city.temp)}°C` : '--'}</p>
          <p className="text-[10px] uppercase font-black text-white/20 tracking-[0.3em] mt-1">Surface Ambience</p>
        </div>
      </div>

      {/* Agent Authentication */}
      <div className="bento-card p-8 flex flex-col justify-between border-white/5 hover:border-white/20 transition-all group">
        <div className="flex items-center space-x-3">
          <UserCheck className="w-4 h-4 text-blue-500/40 group-hover:text-blue-500 transition-colors" />
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">Verified Agent</p>
        </div>
        <div className="mt-4 truncate">
          <p className="text-2xl font-bold font-syne uppercase tracking-tighter text-white group-hover:tracking-normal transition-all">{user?.name}</p>
          <p className="text-[9px] text-white/10 font-black uppercase tracking-[0.4em] mt-1">{user?.religion}</p>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="col-span-1 md:col-span-2 bento-card p-8 flex flex-col justify-between border-red-500/10 hover:border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.02)] transition-all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 text-red-500/40">
            <Shield className="w-4 h-4" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em]">Sector Stability</h3>
          </div>
          <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{city?.country || 'Grid: Global'}</span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 bg-white/[0.02] rounded-3xl border border-white/5 flex items-center justify-between group/metric">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Political</span>
            <span className="text-[11px] text-red-400 font-mono font-black group-hover/metric:animate-pulse">STABLE</span>
          </div>
          <div className="p-4 bg-white/[0.02] rounded-3xl border border-white/5 flex items-center justify-between group/metric">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Safety Index</span>
            <span className="text-[11px] text-emerald-400 font-mono font-black group-hover/metric:animate-pulse">HIGH</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BentoGrid;
