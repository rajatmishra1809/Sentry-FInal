
import React, { useState } from 'react';
import { Send, CheckCircle2, AlertTriangle, Mail, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('SENDING');
    
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mpwqglge", {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('SUCCESS');
        form.reset();
      } else {
        setStatus('ERROR');
      }
    } catch (error) {
      setStatus('ERROR');
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto pb-40 px-6 pt-10 scrollbar-hide">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-blue-500 mb-4">Transmission Channel</h2>
          <h1 className="text-5xl font-syne font-bold tracking-tighter text-white">Contact Command</h1>
          <p className="text-white/40 mt-4 text-sm">Need a custom feature? Report a bug? Or just want to talk mission strategy?</p>
        </div>

        {status === 'SUCCESS' ? (
          <div className="glass p-12 rounded-[40px] text-center space-y-6 border-emerald-500/20">
            <div className="p-5 bg-emerald-500/10 rounded-full w-fit mx-auto">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-syne font-bold">Message Received</h3>
            <p className="text-white/40">Our intelligence officers will respond to your uplink shortly.</p>
            <button 
              onClick={() => setStatus('IDLE')}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase transition-all"
            >
              Send Another transmission
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass p-10 md:p-14 rounded-[40px] space-y-8 border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Agent Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Return Email</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm transition-all"
                  placeholder="agent@sentry.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Intelligence Report (Message)</label>
              <textarea 
                name="message" 
                required 
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm transition-all resize-none"
                placeholder="Details of your uplink request..."
              />
            </div>

            {status === 'ERROR' && (
              <div className="flex items-center space-x-3 text-red-400 bg-red-400/10 p-4 rounded-2xl border border-red-400/20 text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Transmission failed. Check network status and retry.</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={status === 'SENDING'}
              className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 flex items-center justify-center space-x-3 text-sm tracking-widest uppercase"
            >
              {status === 'SENDING' ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Uplink Transmission</span>
                </>
              )}
            </button>
            
            <div className="flex justify-center space-x-8 pt-4">
               <div className="flex items-center space-x-2 text-[10px] text-white/20 uppercase font-bold tracking-widest">
                  <Mail className="w-3 h-3" />
                  <span>Direct: intel@sentry.io</span>
               </div>
               <div className="flex items-center space-x-2 text-[10px] text-white/20 uppercase font-bold tracking-widest">
                  <MessageSquare className="w-3 h-3" />
                  <span>Signal: @sentry_ops</span>
               </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
