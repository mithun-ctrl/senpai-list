import React from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ChevronRight, Star, Calendar, ThumbsUp, TrendingUp, Trophy, Flame } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import goku from '../videos/goku.webm';

const HomePage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Top Anime",
      description: "Explore legendary anime series that have captivated millions. Discover timeless classics and modern masterpieces.",
      icon: <Trophy className="w-8 h-8" />,
      secondaryIcon: <Star className="w-6 h-6" />,
      path: "anime/top-anime",
      stats: [
        { label: "Rated Series", value: "1000+" },
        { label: "Active Users", value: "100K" }
      ],
      gradient: "from-yellow-600 via-orange-500 to-red-600",
      bgPattern: "radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)"
    },
    {
      title: "Recommendations",
      description: "Get personalized anime suggestions based on your taste. Never miss another series you might love.",
      icon: <Flame className="w-8 h-8" />,
      secondaryIcon: <ThumbsUp className="w-6 h-6" />,
      path: "anime/recommendations",
      stats: [
        { label: "Accuracy Rate", value: "95%" },
        { label: "Monthly Picks", value: "50+" }
      ],
      gradient: "from-purple-600 via-pink-500 to-red-600",
      bgPattern: "radial-gradient(circle at 50% 50%, rgba(167, 139, 250, 0.1) 0%, transparent 50%)"
    },
    {
      title: "Upcoming Anime",
      description: "Stay ahead with upcoming releases. Track premiere dates and be the first to watch new series.",
      icon: <TrendingUp className="w-8 h-8" />,
      secondaryIcon: <Calendar className="w-6 h-6" />,
      path: "anime/upcoming",
      stats: [
        { label: "Coming Soon", value: "200+" },
        { label: "This Season", value: "50+" }
      ],
      gradient: "from-cyan-600 via-blue-500 to-purple-600",
      bgPattern: "radial-gradient(circle at 50% 50%, rgba(103, 232, 249, 0.1) 0%, transparent 50%)"
    }
  ];

  return (
    <>
      {/* Video Background with Enhanced Overlay */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-red-900/60" />
        <div className="absolute inset-0 backdrop-blur-none" />
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

      {/* Main Content */}
      <div className="min-h-screen w-full flex flex-col py-12">
        {/* Hero Section with Enhanced Animation */}
        <div className="relative mx-auto z-20 text-center px-4 space-y-8 max-w-5xl">
          <div className="space-y-6 animate-fadeIn">
            <h1 className="text-7xl md:text-8xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-300 text-transparent bg-clip-text">
                先生 リスト
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your ultimate companion for discovering, tracking, and exploring the vast universe of anime, movies and series
            </p>
          </div>

          {/* Enhanced My List Button */}
          <div className="pt-10 relative group">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] border border-red-500/30 rounded-full animate-spin-slow" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+2rem)] h-[calc(100%+2rem)] border border-red-500/20 rounded-full animate-spin-reverse" />
            
            <button
              onClick={() => navigate('/list')}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-red-800/30 hover:bg-red-700/40 text-white text-lg font-medium rounded-lg transition-all duration-300 overflow-hidden border border-red-600/30 hover:border-red-500/50 backdrop-blur-sm"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600/0 via-red-600/30 to-red-600/0 opacity-0 group-hover:animate-shine" />
              <List className="w-6 h-6 transition-transform group-hover:scale-110" />
              View My List
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Enhanced Section Cards */}
        <div className="container mx-auto px-4 mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections.map((section) => (
              <Card 
                key={section.title}
                onClick={() => navigate(section.path)}
                className="group relative bg-gray-800/40 hover:bg-gray-800/60 border-gray-700/50 hover:border-gray-600 cursor-pointer transition-all duration-500 backdrop-blur-none"
                style={{ background: section.bgPattern }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-10`} />
                </div>
                
                <CardContent className="p-8 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${section.gradient}`}>
                      {section.icon}
                    </div>
                    <div className="p-2 rounded-full bg-gray-700/30 group-hover:bg-gray-700/50 transition-colors duration-300">
                      {section.secondaryIcon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                      {section.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed min-h-[80px]">
                      {section.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-700/50">
                    {section.stats.map((stat) => (
                      <div key={stat.label} className="space-y-1">
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Action */}
                  <div className="flex items-center text-gray-300 group/link pt-2">
                    <span className="text-sm font-medium">Explore Now</span>
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-red-500/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </>
  );
};

export default HomePage;