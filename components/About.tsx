import React from 'react';
import { Shield, Zap, Globe, Target, Cpu, Eye, Github, Instagram, UserCircle2 } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="h-full w-full overflow-y-auto pb-40 px-6 pt-10 smooth-scroll overscroll-behavior-contain">
      <div className="max-w-5xl mx-auto space-y-16 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.2)]">
              <Shield className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <h2 className="text-xs font-black uppercase tracking-[0.6em] text-blue-500">Our Story</h2>
          <h1 className="text-6xl md:text-8xl font-syne font-bold tracking-tighter text-white">SENTRY</h1>
          <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed tracking-wide">
            A premium travel companion designed for modern explorers. Get real-time insights, cultural tips, and safety updates for any destination.
          </p>
        </div>

        {/* The Team Section */}
        <div className="space-y-8">
          <div className="flex items-center space-x-4 px-4">
            <UserCircle2 className="w-5 h-5 text-blue-500" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">The Creators</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Developer Card - Updated to 1st Person */}
            <div className="glass p-8 rounded-[40px] border-white/10 hover:border-blue-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Cpu className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-2">Engineering & Design</p>
                <h4 className="text-3xl font-syne font-bold text-white mb-6">Rajat Mishra</h4>
                <p className="text-white/40 text-sm leading-relaxed mb-8">
                  I'm the developer behind the code. I engineered the core engine and designed this interface to make your travel research as smooth, fast, and intuitive as possible.
                </p>
                <div className="flex items-center space-x-4">
                  <a 
                    href="https://github.com/rajatmishra1809" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl transition-all"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://www.instagram.com/18rajatmishra/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl transition-all"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="glass p-8 rounded-[40px] border-white/10 hover:border-purple-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Zap className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <p className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-2">Product Vision</p>
                <h4 className="text-3xl font-syne font-bold text-white mb-6">Arav Bansal</h4>
                <p className="text-white/40 text-sm leading-relaxed mb-8">
                  Setting the direction. Arav pioneered the core idea, ensuring Sentry offers exactly what a traveler needs to feel confident.
                </p>
                <div className="flex items-center space-x-4">
                  <a 
                    href="https://www.instagram.com/arav_bansal174/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl transition-all"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          <div className="md:col-span-2 glass p-10 rounded-[40px] border-white/10 hover:border-blue-500/30 transition-all group">
            <Globe className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-syne font-bold mb-4">Smart Network</h3>
            <p className="text-white/50 leading-relaxed italic">
              Sentry connects to real-time maps, weather, and city data to give you an instant, 360-degree view of your next destination.
            </p>
          </div>
          <div className="glass p-10 rounded-[40px] border-white/10 flex flex-col justify-center text-center">
            <Cpu className="w-8 h-8 text-purple-500 mx-auto mb-4 animate-pulse" />
            <h4 className="text-4xl font-syne font-bold">Live</h4>
            <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mt-2">Always-on Data Feed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-10 rounded-[40px] border-white/10 group">
            <Shield className="w-8 h-8 text-red-500 mb-4 group-hover:rotate-12 transition-transform" />
            <h3 className="text-xl font-syne font-bold mb-2">Safety Focus</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              We analyze security, health, and local conditions so you don't have to.
            </p>
          </div>
          <div className="glass p-10 rounded-[40px] border-white/10 group">
            <Target className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-125 transition-all" />
            <h3 className="text-xl font-syne font-bold mb-2">Personalized</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              Insights tailored specifically to your background and beliefs.
            </p>
          </div>
          <div className="glass p-10 rounded-[40px] border-white/10 group">
            <Eye className="w-8 h-8 text-blue-400 mb-4 group-hover:animate-pulse" />
            <h3 className="text-xl font-syne font-bold mb-2">Privacy</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              We keep it local. Your searches and profile stay on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;