import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { fetchLocation } from '../services/apiService';
import { SearchResult } from '../types';

interface CommandCenterProps {
  onSelect: (result: SearchResult) => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Local cache for the current session to make backspacing instant
  const localCache = useRef<Record<string, SearchResult[]>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const q = query.toLowerCase().trim();
    if (q.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    if (localCache.current[q]) {
      setResults(localCache.current[q]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(async () => {
      const data = await fetchLocation(query);
      localCache.current[q] = data;
      setResults(data);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className={`fixed inset-x-0 top-0 flex justify-center p-6 z-[200] transition-all duration-500 ${isOpen ? 'translate-y-4' : '-translate-y-2'}`}>
      <div className="max-w-2xl w-full">
        <div className={`glass rounded-[24px] overflow-hidden shadow-2xl transition-all duration-300 ${isOpen ? 'ring-2 ring-blue-500/20' : ''}`}>
          <div className="flex items-center px-6 py-4">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-blue-500 mr-4 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-white/40 mr-4" />
            )}
            <input 
              ref={inputRef}
              className="bg-transparent border-none outline-none flex-1 text-lg font-medium placeholder:text-white/20 text-white"
              placeholder="Search Destination... (Cmd + K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-4 h-4 text-white/40" />
              </button>
            )}
          </div>

          {isOpen && (results.length > 0 || isLoading) && (
            <div className="border-t border-white/5 p-2 space-y-1 max-h-[400px] overflow-y-auto smooth-scroll">
              {isLoading && results.length === 0 && (
                <div className="p-8 text-center text-white/20 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
                  Querying Global Archives...
                </div>
              )}
              {results.map((res, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    onSelect(res);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="w-full flex items-center p-4 hover:bg-white/5 rounded-2xl transition-all text-left group"
                >
                  <div className="bg-white/5 p-3 rounded-xl mr-4 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 truncate">
                    <h4 className="font-semibold text-white/90 truncate">{res.display_name.split(',')[0]}</h4>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest truncate">{res.display_name.split(',').slice(1).join(',').trim()}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;