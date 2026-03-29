import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, BarChart3, ArrowRight, Eye, Target, BookOpen, Brain } from 'lucide-react';

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-7 h-7" />,
      title: "Bloom's Taxonomy Mapping",
      description: "Automated identification and mapping of questions to appropriate Bloom's cognitive levels.",
      color: 'from-blue-500 to-cyan-500',
      border: 'border-blue-500/30',
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: 'Course Outcome Analysis',
      description: 'Precise correlation between questions and Course Outcomes (COs) for engineering curricula.',
      color: 'from-purple-500 to-pink-500',
      border: 'border-purple-500/30',
    },
    {
      icon: <BookOpen className="w-7 h-7" />,
      title: 'Module Coverage',
      description: 'Comprehensive analysis of curriculum module weightage and balanced content distribution.',
      color: 'from-teal-500 to-emerald-500',
      border: 'border-teal-500/30',
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: 'Difficulty Assessment',
      description: 'Systematic evaluation of question difficulty levels to ensure balanced assessment.',
      color: 'from-orange-500 to-amber-500',
      border: 'border-orange-500/30',
    },
  ];

  const whyItems = [
    {
      title: 'Outcome-Based Education (OBE) Compliance',
      description: 'Perfect alignment with OBE principles, ensuring systematic CO mapping and assessment criteria.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Rule-Based Evaluation',
      description: 'Standalone system with customizable criteria, eliminating human bias in question paper assessment.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Engineering Domain Focus',
      description: 'Specifically designed for engineering curricula with comprehensive module coverage analysis.',
      color: 'from-teal-500 to-emerald-500',
    },
  ];

  const stats = [
    { value: '100%', label: 'CO Mapping Accuracy' },
  ];

  // Function to check user authentication status
  const checkUserAuth = () => {
    const token = sessionStorage.getItem('accessToken');
    const userData = sessionStorage.getItem('user');
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return parsedUser;
      } catch {
        // Clear invalid data
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('user');
        setUser(null);
        return null;
      }
    } else {
      setUser(null);
      return null;
    }
  };

  // Check for existing user session on component mount
  useEffect(() => { checkUserAuth(); }, []);

  // Listen for storage changes (when user logs in/out in another tab/component)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Listen for storage events
      if (e.key === 'accessToken' || e.key === 'user') checkUserAuth();
    };
    window.addEventListener('storage', handleStorageChange);
    // Also listen for a custom event that we can dispatch when login state changes
    window.addEventListener('authStateChanged', checkUserAuth);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', checkUserAuth);
    };
  }, []);

  // Alternative: Poll for changes every few seconds (less efficient but more reliable)
  useEffect(() => {
    const interval = setInterval(() => {
      // Check if auth state has changed
      const currentToken = sessionStorage.getItem('accessToken');
      if ((!currentToken && user) || (currentToken && !user)) checkUserAuth();
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleAnalyzeClick = () => {
    // Double-check user state before proceeding
    const currentUser = checkUserAuth();
    if (!currentUser) { 
      // Handle demo functionality - always accessible
      alert('Please log in to access the analyze feature'); 
      return; 
    }
    // Navigate to upload page or handle feature access
    navigate('/upload');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-widest mb-8">
            <span>🎓</span> OBE-Compliant Quality Analysis
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Automated{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Question Paper
            </span>
            <br />Quality Analysis
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Ensure academic excellence with our rule-based system for engineering examination analysis.
            Get systematic evaluation of difficulty levels, CO mapping, and Bloom's taxonomy alignment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleAnalyzeClick}
              disabled={!user}
              className={`group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-2xl shadow-blue-500/25 transition-all duration-200 flex items-center gap-2
                ${user ? 'hover:scale-105 hover:shadow-blue-500/40' : 'opacity-50 cursor-not-allowed'}`}
            >
              Analyze Question Paper
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="border border-gray-700 text-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800/60 hover:border-gray-600 transition-all flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap justify-center gap-6 mt-16">
            {stats.map((s, i) => (
              <div key={i} className="bg-gray-800/60 border border-gray-700/50 rounded-2xl px-8 py-4 text-center">
                <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-gray-400 text-sm mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase tracking-widest mb-5">
              ✨ Core Capabilities
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-4">Comprehensive Quality Analysis</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Systematic evaluation ensuring your engineering question papers meet OBE standards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative bg-gray-900/70 border ${feature.border} rounded-2xl p-6 transition-all duration-300 group
                  ${activeFeature === index ? 'scale-105 shadow-xl' : 'hover:scale-105 hover:shadow-xl'}`}
              >
                {/* Top gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r ${feature.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold text-base mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>

                {/* Active dot indicator */}
                {activeFeature === index && (
                  <div className={`absolute bottom-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} animate-pulse`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT / WHY ── */}
      <section id="about" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-semibold uppercase tracking-widest mb-6">
                🎯 Why QMetric
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-8">Why Choose Our Quality Analysis System?</h2>
              <div className="space-y-6">
                {whyItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-gray-900/50 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                    <div className={`mt-0.5 w-6 h-6 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl" />
              <div className="relative bg-gray-900/80 border border-gray-700/50 rounded-3xl p-10 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-widest">
                    📊 By the Numbers
                  </div>
                </div>
                <div className="space-y-6">
                  {stats.map((s, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-purple-500/50" />
                      <div className="text-center px-4">
                        <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{s.value}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-l from-blue-500/50 to-purple-500/50" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 p-14 text-center shadow-2xl">
            {/* Background glows inside card */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Ensure Quality Excellence?</h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                Join engineering institutions that trust our systematic approach to question paper quality analysis
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleAnalyzeClick}
                  disabled={!user}
                  className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-2xl shadow-blue-500/25 transition-all
                    ${user ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
                >
                  Upload Question Paper
                </button>
                <button className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800/60 hover:border-gray-500 transition-all">
                  View Sample Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
