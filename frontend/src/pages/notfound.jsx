import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-purple-900 via-gray-900 to-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-700" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0" 
             style={{
               backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }} />
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="space-y-6">
          {/* Glitch effect number */}
          <h1 className="text-9xl font-bold text-white relative inline-block">
            <span className="absolute inset-0 text-red-500 animate-pulse">404</span>
            <span className="relative">404</span>
          </h1>

          {/* Main content */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Page Not Found</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Looks like you've ventured into unknown territory. 
              This dimension doesn't exist... yet.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10 group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Return Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Go Back
            </button>
          </div>
        </div>

        {/* Decorative lines */}
        <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </div>
    </div>
  );
};

export default NotFound;