import React, { useState } from 'react';
import axios from 'axios';
import { ArrowRight, Heart, Home, Loader2, Trash2, Eye, Smile } from 'lucide-react';

const EMOJIS = ['😂', '🤣', '💀', '🤡', '🤪', '🤭', '🤐', '😹', '👀', '✨'];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [joke, setJoke] = useState(null);
  const [currentEmoji, setCurrentEmoji] = useState('😂');
  const [showPunchline, setShowPunchline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    setJoke(null);
    setShowPunchline(false);

    try {
      const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
      if (!response.data || !response.data.setup) throw new Error('Invalid data');
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setJoke(response.data);
      setCurrentEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    } catch (err) {
      setError('Failed to load. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = () => {
    if (joke && !favorites.find(f => f.id === joke.id)) {
      setFavorites([...favorites, { ...joke, emoji: currentEmoji }]);
    }
  };

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  const HomePage = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full text-center px-6 animate-fade-in relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white rounded-full blur-[80px] opacity-60 pointer-events-none"></div>

      <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-8 border border-gray-50">
        <Smile strokeWidth={1.5} size={40} className="text-[#2c2c2c]" />
      </div>

      <h1 className="relative z-10 text-4xl md:text-5xl font-extrabold mb-4 text-[#1a1b2e] tracking-tight">
        Need a laugh?
      </h1>

      <p className="relative z-10 text-lg text-gray-500 max-w-md mb-10 leading-relaxed">
        Discover random jokes to brighten your day. Simple, fast, and occasionally funny.
      </p>

      <button
        onClick={() => {
          setCurrentPage('joke');
          fetchJoke();
        }}
        className="relative z-10 bg-[#58508d] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-transform hover:-translate-y-1 hover:shadow-lg active:scale-95"
      >
        Get Started <ArrowRight size={18} />
      </button>
    </div>
  );

  const JokePage = () => {
    const isSaved = joke && favorites.some(f => f.id === joke.id);

    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center pt-8 pb-10">
        <div className="w-full flex justify-start mb-8 px-2">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-gray-400 font-bold hover:text-[#58508d] flex items-center gap-2 transition-colors uppercase text-xs tracking-widest"
          >
            <Home size={14} /> Back Home
          </button>
        </div>

        <div className="w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 text-center min-h-[420px] flex flex-col items-center justify-center mb-6 relative overflow-hidden transition-all duration-300">
          
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-[#58508d]" size={40} />
              <span className="font-bold text-gray-300 tracking-widest text-xs uppercase">Fetching joke...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 animate-fade-in">
              <p className="text-red-500 font-medium">{error}</p>
              <button onClick={fetchJoke} className="bg-gray-100 px-6 py-2 rounded-lg font-bold text-gray-700 hover:bg-gray-200">
                Try Again
              </button>
            </div>
          ) : joke ? (
            <div className="w-full flex flex-col items-center animate-slide-up">
              <div className="text-5xl mb-6 filter drop-shadow-sm animate-bounce-slow">
                {currentEmoji}
              </div>

              <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-[0.2em] mb-4">
                The Setup
              </span>

              <h2 className="text-2xl md:text-3xl font-bold text-[#1a1b2e] mb-10 leading-snug">
                "{joke.setup}"
              </h2>

              {showPunchline ? (
                <div className="animate-zoom-in w-full">
                  <div className="w-full h-px bg-gray-100 mb-8"></div>
                  <span className="text-[10px] font-extrabold text-[#58508d] uppercase tracking-[0.2em] mb-2 block">
                    The Punchline
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-[#58508d]">{joke.punchline}</h3>
                </div>
              ) : (
                <button
                  onClick={() => setShowPunchline(true)}
                  className="group border-2 border-dashed border-gray-200 px-8 py-3 rounded-full font-bold text-xs tracking-widest uppercase text-gray-400 hover:border-[#58508d] hover:text-[#58508d] hover:bg-purple-50 transition-all flex items-center gap-2"
                >
                  <Eye size={14} className="group-hover:scale-110 transition-transform" /> Reveal Answer
                </button>
              )}
            </div>
          ) : null}
        </div>

        {!loading && joke && (
          <div className="grid grid-cols-3 gap-4 w-full mb-12 animate-fade-in">
            <button
              className={`col-span-1 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border ${
                isSaved 
                  ? 'bg-red-50 border-red-100 text-red-500' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
              } ${!showPunchline && 'opacity-50 cursor-not-allowed'}`}
              onClick={addToFavorites}
              disabled={!showPunchline}
            >
              <Heart
                size={20}
                fill={isSaved ? 'currentColor' : 'none'}
                className={isSaved ? 'text-red-500' : 'text-gray-400'}
              />
              <span className="hidden md:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              className="col-span-2 h-14 bg-[#58508d] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
              onClick={fetchJoke}
            >
              Next Joke <ArrowRight size={20} />
            </button>
          </div>
        )}

        {favorites.length > 0 && (
          <div className="w-full animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saved Collection</h3>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="flex flex-col gap-3">
              {favorites.map(fav => (
                <div
                  key={fav.id}
                  className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-4 hover:border-purple-100 hover:shadow-md transition-all group"
                >
                  <div className="text-2xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0">
                    {fav.emoji}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="font-bold text-gray-800 text-sm mb-1 leading-tight">{fav.setup}</p>
                    <p className="text-sm text-[#58508d] font-semibold">{fav.punchline}</p>
                  </div>
                  <button
                    onClick={() => removeFromFavorites(fav.id)}
                    className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap');
        
        body {
          font-family: 'Figtree', sans-serif;
          background-color: #f8f9fd;
          color: #1a1b2e;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes bounceSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
        .animate-zoom-in { animation: zoomIn 0.3s ease-out forwards; }
        .animate-bounce-slow { animation: bounceSlow 3s infinite ease-in-out; }
      `}</style>

      <div className="min-h-screen w-full bg-[#f8f9fd] font-sans flex flex-col py-6 px-4 overflow-x-hidden">
        {currentPage === 'home' ? <HomePage /> : <JokePage />}
      </div>
    </>
  );
}