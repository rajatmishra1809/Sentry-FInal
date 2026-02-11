import React, { useState } from 'react';
import { Send, CheckCircle2, AlertTriangle, Mail, Instagram, Github } from 'lucide-react';

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('SENDING');
    
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xqedznwo", {
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
    <div className="h-full w-full overflow-y-auto pb-40 px-6 pt-10 smooth-scroll overscroll-behavior-contain">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-blue-500 mb-4">Get In Touch</h2>
          <h1 className="text-5xl font-syne font-bold tracking-tighter text-white">Contact Us</h1>
          <p className="text-white/40 mt-4 text-sm">Have feedback, want a new feature, or just want to say hi? Reach out below.</p>
        </div>

        {status === 'SUCCESS' ? (
          <div className="glass p-12 rounded-[40px] text-center space-y-6 border-emerald-500/20">
            <div className="p-5 bg-emerald-500/10 rounded-full w-fit mx-auto">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-syne font-bold">Message Sent!</h3>
            <p className="text-white/40">Thanks for reaching out. We'll get back to you soon.</p>
            <button 
              onClick={() => setStatus('IDLE')}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase transition-all"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass p-10 md:p-14 rounded-[40px] space-y-8 border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Your Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Your Email</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Your Message</label>
              <textarea 
                name="message" 
                required 
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm transition-all resize-none"
                placeholder="What's on your mind?"
              />
            </div>

            {status === 'ERROR' && (
              <div className="flex items-center space-x-3 text-red-400 bg-red-400/10 p-4 rounded-2xl border border-red-400/20 text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Something went wrong. Please try again.</span>
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
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <a href="mailto:rajatmishra1809@gmail.com" className="flex items-center space-x-2 text-[8px] text-white/20 uppercase font-bold tracking-widest hover:text-white transition-colors">
                  <Mail className="w-3 h-3" />
                  <span>Email Rajat</span>
              </a>
              <a href="https://github.com/rajatmishra1809" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-[8px] text-white/20 uppercase font-bold tracking-widest hover:text-white transition-colors">
                  <Github className="w-3 h-3" />
                  <span>GitHub</span>
              </a>
              <a href="https://www.instagram.com/18rajatmishra/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-[8px] text-white/20 uppercase font-bold tracking-widest hover:text-white transition-colors">
                  <Instagram className="w-3 h-3" />
                  <span>Insta @Rajat</span>
              </a>
              <a href="https://www.instagram.com/arav_bansal174/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-[8px] text-white/20 uppercase font-bold tracking-widest hover:text-white transition-colors">
                  <Instagram className="w-3 h-3" />
                  <span>Insta @Arav</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;