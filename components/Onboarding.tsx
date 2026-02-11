import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Globe, ArrowRight, User, Heart, Lock } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<UserProfile['gender']>('Male');
  const [religion, setReligion] = useState('Secular / None');
  const [error, setError] = useState<string | null>(null);

  const majorReligions = [
    "Secular / None",
    "Christianity",
    "Islam",
    "Hinduism",
    "Buddhism",
    "Sikhism",
    "Judaism",
    "Jainism",
    "Shinto",
    "Baha'i",
    "Other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name to get started.");
      return;
    }
    onComplete({ name: name.trim(), gender, religion });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] font-sans overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]" />
        <div className="h-full w-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-xl w-full px-6 animate-fade-in relative z-10">
        <div className="bento-card p-10 md:p-16 border-white/10 glass shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl -mr-32 -mt-32 group-hover:bg-blue-500/10 transition-all duration-700" />
          
          <div className="mb-12">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
            </div>
            <h1 className="text-5xl font-syne font-bold tracking-tighter text-white mb-3">SENTRY</h1>
            <p className="text-white/30 text-xs font-bold uppercase tracking-[0.4em]">Personal Travel Concierge</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 pl-8 py-3 focus:border-blue-500 focus:outline-none transition-all text-white font-medium placeholder:text-white/10"
                    placeholder="Enter Your Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Gender</label>
                  <div className="relative">
                    <Globe className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value as UserProfile['gender'])}
                      className="w-full bg-transparent border-b border-white/10 pl-8 py-3 focus:border-blue-500 focus:outline-none transition-all text-white font-bold uppercase tracking-widest text-[10px] appearance-none cursor-pointer"
                    >
                      <option value="Male" className="bg-[#050505]">Male</option>
                      <option value="Female" className="bg-[#050505]">Female</option>
                      <option value="Non-binary" className="bg-[#050505]">Non-binary</option>
                      <option value="Other" className="bg-[#050505]">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Religion / Belief</label>
                  <div className="relative">
                    <Heart className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <select 
                      value={religion}
                      onChange={(e) => setReligion(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 pl-8 py-3 focus:border-blue-500 focus:outline-none transition-all text-white font-bold uppercase tracking-widest text-[10px] appearance-none cursor-pointer"
                    >
                      {majorReligions.map((r) => (
                        <option key={r} value={r} className="bg-[#050505]">{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-[10px] text-red-500 font-black uppercase tracking-widest flex items-center animate-pulse">
                <Lock className="w-3 h-3 mr-2" /> {error}
              </p>
            )}

            <button 
              type="submit"
              className="group relative flex items-center justify-center w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-blue-500 hover:text-white transition-all transform active:scale-[0.98] shadow-2xl"
            >
              <span>Start Exploring</span>
              <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center opacity-30">
            <span className="text-[9px] font-mono tracking-widest uppercase">Version 3.1 // 2025</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 rounded-full bg-white" />
              <div className="w-1 h-1 rounded-full bg-white/40" />
              <div className="w-1 h-1 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;