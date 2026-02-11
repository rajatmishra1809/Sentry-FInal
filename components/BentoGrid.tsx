import React, { useState, useEffect } from 'react';
import { Shield, Wind, MapPin, Activity, Search, Camera, Map, Languages, Navigation, UserCheck } from 'lucide-react';
import { CityData, UserProfile } from '../types';

interface BentoGridProps {
  city: CityData | null;
  user: UserProfile | null;
}

const BentoGrid: React.FC<BentoGridProps> = ({ city, user }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
    if (city?.imageUrls && city.imageUrls.length > 1) {
      setCurrentImageIndex(0);
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % city.imageUrls!.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [city]);

  return (
    <div className="h-full w-full overflow-y-auto smooth-scroll overscroll-behavior-contain">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[160px] p-4 pb-48 max-w-[1600px] mx-auto">
        {/* Destination Header */}
        <div className="col-span-1 md:col-span-2 row-span-2 bento-card p-10 md:p-12 flex flex-col justify-between group overflow-hidden relative border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.05)]">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/[0.05] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <span className={`w-2 h-2 rounded-full ${city ? 'bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,1)]' : 'bg-white/20'}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400">
                {city ? 'Live Destination' : 'SENTRY // ONLINE'}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-syne font-bold leading-none tracking-tighter mb-6">
              {city ? city.name : 'WHERE TO?'}
            </h1>
            <div className="flex items-center text-white/40 text-xs font-bold uppercase tracking-[0.3em]">
              {city ? (
                <><MapPin className="w-4 h-4 mr-2 text-blue-500" /> {city.country}</>
              ) : 'SEARCH A CITY TO GET STARTED'}
            </div>
          </div>
          <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Activity className="w-4 h-4 text-blue-500/50" />
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.4em]">
                  {city ? 'Status: Active' : 'Ready for discovery'}
                </p>
            </div>
            {!city && (
              <div className="text-[10px] text-blue-400/40 font-mono italic flex items-center animate-pulse">
                <Search className="w-3 h-3 mr-2" />
                CMD+K to search
              </div>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div className="col-span-1 md:col-span-1 row-span-2 bento-card overflow-hidden relative group border-white/5 blueprint-grid image-container">
          {city && city.imageUrls && city.imageUrls.length > 0 ? (
            <div className="relative w-full h-full scanlines bg-black">
              {!imgLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-blue-500/20 animate-pulse">
                  <Camera className="w-16 h-16" />
                  <span className="text-[8px] font-black uppercase tracking-[0.4em]">Loading...</span>
                </div>
              )}
              {city.imageUrls.map((url, idx) => (
                <div 
                  key={url}
                  className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img 
                    src={url} 
                    alt="" 
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full h-full object-cover intel-image ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} 
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none" />
              <div className="absolute bottom-4 left-4 z-10">
                <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.4em] bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">PHOTO 0{currentImageIndex + 1}</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-20 grayscale blueprint-grid">
              <Camera className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* Customs */}
        <div className="col-span-1 md:col-span-1 bento-card p-6 flex flex-col border-blue-500/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <Languages className="w-4 h-4 text-blue-500" />
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">Local Tips</span>
          </div>
          <div className="flex-1 overflow-y-auto smooth-scroll pr-1">
            {city && city.intelligence.traditions ? (
              <p className="text-[11px] text-white/80 font-medium leading-relaxed italic border-l-2 border-blue-500/40 pl-3 py-1">
                "{city.intelligence.traditions[0]}"
              </p>
            ) : (
              <div className="space-y-2 opacity-5">
                <div className="h-2 w-full bg-white rounded" />
              </div>
            )}
          </div>
        </div>

        {/* Places to Visit */}
        <div className="col-span-1 md:col-span-1 row-span-2 bento-card p-8 flex flex-col border-emerald-500/10 transition-all">
          <div className="flex items-center justify-between mb-8">
            <Map className="w-5 h-5 text-emerald-500" />
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-400/20">Spots to Visit</span>
          </div>
          <div className="space-y-3 flex-1 smooth-scroll pr-1">
            {city && city.intelligence.nearbySpots ? (
              city.intelligence.nearbySpots.map((spot, i) => (
                <div key={i} className="group/spot p-3 rounded-2xl hover:bg-emerald-500/[0.03] transition-all border border-transparent hover:border-emerald-500/10">
                  <p className="text-[7px] font-black text-emerald-500/60 uppercase tracking-widest truncate">{spot.type}</p>
                  <p className="text-[10px] font-bold text-white uppercase tracking-wider truncate">{spot.name}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col justify-center opacity-5 space-y-6">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-2 w-full bg-white rounded" />)}
              </div>
            )}
          </div>
        </div>

        {/* Weather */}
        <div className="bento-card p-8 flex flex-col justify-between border-orange-500/10 group transition-all">
          <div className="flex justify-between items-start">
            <Wind className="text-orange-500/20 w-8 h-8" />
            <span className="text-[8px] font-bold text-orange-400/60 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20 uppercase">Weather</span>
          </div>
          <div className="mt-4">
            <p className="text-5xl font-syne font-bold tracking-tighter">{city ? `${Math.round(city.temp)}°C` : '--'}</p>
            <p className="text-[9px] uppercase font-black text-white/20 tracking-[0.3em]">Current Temp</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="bento-card p-8 flex flex-col justify-between border-white/5 transition-all">
          <div className="flex items-center space-x-3">
            <UserCheck className="w-4 h-4 text-blue-500/40" />
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">Profile</p>
          </div>
          <div className="mt-4 truncate">
            <p className="text-2xl font-bold font-syne uppercase tracking-tighter text-white">{user?.name}</p>
            <p className="text-[9px] text-white/10 font-black uppercase tracking-[0.4em]">{user?.religion}</p>
          </div>
        </div>

        {/* Safety Overview */}
        <div className="col-span-1 md:col-span-2 bento-card p-8 flex flex-col justify-between border-red-500/10 hover:border-red-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 text-red-500/40">
              <Shield className="w-4 h-4" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em]">Safety Overview</h3>
            </div>
            <span className="text-[9px] font-mono text-white/20 uppercase truncate">{city?.country || 'READY'}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/[0.01] rounded-2xl border border-white/5 flex items-center justify-between">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Stability</span>
              <span className={`text-[11px] font-mono font-black ${(city?.intelligence?.safety?.political || 0) > 80 ? 'text-emerald-400' : 'text-red-400'}`}>
                {(city?.intelligence?.safety?.political || 0) > 80 ? 'STABLE' : 'WATCH'}
              </span>
            </div>
            <div className="p-3 bg-white/[0.01] rounded-2xl border border-white/5 flex items-center justify-between">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Score</span>
              <span className="text-[11px] text-emerald-400 font-mono font-black">HIGH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BentoGrid;