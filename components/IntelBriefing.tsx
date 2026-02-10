
import React from 'react';
import { X, ShieldAlert, Thermometer, User, Compass, Zap, MapPin, CheckCircle2, FileText, Camera, Navigation, Heart, Languages } from 'lucide-react';
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
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
      <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_currentColor]`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const IntelBriefing: React.FC<IntelBriefingProps> = ({ data, isOpen, onClose }) => {
  if (!data) return null;

  return (
    <div className={`fixed inset-0 z-[600] flex items-center justify-center transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-3xl" 
        onClick={onClose}
      />
      
      {/* Dossier Container */}
      <div className={`relative w-full h-full md:h-[95%] max-w-7xl glass rounded-none md:rounded-[48px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col overflow-hidden transition-all duration-700 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        {/* Dossier Header - Always Visible */}
        <div className="shrink-0 p-6 md:p-10 flex justify-between items-center border-b border-white/10 relative z-20 bg-black/40 backdrop-blur-md">
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center justify-center">
               <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="flex items-center space-x-3 text-blue-500 mb-0.5">
                 <span className="text-[10px] font-black uppercase tracking-[0.5em]">Classified Dossier</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-syne font-bold tracking-tighter text-white">{data.name}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-full transition-all group border border-white/5">
            <X className="w-6 h-6 text-white/30 group-hover:text-white" />
          </button>
        </div>

        {/* Content Area - THE IMAGE NOW SCROLLS WITH THE REST */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-6xl mx-auto space-y-20 p-8 md:p-16 pb-32">
            
            {/* Hero Visual - Integrated into scroll flow */}
            <div className="relative h-64 md:h-[450px] rounded-[40px] overflow-hidden group shadow-2xl border border-white/5">
              {data.imageUrls && data.imageUrls[0] ? (
                <img src={data.imageUrls[0]} alt="" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
              ) : (
                <div className="w-full h-full bg-white/[0.02] flex items-center justify-center">
                  <Camera className="w-20 h-20 text-white/5" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Primary Record</p>
                  <p className="text-xl font-bold font-syne uppercase tracking-tighter">{data.name} Surveillance Feed</p>
                </div>
                <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-white/80">Live Record</span>
                </div>
              </div>
            </div>

            {/* Quick Intel Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bento-card p-8 flex items-center space-x-6 border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="p-5 bg-orange-500/10 rounded-2xl"><Thermometer className="text-orange-400 w-10 h-10" /></div>
                <div>
                  <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mb-1">Ambient Surface</p>
                  <p className="text-4xl font-bold font-syne">{data.temp}°C</p>
                </div>
              </div>
              <div className="bento-card p-8 flex items-center space-x-6 border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="p-5 bg-blue-500/10 rounded-2xl"><Compass className="text-blue-400 w-10 h-10" /></div>
                <div>
                  <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mb-1">SENTRY Score</p>
                  <p className="text-4xl font-bold font-syne">{data.compatibilityScore}%</p>
                </div>
              </div>
              <div className="bento-card p-8 flex items-center space-x-6 border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="p-5 bg-emerald-500/10 rounded-2xl"><Navigation className="text-emerald-400 w-10 h-10" /></div>
                <div>
                  <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mb-1">Sector Origin</p>
                  <p className="text-2xl font-bold font-syne truncate">{data.country}</p>
                </div>
              </div>
            </div>

            {/* Local Traditions & Nuances */}
            <div className="space-y-12">
               <div className="flex items-center space-x-4">
                  <Languages className="w-6 h-6 text-blue-500" />
                  <h3 className="font-syne font-bold uppercase tracking-[0.4em] text-lg">Cultural Protocols</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {data.intelligence.traditions.map((tradition, i) => (
                    <div key={i} className="p-8 bento-card border-blue-500/10 bg-blue-500/[0.02] flex items-start space-x-6 group hover:bg-blue-500/[0.04] transition-colors shadow-lg">
                       <Heart className="w-6 h-6 text-blue-400 shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                       <p className="text-xl text-white/90 leading-relaxed font-medium">{tradition}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Matrix & Advisories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-12">
                <div className="flex items-center space-x-4">
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                  <h3 className="font-syne font-bold uppercase tracking-[0.4em] text-lg">Stability Matrix</h3>
                </div>
                <div className="grid gap-2">
                  <ProgressBar label="Political Stability" value={data.intelligence.safety.political} color="bg-blue-500" />
                  <ProgressBar label="Crime Minimization" value={data.intelligence.safety.crime} color="bg-emerald-500" />
                  <ProgressBar label="Health Infrastructure" value={data.intelligence.safety.health} color="bg-cyan-500" />
                  <ProgressBar label="Climate Resilience" value={data.intelligence.safety.disaster} color="bg-orange-500" />
                  <ProgressBar label="Inclusivity" value={data.intelligence.safety.lgbtq} color="bg-purple-500" />
                </div>
              </div>

              <div className="space-y-12">
                <div className="flex items-center space-x-4">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <h3 className="font-syne font-bold uppercase tracking-[0.4em] text-lg">Operational Warnings</h3>
                </div>
                {data.intelligence.warnings.length > 0 ? (
                  <div className="grid gap-6">
                    {data.intelligence.warnings.map((w, i) => (
                      <div key={i} className="flex items-start space-x-6 p-8 bg-red-950/20 rounded-3xl border border-red-500/20 group hover:border-red-500/40 transition-all">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full mt-2.5 shrink-0 shadow-[0_0_12px_rgba(239,68,68,1)] animate-pulse" />
                        <p className="text-xl text-red-100/90 leading-relaxed font-medium tracking-tight">{w}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 glass rounded-3xl border-emerald-500/20 flex flex-col items-center justify-center text-center h-full">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
                    <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Environment is currently Nominal</p>
                  </div>
                )}
              </div>
            </div>

            {/* Target Landmarks */}
            <div className="space-y-12">
               <div className="flex items-center space-x-4">
                  <Navigation className="w-6 h-6 text-emerald-500" />
                  <h3 className="font-syne font-bold uppercase tracking-[0.4em] text-lg">Strategic Target Landmarks</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {data.intelligence.nearbySpots.map((spot, i) => (
                    <div key={i} className="p-8 bento-card border-white/5 hover:border-emerald-500/20 transition-all group">
                       <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 block group-hover:translate-x-1 transition-transform">{spot.type}</span>
                       <h4 className="text-2xl font-syne font-bold mb-3">{spot.name}</h4>
                       <p className="text-white/40 leading-relaxed font-medium">{spot.description}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Intelligence Footer */}
            <div className="pt-24 pb-12 border-t border-white/5 text-center">
              <p className="text-white/20 text-[11px] uppercase font-black tracking-[0.6em] mb-10">Conclusion of Briefing</p>
              <p className="text-2xl md:text-3xl text-white/50 leading-relaxed italic font-serif max-w-4xl mx-auto">
                "{data.description}"
              </p>
              <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-6">
                <button onClick={onClose} className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 shadow-2xl">
                  Acknowledge & Close
                </button>
                <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                  Hash Verification: {Math.random().toString(36).substring(7).toUpperCase()}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelBriefing;
