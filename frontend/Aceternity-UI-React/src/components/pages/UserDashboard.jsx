import React, { useState, useEffect } from 'react';
import { 
  User, 
  BookOpen, 
  BarChart3, 
  Upload, 
  LogOut, 
  FileText,
  Brain,
  ArrowRight,
  RefreshCw,
  Home
} from 'lucide-react';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  console.log(user);
  const [recentPapers, setRecentPapers] = useState([]);
  const [stats, setStats] = useState({
    totalPapers: 0,
  });
  const [loading, setLoading] = useState(true);

  const navigate = (path) => {
    console.log(`Navigate to: ${path}`);
    if (path === '/') {
      window.location.href = '/';
    } else if (path === '/upload') {
      window.location.href = '/upload';
    } else if (path === '/papers') {
      console.log('Papers page - to be implemented');
    }
  };

  // Check user authentication
  useEffect(() => {
    // Check for authentication token - replace with your auth logic
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
  

    if (!token || !userData) {
         const mockUser = {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@university.edu',
        role: 'Faculty'
      };
      setUser(mockUser);
      fetchMockData();
    } else {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchDashboardData();
      } catch (error) {
        const mockUser = {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@university.edu',
        role: 'Faculty'
      };
        console.error('Error parsing user data:', error);
        setUser(mockUser);
        fetchMockData();
      }
    }
  }, []);

  // Fetch actual dashboard data from API
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/totext/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRecentPapers(result.data.slice(0, 5));
          
          const papers = result.data;
          setStats({
            totalPapers: papers.length,
          });
        }
      } else {
        // Fallback to mock data if API fails
        fetchMockData();
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
        {
          _id: '1',
          'Course Name': 'Advanced Data Structures',
          'Course Code': 'CS301',
          'Branch': 'Computer Science',
          'Year Of Study': '3rd Year',
          'Semester': '5',
          'College Name': 'Tech University',
          createdAt: new Date().toISOString(),
          difficulty: 8.2,
          coAccuracy: 95
        },
        {
          _id: '2',
          'Course Name': 'Machine Learning Fundamentals',
          'Course Code': 'CS401',
          'Branch': 'Computer Science',
          'Year Of Study': '4th Year',
          'Semester': '7',
          'College Name': 'Tech University',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          difficulty: 7.5,
          coAccuracy: 88
        },
        {
          _id: '3',
          'Course Name': 'Database Management Systems',
          'Course Code': 'CS302',
          'Branch': 'Computer Science',
          'Year Of Study': '3rd Year',
          'Semester': '5',
          'College Name': 'Tech University',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          difficulty: 7.8,
          coAccuracy: 91
        }
      ];

      setRecentPapers(mockPapers);
      setStats({
        totalPapers: mockPapers.length
      });
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    
    // Dispatch custom event for other components listening to auth changes
    window.dispatchEvent(new Event('authStateChanged'));
    
    navigate('/');
  };

  const navigateToUpload = () => {
    navigate('/upload');
  };

  const navigateToAllPapers = () => {
    navigate('/papers');
  };

  const navigateHome = () => {
    navigate('/');
  };

  const quickActions = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Upload New Paper",
      description: "Analyze a new question paper",
      action: navigateToUpload,
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "View All Papers",
      description: "Browse your paper collection",
      action: navigateToAllPapers,
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics",
      description: "View detailed analytics",
      action: () => console.log('Analytics page - to be implemented'),
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Total Papers",
      description: `You have uploaded ${stats.totalPapers} papers`,
      action: navigateToAllPapers,
      color: "from-indigo-500 to-blue-600"
}
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={navigateHome}
                className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                <Brain className="w-6 h-6 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name || 'User'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={navigateHome}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Home"
              >
                <Home className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => {
                  setLoading(true);
                  fetchDashboardData();
                }}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <div className="flex items-center space-x-3 bg-white/80 rounded-lg px-4 py-2 border border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-800">{user?.userName || 'User'}</div>
                    <div className="text-xs text-gray-500">{user?.email || ''}</div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all transform hover:scale-105 hover:bg-white/80 shadow-lg hover:shadow-xl text-left group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all mt-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Papers */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Papers</h2>
            <button
              onClick={navigateToAllPapers}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {recentPapers.length > 0 ? (
            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              {recentPapers.map((paper, index) => (
                <div
                  key={paper._id || index}
                  className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-white/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {paper['Course Name']}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center bg-blue-50 px-2 py-1 rounded-lg">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {paper['Course Code']}
                        </span>
                        <span className="bg-gray-50 px-2 py-1 rounded-lg">{paper['Branch']}</span>
                        <span className="bg-green-50 px-2 py-1 rounded-lg">{paper['Year Of Study']} - Sem {paper['Semester']}</span>
                      </div>
                      <div className="text-sm text-gray-500">{paper['College Name']}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-2">
                        {new Date(paper.createdAt).toLocaleDateString()}
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors">
                        View Analysis
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No papers analyzed yet</h3>
              <p className="text-gray-600 mb-6">Upload your first question paper to get started with our AI-powered analysis</p>
              <button
                onClick={navigateToUpload}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Upload Paper
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}