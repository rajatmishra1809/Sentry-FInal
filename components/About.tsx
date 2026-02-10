
import React from 'react';
import { Shield, Zap, Globe, Target, Cpu, Eye } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="h-full w-full overflow-y-auto pb-40 px-6 pt-10 scrollbar-hide">
      <div className="max-w-5xl mx-auto space-y-10 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.6em] text-blue-500">System Protocol: About</h2>
          <h1 className="text-6xl md:text-8xl font-syne font-bold tracking-tighter text-white">SENTRY</h1>
          <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed tracking-wide">
            The world's most advanced autonomous travel intelligence node. Designed for high-stakes exploration and cultural synchronization.
          </p>
        </div>

        {/* Bento Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass p-10 rounded-[40px] border-white/10 hover:border-blue-500/30 transition-all group">
            <Globe className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-syne font-bold mb-4">Global Network</h3>
            <p className="text-white/50 leading-relaxed italic">
              SENTRY leverages a distributed network of real-time geospatial data, weather telemetry, and historical archives to provide a 360-degree view of any destination on Earth.
            </p>
          </div>
          <div className="glass p-10 rounded-[40px] border-white/10 flex flex-col justify-center text-center">
            <Cpu className="w-8 h-8 text-purple-500 mx-auto mb-4 animate-pulse" />
            <h4 className="text-4xl font-syne font-bold">99.8%</h4>
            <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mt-2">Uptime Reliability</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-10 rounded-[40px] border-white/10 group">
            <Shield className="w-8 h-8 text-red-500 mb-4 group-hover:rotate-12 transition-transform" />
            <h3 className="text-xl font-syne font-bold mb-2">Security First</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              Proprietary threat-matrix analysis for every operational sector.
            </p>
          </div>
          <div className="glass p-10 rounded-[40px] border-white/10 group">
            <Target className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-125 transition-all" />
            <h3 className="text-xl font-syne font-bold mb-2">Precision Data</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              Sub-degree accuracy for coordinates and environmental telemetry.
            </p>
          </div>
          <div className="glass p-10 rounded-[40px] border-white/10 group">
            <Eye className="w-8 h-8 text-blue-400 mb-4 group-hover:animate-pulse" />
            <h3 className="text-xl font-syne font-bold mb-2">Zero Tracking</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              Your mission profile remains local. We prioritize privacy above all.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
