
import React, { useState } from 'react';
import { X, ShieldAlert, Thermometer, Compass, Zap, MapPin, CheckCircle2, Camera, Navigation, Heart, Languages, Landmark, Star } from 'lucide-react';
import { CityData } from '../types';

interface IntelBriefingProps {
  data: CityData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProgressBar: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color = "bg-blue-500" }) => (
  <div className="space-y-2 mb-6 group">
    <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-white/30 group-hover:text-white/50 transition-colors">
      <span>{label}</span>
      <span className="font-mono">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
      <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_currentColor]`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const IntelBriefing: React.FC<IntelBriefingProps> = ({ data, isOpen, onClose }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  if (!data) return null;

  return (
    <div className={`fixed inset-0 z-[600] flex items-center justify-center transition-opacity duration-400 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={onClose} />
      
      <div className={`relative w-full h-full md:h-[95%] max-w-7xl glass rounded-none md:rounded-[48px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col overflow-hidden transition-all duration-500 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        <div className="shrink-0 p-6 md:p-10 flex justify-between items-center border-b border-white/10 relative z-20 bg-black/40 backdrop-blur-md">
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center justify-center">
               <MapPin className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="flex items-center space-x-3 text-blue-500 mb-0.5">
                 <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Field Report // Active</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-syne font-bold tracking-tighter text-white uppercase">{data.name}</h2>
            </div>
          </div>
          <button onClick={() => { setImgLoaded(false); onClose(); }} className="p-4 hover:bg-white/10 rounded-full transition-all group border border-white/5">
            <X className="w-6 h-6 text-white/30 group-hover:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto smooth-scroll image-container">
          <div className="max-w-6xl mx-auto space-y-20 p-8 md:p-16 pb-32">
            
            <div className="relative h-64 md:h-[400px] rounded-[40px] overflow-hidden group shadow-2xl border border-white/5 blueprint-grid bg-black/40">
              {data.imageUrls && data.imageUrls[0] ? (
                <div className="w-full h-full scanlines">
                  {!imgLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-500/20">
                       <Camera className="w-20 h-20 animate-pulse" />
                    </div>
                  )}
                  <img src={data.imageUrls[0]} alt="" onLoad={() => setImgLoaded(true)} className={`w-full h-full object-cover intel-image ${imgLoaded ? 'opacity-90' : 'opacity-0'}`} />
                </div>
              ) : (
                <div className="w-full h-full bg-white/[0.02] flex items-center justify-center">
                  <Camera className="w-16 h-16 text-white/5" />
                </div>
              )}
              <div className="absolute bottom-8 left-8">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-400">Personalized Insights Ready</p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bento-card p-8 flex items-center space-x-6 border-blue-500/10">
                <div className="p-5 bg-orange-500/10 rounded-2xl"><Thermometer className="text-orange-400 w-8 h-8" /></div>
                <div>
                  <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mb-1">Temperature</p>
                  <p className="text-4xl font-bold font-syne">{data.temp}°C</p>
                </div>
              </div>
              <div className="bento-card p-8 flex items-center space-x-6 border-blue-500/10">
                <div className="p-5 bg-blue-500/10 rounded-2xl"><Compass className="text-blue-400 w-8 h-8" /></div>
                <div>
                  <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mb-1">Compatibility</p>
                  <p className="text-4xl font-bold font-syne">{data.compatibilityScore}%</p>
                </div>
              </div>
              <div className="bento-card p-8 flex items-center space-x-6 border-blue-500/10">
                <div className="p-5 bg-emerald-500/10 rounded-2xl"><Navigation className="text-emerald-400 w-8 h-8" /></div>
                <div>
                  <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mb-1">Location</p>
                  <p className="text-2xl font-bold font-syne truncate uppercase">{data.country}</p>
                </div>
              </div>
            </div>

            {/* Local Tips & Cultural Protocols */}
            <div className="space-y-12">
              <div className="flex items-center space-x-4 px-2">
                <Languages className="w-5 h-5 text-blue-500" />
                <h3 className="font-syne font-bold uppercase tracking-[0.4em] text-base">Local Tips & Cultural Greeting</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bento-card border-blue-500/10 flex flex-col justify-center space-y-6">
                  <div>
                    <p className="text-[9px] font-black text-blue-500/40 uppercase tracking-widest mb-2">Cultural Salutation</p>
                    <p className="text-5xl font-semibold text-white tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {data.intelligence.greeting}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-white/60 text-sm leading-relaxed italic">
                      "Usage: {data.intelligence.etiquette.find(e => e.toLowerCase().includes('greet') || e.toLowerCase().includes('nod')) || 'Use this greeting to show respect to locals upon meeting.'}"
                    </p>
                  </div>
                </div>
                <div className="p-10 bento-card border-emerald-500/10 space-y-6">
                  <p className="text-[9px] font-black text-emerald-500/40 uppercase tracking-widest mb-2">Engagement Protocol</p>
                  <ul className="space-y-4">
                    {data.intelligence.etiquette.slice(0, 3).map((e, i) => (
                      <li key={i} className="flex items-start space-x-4">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-white/80 text-sm font-medium leading-relaxed">{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Inclusivity Section: Major Festivals */}
            <div className="space-y-12">
              <div className="flex items-center space-x-4 px-2">
                <Star className="w-5 h-5 text-purple-500" />
                <h3 className="font-syne font-bold uppercase tracking-[0.4em] text-base">Key Regional Traditions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {data.intelligence.traditions.map((t, i) => (
                   <div key={i} className="p-8 glass rounded-[32px] border-white/5 flex items-start space-x-5">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0 shadow-[0_0_10px_rgba(168,85,247,1)]" />
                      <p className="text-white/70 text-base font-medium leading-relaxed">{t}</p>
                   </div>
                 ))}
              </div>
            </div>

            <div className="space-y-12">
               <div className="flex items-center space-x-4 px-2">
                  <Navigation className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-syne font-bold uppercase tracking-[0.4em] text-base">Recommended Stops (5X)</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {data.intelligence.nearbySpots.map((spot, i) => (
                    <div key={i} className="p-8 bento-card border-white/5 hover:border-emerald-500/20 transition-all flex flex-col h-full group/spot">
                       <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-3 block">{spot.type}</span>
                       <h4 className="text-xl font-syne font-bold mb-4 text-white group-hover/spot:text-emerald-400 transition-colors">{spot.name}</h4>
                       <p className="text-white/40 leading-relaxed text-sm font-medium flex-1">{spot.description}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-12">
                <div className="flex items-center space-x-4 px-2">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  <h3 className="font-syne font-bold uppercase tracking-[0.4em] text-base">Sentry Safety Overview</h3>
                </div>
                <div className="grid gap-2">
                  <ProgressBar label="Political Stability" value={data.intelligence.safety.political} color="bg-blue-500" />
                  <ProgressBar label="Crime Incidence" value={data.intelligence.safety.crime} color="bg-emerald-500" />
                  <ProgressBar label="Public Health" value={data.intelligence.safety.health} color="bg-cyan-500" />
                  <ProgressBar label="Natural Resilience" value={data.intelligence.safety.disaster} color="bg-orange-500" />
                </div>
              </div>

              <div className="space-y-12">
                <div className="flex items-center space-x-4 px-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-syne font-bold uppercase tracking-[0.4em] text-base">Field Precautions</h3>
                </div>
                {data.intelligence.warnings.length > 0 ? (
                  <div className="grid gap-6">
                    {data.intelligence.warnings.map((w, i) => (
                      <div key={i} className="flex items-start space-x-6 p-8 bg-red-950/20 rounded-3xl border border-red-500/20">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2.5 shrink-0 shadow-[0_0_10px_rgba(239,68,68,1)]" />
                        <p className="text-lg text-red-100/80 leading-relaxed font-medium">{w}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 glass rounded-3xl border-emerald-500/20 flex flex-col items-center justify-center text-center h-full">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-4" />
                    <p className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Everything looks good</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-24 pb-12 border-t border-white/5 text-center">
              <p className="text-2xl md:text-3xl text-white/50 leading-relaxed italic max-w-4xl mx-auto font-serif mb-16">
                "{data.description}"
              </p>
              <button onClick={() => { setImgLoaded(false); onClose(); }} className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 shadow-2xl">
                Ready to Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelBriefing;
