import React, { useState, useEffect } from 'react';
import {
  User, BookOpen, BarChart3, Upload, LogOut,
  FileText, Brain, ArrowRight, RefreshCw, Home
} from 'lucide-react';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [recentPapers, setRecentPapers] = useState([]);
  const [stats, setStats] = useState({ totalPapers: 0 });
  const [loading, setLoading] = useState(true);

  const navigate = (path) => {
    window.location.href = path;
  };

  useEffect(() => {
    // Check user authentication
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    // Check for authentication token - replace with your auth logic
    if (!token || !userData) {
      setUser({ name: 'Dr. Sarah Johnson', email: 'sarah.johnson@university.edu', role: 'Faculty' });
      fetchMockData();
    } else {
      try {
        setUser(JSON.parse(userData));
        fetchDashboardData();
      } catch {
        setUser({ name: 'Dr. Sarah Johnson', email: 'sarah.johnson@university.edu', role: 'Faculty' });
        fetchMockData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch actual dashboard data from API
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/upload/totext`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRecentPapers(result.data.slice(0, 5));
          setStats({ totalPapers: result.data.length });
        }
      } else {
        // Fallback to mock data if API fails
        fetchMockData();
      }
    } catch {
      // Fallback to mock data if API fails
      fetchMockData();
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demo purposes
  const fetchMockData = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const mockPapers = [
        { _id: '1', 'Course Name': 'Advanced Data Structures', 'Course Code': 'CS301', 'Branch': 'Computer Science', 'Year Of Study': '3rd Year', 'Semester': '5', 'College Name': 'Tech University', createdAt: new Date().toISOString() },
        { _id: '2', 'Course Name': 'Machine Learning Fundamentals', 'Course Code': 'CS401', 'Branch': 'Computer Science', 'Year Of Study': '4th Year', 'Semester': '7', 'College Name': 'Tech University', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { _id: '3', 'Course Name': 'Database Management Systems', 'Course Code': 'CS302', 'Branch': 'Computer Science', 'Year Of Study': '3rd Year', 'Semester': '5', 'College Name': 'Tech University', createdAt: new Date(Date.now() - 172800000).toISOString() },
      ];
      setRecentPapers(mockPapers);
      setStats({ totalPapers: mockPapers.length });
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    ['accessToken', 'user'].forEach(k => { localStorage.removeItem(k); sessionStorage.removeItem(k); });
    window.dispatchEvent(new Event('authStateChanged'));
    navigate('/');
  };

  const quickActions = [
    { icon: <Upload className="w-6 h-6" />, title: 'Upload New Paper', description: 'Analyze a new question paper', action: () => navigate('/upload'), color: 'from-blue-500 to-purple-600', glow: 'shadow-blue-500/30' },
    { icon: <BookOpen className="w-6 h-6" />, title: 'View All Papers', description: 'Browse your paper collection', action: () => navigate('/papers'), color: 'from-teal-500 to-emerald-600', glow: 'shadow-teal-500/30' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Analytics', description: 'View detailed analytics', action: () => { }, color: 'from-orange-500 to-red-600', glow: 'shadow-orange-500/30' },
    { icon: <FileText className="w-6 h-6" />, title: 'Total Papers', description: `${stats.totalPapers} paper${stats.totalPapers !== 1 ? 's' : ''} uploaded`, action: () => navigate('/papers'), color: 'from-indigo-500 to-blue-600', glow: 'shadow-indigo-500/30' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Ambient glows ── */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-blue-500/25"
              >
                <Brain className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Dashboard</h1>
                <p className="text-xs text-gray-400">Welcome back, <span className="text-blue-400">{user?.userName || user?.name || 'User'}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Home">
                <Home className="w-5 h-5" />
              </button>
              <button onClick={() => { setLoading(true); fetchDashboardData(); }} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Refresh">
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* User pill */}
              <div className="flex items-center gap-3 bg-gray-800/80 border border-gray-700/60 rounded-xl px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-white">{user?.userName || user?.name || 'User'}</div>
                  <div className="text-xs text-gray-400">{user?.email || ''}</div>
                </div>
              </div>

              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="relative max-w-7xl mx-auto px-6 py-10">

        {/* Quick Actions */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-widest">
              ⚡ Quick Actions
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`relative bg-gray-900/70 border border-gray-700/50 rounded-2xl p-6 text-left group hover:border-gray-600 hover:bg-gray-900 transition-all duration-300 hover:shadow-xl hover:${action.glow} hover:-translate-y-1 overflow-hidden`}
              >
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${action.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h3 className="text-white font-bold text-base mb-1 group-hover:text-blue-300 transition-colors">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all mt-3" />
              </button>
            ))}
          </div>
        </section>

        {/* Recent Papers */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase tracking-widest">
              📄 Recent Papers
            </div>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 hover:bg-blue-500/10 px-3 py-2 rounded-lg transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {recentPapers.length > 0 ? (
            <div className="bg-gray-900/70 border border-gray-700/50 rounded-2xl overflow-hidden shadow-xl">
              {recentPapers.map((paper, index) => (
                <div
                  key={paper._id || index}
                  className="p-6 border-b border-gray-800/60 last:border-b-0 hover:bg-gray-800/40 transition-colors group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                        <h3 className="text-white font-semibold group-hover:text-blue-300 transition-colors">{paper['Course Name']}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs">
                        <span className="bg-blue-500/10 border border-blue-500/20 text-blue-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />{paper['Course Code']}
                        </span>
                        <span className="bg-gray-800 border border-gray-700 text-gray-300 px-2.5 py-1 rounded-lg">{paper['Branch']}</span>
                        <span className="bg-teal-500/10 border border-teal-500/20 text-teal-300 px-2.5 py-1 rounded-lg">{paper['Year Of Study']} — Sem {paper['Semester']}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{paper['College Name']}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-gray-500 mb-2">{new Date(paper.createdAt).toLocaleDateString()}</div>
                      <button className="text-xs text-blue-400 hover:text-blue-300 font-medium bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-colors">
                        View Analysis
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900/70 border border-gray-700/50 border-dashed rounded-2xl p-16 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">No papers analyzed yet</h3>
              <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">Upload your first question paper to get started with our analysis</p>
              <button
                onClick={() => navigate('/upload')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg shadow-blue-500/25"
              >
                Upload Paper
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}