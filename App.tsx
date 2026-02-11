import React, { useState, useEffect } from 'react';
import { UserProfile, CityData, SearchResult } from './types';
import Onboarding from './components/Onboarding';
import CommandCenter from './components/CommandCenter';
import BentoGrid from './components/BentoGrid';
import IntelBriefing from './components/IntelBriefing';
import About from './components/About';
import Contact from './components/Contact';
import { fetchWeather, fetchWikipediaSummary, generateIntelligenceWithAI, fetchCityImages } from './services/apiService';
import { Home, Compass, User, Info, Send, Shield, Activity, Globe } from 'lucide-react';

const LoadingScreen: React.FC<{ cityName: string }> = ({ cityName }) => {
  const [step, setStep] = useState(0);
  const steps = [
    "Searching the globe...",
    "Finding the best spots...",
    "Personalizing your guide...",
    "Finalizing your trip insights..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#050505] flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]" />
        <div className="h-full w-full opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '30px 30px' }} />
      </div>
      
      <div className="relative mb-16">
        <div className="w-32 h-32 border border-blue-500/20 rounded-full animate-[ping_3s_infinite]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <Globe className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="text-center space-y-8 max-w-sm w-full relative z-10">
        <div className="space-y-2">
          <h2 className="text-white font-syne font-bold text-3xl tracking-tighter uppercase italic">{cityName}</h2>
          <div className="flex items-center justify-center space-x-2 text-blue-400 font-mono text-[10px] uppercase tracking-[0.4em]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>{steps[step]}</span>
          </div>
        </div>
        
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-blue-500 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(59,130,246,0.8)]" 
            style={{ width: `${((step + 1) / steps.length) * 100}%` }} 
          />
        </div>
        
        <div className="flex flex-col items-center space-y-1 opacity-20">
          <p className="text-white text-[9px] font-black uppercase tracking-[0.5em]">
            Curating Personal Travel Insights
          </p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dash' | 'about' | 'contact'>('dash');
  const [loading, setLoading] = useState(false);
  const [loadingCity, setLoadingCity] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('sentry_profile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const handleOnboarding = (p: UserProfile) => {
    localStorage.setItem('sentry_profile', JSON.stringify(p));
    setProfile(p);
  };

  const handleSelectCity = async (res: SearchResult) => {
    if (!profile) return;
    const cityName = res.address.city || res.address.town || res.display_name.split(',')[0];
    setLoadingCity(cityName);
    setLoading(true);
    
    try {
      const lat = parseFloat(res.lat);
      const lon = parseFloat(res.lon);
      const country = res.address.country;

      const [temp, summary, imageUrls] = await Promise.all([
        fetchWeather(lat, lon),
        fetchWikipediaSummary(cityName),
        fetchCityImages(cityName)
      ]);
      
      const intel = await generateIntelligenceWithAI(cityName, country, temp, profile);
      
      const cityData: CityData = {
        name: cityName,
        country,
        lat,
        lon,
        temp,
        description: summary,
        imageUrls,
        compatibilityScore: Math.floor(Math.random() * 20) + 75 - (intel.warnings.length * 5),
        intelligence: intel
      };
      
      setSelectedCity(cityData);
      setActiveTab('dash');
      setIsBriefingOpen(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <Onboarding onComplete={handleOnboarding} />;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050505] flex flex-col font-sans">
      {loading && <LoadingScreen cityName={loadingCity} />}

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
      </div>

      <CommandCenter onSelect={handleSelectCity} />

      <main className="flex-1 w-full relative overflow-hidden mt-20">
        <div className={`h-full w-full absolute inset-0 transition-all duration-700 ease-in-out transform ${activeTab === 'dash' ? 'opacity-100 translate-y-0 scale-100 z-10' : 'opacity-0 translate-y-10 scale-95 z-0 pointer-events-none'}`}>
          <BentoGrid city={selectedCity} user={profile} />
        </div>

        <div className={`h-full w-full absolute inset-0 transition-all duration-700 ease-in-out transform ${activeTab === 'about' ? 'opacity-100 translate-y-0 scale-100 z-10' : 'opacity-0 translate-y-10 scale-95 z-0 pointer-events-none'}`}>
           <About />
        </div>

        <div className={`h-full w-full absolute inset-0 transition-all duration-700 ease-in-out transform ${activeTab === 'contact' ? 'opacity-100 translate-y-0 scale-100 z-10' : 'opacity-0 translate-y-10 scale-95 z-0 pointer-events-none'}`}>
           <Contact />
        </div>
      </main>

      <IntelBriefing 
        isOpen={isBriefingOpen} 
        onClose={() => setIsBriefingOpen(false)} 
        data={selectedCity} 
      />

      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[500] flex items-center p-2 glass rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10 backdrop-blur-[50px]">
        <button 
          onClick={() => setActiveTab('dash')}
          className={`p-4 rounded-full transition-all flex items-center space-x-3 group ${activeTab === 'dash' ? 'bg-white text-black shadow-2xl px-6' : 'hover:bg-white/10 text-white/40'}`}
        >
          <Home className="w-5 h-5" />
          {activeTab === 'dash' && <span className="text-[10px] font-black uppercase tracking-[0.3em] font-syne text-inherit">HOME</span>}
        </button>
        <button 
          onClick={() => setActiveTab('about')}
          className={`p-4 rounded-full transition-all flex items-center space-x-3 group ${activeTab === 'about' ? 'bg-white text-black shadow-2xl px-6' : 'hover:bg-white/10 text-white/40'}`}
        >
          <Info className="w-5 h-5" />
          {activeTab === 'about' && <span className="text-[10px] font-black uppercase tracking-[0.3em] font-syne text-inherit">INFO</span>}
        </button>
        <button 
          onClick={() => setActiveTab('contact')}
          className={`p-4 rounded-full transition-all flex items-center space-x-3 group ${activeTab === 'contact' ? 'bg-white text-black shadow-2xl px-6' : 'hover:bg-white/10 text-white/40'}`}
        >
          <Send className="w-5 h-5" />
          {activeTab === 'contact' && <span className="text-[10px] font-black uppercase tracking-[0.3em] font-syne text-inherit">CONTACT</span>}
        </button>
        <div className="w-[1px] h-8 bg-white/10 mx-2" />
        <button 
          onClick={() => selectedCity && setIsBriefingOpen(true)}
          className={`p-4 rounded-full hover:bg-white/10 text-white/40 transition-all active:scale-90 ${!selectedCity && 'opacity-20 cursor-not-allowed'}`}
          title="Guide"
        >
          <Compass className="w-5 h-5" />
        </button>
        <button 
          onClick={() => { localStorage.removeItem('sentry_profile'); window.location.reload(); }}
          className="p-4 rounded-full hover:bg-white/10 text-white/40 transition-all active:scale-90"
          title="Exit Session"
        >
          <User className="w-5 h-5" />
        </button>
      </div>

      <div className="h-10 px-10 flex justify-between items-center bg-[#050505] border-t border-white/5 text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] z-40">
        <div className="flex items-center space-x-8">
          <span className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 animate-pulse" /> SYSTEM READY</span>
          <span className="hidden lg:inline text-white/10 font-mono">ENCRYPTED DATA FEED</span>
        </div>
        <div className="hidden sm:block text-white/20 uppercase tracking-[0.2em]">
          SENTRY TRAVEL // v3.1.0
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;