
import React from 'react';
import { X, ShieldAlert, Thermometer, User, Compass, Zap, MapPin, CheckCircle2, Info } from 'lucide-react';
import { CityData } from '../types';

interface IntelDrawerProps {
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

const IntelDrawer: React.FC<IntelDrawerProps> = ({ data, isOpen, onClose }) => {
  if (!data) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[250] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      {/* Broad Side Panel */}
      <div className={`fixed right-0 top-0 bottom-0 w-full md:w-[60%] lg:w-[50%] max-w-4xl glass z-[300] transition-transform duration-700 ease-in-out shadow-[-50px_0_100px_rgba(0,0,0,0.9)] flex flex-col border-l border-white/15 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-10 md:p-14 border-b border-white/10 flex justify-between items-start bg-white/[0.02]">
          <div>
            <div className="flex items-center space-x-3 text-blue-500 mb-4">
               <div className="p-2 bg-blue-500/10 rounded-lg"><Info className="w-4 h-4" /></div>
               <span className="text-[11px] font-black uppercase tracking-[0.5em]">Classified Briefing</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-syne font-bold tracking-tighter text-white">{data.name}</h2>
            <div className="flex items-center space-x-3 mt-3">
              <p className="text-white/40 uppercase text-xs tracking-[0.2em] font-bold">{data.country}</p>
              <div className="w-1 h-1 bg-white/20 rounded-full" />
              <p className="text-white/20 uppercase text-[10px] tracking-[0.2em] font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-full transition-all group border border-white/5">
            <X className="w-8 h-8 text-white/30 group-hover:text-white group-hover:scale-110" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 md:p-14 space-y-16 scrollbar-hide">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bento-card p-8 flex items-center space-x-6 border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all">
              <div className="p-4 bg-orange-500/10 rounded-2xl"><Thermometer className="text-orange-400 w-8 h-8" /></div>
              <div>
                <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">Environmental Temp</p>
                <p className="text-3xl font-bold font-syne">{data.temp}°C</p>
              </div>
            </div>
            <div className="bento-card p-8 flex items-center space-x-6 border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all">
              <div className="p-4 bg-blue-500/10 rounded-2xl"><Compass className="text-blue-400 w-8 h-8" /></div>
              <div>
                <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">Cultural Synergy</p>
                <p className="text-3xl font-bold font-syne">{data.compatibilityScore}%</p>
              </div>
            </div>
          </div>

          {/* Safety Vectors Section */}
          <div className="bg-white/[0.01] p-10 rounded-[40px] border border-white/5">
            <div className="flex items-center mb-10 space-x-4">
              <ShieldAlert className="w-6 h-6 text-red-500" />
              <h3 className="font-syne font-bold uppercase tracking-[0.4em] text-base text-white/80">Threat Perception Matrix</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-2">
              <ProgressBar label="Political Volatility" value={data.intelligence.safety.political} color="bg-blue-500" />
              <ProgressBar label="Crime Incidence" value={data.intelligence.safety.crime} color="bg-emerald-500" />
              <ProgressBar label="Bio-Health Infrastructure" value={data.intelligence.safety.health} color="bg-cyan-500" />
              <ProgressBar label="Tectonic/Climate Resilience" value={data.intelligence.safety.disaster} color="bg-orange-500" />
            </div>
            <div className="mt-4">
              <ProgressBar label="Social & Minorities Inclusivity" value={data.intelligence.safety.lgbtq} color="bg-purple-500" />
            </div>
          </div>

          {/* Warnings (Broad Layout) */}
          {data.intelligence.warnings.length > 0 && (
            <div className="p-10 bg-red-950/20 border border-red-500/30 rounded-[40px] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><ShieldAlert className="w-32 h-32 text-red-500" /></div>
              <h4 className="text-red-500 text-[11px] font-black uppercase tracking-[0.5em] flex items-center">
                <Zap className="w-4 h-4 mr-4 animate-pulse" /> Critical Field Advisory
              </h4>
              <div className="grid gap-6">
                {data.intelligence.warnings.map((w, i) => (
                  <div key={i} className="flex items-start space-x-6 p-6 bg-red-500/5 rounded-3xl border border-red-500/10">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2.5 shrink-0 shadow-[0_0_12px_rgba(239,68,68,1)]" />
                    <p className="text-lg text-red-100/80 leading-relaxed font-medium tracking-tight">{w}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Protocols Section (Wider Display) */}
          <div className="space-y-12">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 rounded-full"><User className="w-6 h-6 text-green-500" /></div>
              <h3 className="font-syne font-bold uppercase tracking-[0.4em] text-base">Cultural Engagement Protocols</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bento-card p-10 bg-white/[0.02] border-white/10 flex flex-col justify-center">
                <p className="text-white/20 text-[10px] uppercase font-bold tracking-[0.4em] mb-6 flex items-center">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-3" /> Recommended Attire
                </p>
                <p className="text-2xl font-bold font-syne text-white leading-tight">{data.intelligence.clothing}</p>
              </div>
              
              <div className="bento-card p-10 bg-white/[0.02] border-white/10">
                <p className="text-white/20 text-[10px] uppercase font-bold tracking-[0.4em] mb-8 flex items-center">
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-3" /> Social Etiquette
                </p>
                <div className="space-y-6">
                  {data.intelligence.etiquette.map((e, i) => (
                    <div key={i} className="flex items-start space-x-5 group">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mt-1 shrink-0 group-hover:scale-125 transition-all" />
                      <p className="text-base text-white/70 leading-relaxed font-medium">{e}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-20 pb-10 border-t border-white/5 opacity-40 hover:opacity-100 transition-opacity">
             <div className="flex items-center space-x-4 mb-8">
               <MapPin className="w-5 h-5 text-white/20" />
               <p className="text-white/40 text-[11px] uppercase font-black tracking-[0.5em]">Intel Briefing Summary</p>
             </div>
             <p className="text-lg text-white/60 leading-relaxed italic font-serif max-w-2xl">
               "{data.description}"
             </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default IntelDrawer;
