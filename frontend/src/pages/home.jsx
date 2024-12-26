import React from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ChevronRight } from 'lucide-react';
import goku from '../../public/goku.mp4'

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Full viewport video background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 to-red-900/90" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-screen object-cover"
          poster="/api/placeholder/1920/1080"
        >
          <source src={goku} type="video/webm" />
        </video>
      </div>

      {/* Main content */}
      <div className="min-h-screen w-full flex py-20">
        <div className="relative mx-auto z-20 text-center px-2 space-y-8 py-20">
          {/* Main Title */}
          <div className="space-y-4 animate-slideIn">
            <h1 className="text-6xl md:text-8xl font-bold">
              <span className="bg-gradient-to-r from-red-500 to-red-300 text-transparent bg-clip-text">
              先生 リスト
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Your personal gateway to tracking anime and manga across dimensions
            </p>
          </div>

          {/* Button with combined effects */}
          <div className="pt-8 relative group">
            {/* Spinning background circles */}
            <div className="absolute left-1/2 top-1/2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] border border-red-500/30 rounded-full animate-spin-slow" />
            <div className="absolute left-1/2 top-1/2 w-[calc(100%+2rem)] h-[calc(100%+2rem)] border border-red-500/20 rounded-full animate-spin-reverse" />
            
            <button
              onClick={() => navigate('/list')}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-red-800/30 hover:bg-red-700/40 text-white text-lg font-medium rounded-lg transition-all duration-300 overflow-hidden border border-red-600/30 hover:border-red-500/50"
            >
              {/* Shine effect overlay */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600/0 via-red-600/30 to-red-600/0 opacity-0 group-hover:animate-shine" />
              
              <List className="w-5 h-5 transition-transform group-hover:scale-110" />
              View My List
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-500/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}

          {/* Additional floating elements */}
          <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-red-400/20 rounded-full animate-float" 
               style={{ animationDelay: '0.2s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-red-400/20 rounded-full animate-float"
               style={{ animationDelay: '0.7s' }} />
        </div>
      </div>
    </>
  );
};

export default HomePage;