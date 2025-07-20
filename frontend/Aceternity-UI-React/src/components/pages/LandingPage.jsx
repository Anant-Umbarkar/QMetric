import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import { CheckCircle, BarChart3, ArrowRight, Eye, Target, BookOpen, Brain } from 'lucide-react';

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Bloom's Taxonomy Mapping",
      description: "Automated identification and mapping of questions to appropriate Bloom's cognitive levels."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Course Outcome Analysis",
      description: "Precise correlation between questions and Course Outcomes (COs) for engineering curricula."
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Module Coverage",
      description: "Comprehensive analysis of curriculum module weightage and balanced content distribution."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Difficulty Assessment",
      description: "Systematic evaluation of question difficulty levels to ensure balanced assessment."
    }
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
      } catch (error) {
        console.error('Error parsing user data:', error);
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
  useEffect(() => {
    checkUserAuth();
  }, []);

  // Listen for storage changes (when user logs in/out in another tab/component)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken' || e.key === 'user') {
        checkUserAuth();
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);

    // Also listen for a custom event that we can dispatch when login state changes
    const handleAuthChange = () => {
      checkUserAuth();
    };

    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  // Alternative: Poll for changes every few seconds (less efficient but more reliable)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = sessionStorage.getItem('accessToken');
      const currentUserData = sessionStorage.getItem('user');
      
      // Check if auth state has changed
      if ((!currentToken && user) || (currentToken && !user)) {
        checkUserAuth();
      } else if (currentToken && currentUserData) {
        try {
          const parsedUser = JSON.parse(currentUserData);
          if (JSON.stringify(parsedUser) !== JSON.stringify(user)) {
            checkUserAuth();
          }
        } catch (error) {
          // Handle parsing error
          checkUserAuth();
        }
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [user]);

  const handleAnalyzeClick = () => {
    // Double-check user state before proceeding
    const currentUser = checkUserAuth();
    if (!currentUser) {
      alert('Please log in to access the analyze feature'); // Replace with proper modal
      return;
    }
    navigate('/upload');
    console.log('Accessing Upload/Analyze feature');
    // Navigate to upload page or handle feature access
  };

  const handleWatchDemo = () => {
    console.log('Opening demo');
    // Handle demo functionality - always accessible
  };

  const handleViewSampleReport = () => {
    console.log('Viewing sample report');
    // Handle sample report functionality - always accessible
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 animate-fade-in">
              Automated
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Question Paper</span>
              <br />Quality Analysis
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Ensure academic excellence with our rule-based system for engineering examination analysis.
              Get systematic evaluation of difficulty levels, CO mapping, and Bloom's taxonomy alignment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={handleAnalyzeClick}
                className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 ${
                  !user ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
                }`}
                disabled={!user}
              >
                Analyze Question Paper
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
              <button 
                onClick={handleWatchDemo}
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all backdrop-blur-sm"
              >
                <Eye className="w-5 h-5 mr-2 inline" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Comprehensive Quality Analysis</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Systematic evaluation ensuring your engineering question papers meet OBE standards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white/70 backdrop-blur-md rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all transform hover:scale-105 hover:bg-white/80 shadow-lg hover:shadow-xl ${
                  activeFeature === index ? 'ring-2 ring-blue-400 bg-white/80' : ''
                }`}
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Why Choose Our Quality Analysis System?</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Outcome-Based Education (OBE) Compliance</h3>
                    <p className="text-gray-600">Perfect alignment with OBE principles, ensuring systematic CO mapping and assessment criteria.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Rule-Based Evaluation</h3>
                    <p className="text-gray-600">Standalone system with customizable criteria, eliminating human bias in question paper assessment.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Engineering Domain Focus</h3>
                    <p className="text-gray-600">Specifically designed for engineering curricula with comprehensive module coverage analysis.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 backdrop-blur-md border border-gray-200 shadow-lg">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-800 mb-2">100%</div>
                  <div className="text-gray-600 mb-4">CO Mapping Accuracy</div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">5,000+</div>
                  <div className="text-gray-600 mb-4">Question Papers Analyzed</div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">200+</div>
                  <div className="text-gray-600">Engineering Institutions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Ensure Quality Excellence?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join engineering institutions that trust our systematic approach to question paper quality analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleAnalyzeClick}
              className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl ${
                !user ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
              }`}
              disabled={!user}
            >
              Upload Question Paper
            </button>
            <button 
              onClick={handleViewSampleReport}
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all backdrop-blur-sm"
            >
              View Sample Report
            </button>
          </div>
        </div>
      </section>

      {/* Debug info - remove in production */}
      <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs opacity-50">
        User: {user ? user.name || 'Logged in' : 'Not logged in'}
      </div>
    </div>
  );
}