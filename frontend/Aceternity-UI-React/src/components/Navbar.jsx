import React, { useState } from 'react';
import { FileText, Menu, X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AccessRestrictionModal from './AccessRestrictionModal';
import useAccessRestriction from './hooks/useAccessRestriction';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Use the access restriction hook
  const { restrictionModal, closeRestrictionModal, checkAccess } = useAccessRestriction(
    user,
    () => setIsLoginModalOpen(true)
  );

  // Check for existing user session on component mount
  React.useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    const userData = sessionStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // Feature access handler
  const handleFeatureAccess = (featureName, requiresPremium = false) => {
    const hasAccess = checkAccess({
      featureName,
      requiresLogin: true,
      requiresPremium
    });

    if (hasAccess) {
      // Navigate to feature or perform action
      console.log(`Accessing ${featureName}`);
    }
  };

  // Get user initials
  const getUserInitials = (userName) => {
    console.log(userName)
    if (!userName) return 'U';
    const names = userName.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    setUser(null);
    setShowUserMenu(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (isRegisterMode && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
       const apiUrl = isRegisterMode ? 'Yhttp://localhost:80/auth/register' : 'http://localhost:80/auth/login';
    
    const requestBody = isRegisterMode 
      ? {
          userName: formData.userName,
          email: formData.email,
          password: formData.password
        }
      : {
          email: formData.email,
          password: formData.password
        };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Authentication failed');
    }

    const data = await response.json();

      sessionStorage.setItem('accessToken', 'mock-token');
      sessionStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsLoginModalOpen(false);
      setFormData({ userName: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      setError('Credentials not matched. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setFormData({ userName: '', email: '', password: '', confirmPassword: '' });
    setError('');
  };

  const closeModal = () => {
    setIsLoginModalOpen(false);
    setFormData({ userName: '', email: '', password: '', confirmPassword: '' });
    setError('');
  };
  
  return (
    <>
      <nav className="relative z-50 bg-gray-900 text-white py-4 px-6 rounded-md shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                EduMetric
              </span>
            </div>
            
            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <a 
                href="#features" 
                className="relative px-5 py-2 text-lg font-semibold transition-all rounded-lg text-gray-300 hover:text-orange-500"
              >
                Features
              </a>
              <a 
                href="#about" 
                className="relative px-5 py-2 text-lg font-semibold transition-all rounded-lg text-gray-300 hover:text-orange-500"
              >
                About
              </a>
              <a 
                href="#contact" 
                className="relative px-5 py-2 text-lg font-semibold transition-all rounded-lg text-gray-300 hover:text-orange-500"
              >
                Contact
              </a>
              <button
                onClick={() => handleFeatureAccess('Dashboard')}
                className="relative px-5 py-2 text-lg font-semibold transition-all rounded-lg text-gray-300 hover:text-orange-500 flex items-center space-x-1"
              >
                <span>Dashboard</span>
                {!user && <Lock className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleFeatureAccess('Analytics', true)} // Requires premium
                className="relative px-5 py-2 text-lg font-semibold transition-all rounded-lg text-gray-300 hover:text-orange-500 flex items-center space-x-1"
              >
                <span>Analytics</span>
                {(!user || !user.isPremium) && <Lock className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Login Button or User Avatar - Desktop */}
            <div className="hidden md:block">
              {user ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg"
                  >
                    {getUserInitials(user.userName)}
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
                      <div className="px-4 py-3 border-b border-gray-600">
                        <p className="text-white font-semibold">{user.userName}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className={`text-xs px-2 py-1 rounded ${user.isPremium ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-gray-300'}`}>
                            {user.isPremium ? 'Premium' : 'Free'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-b-lg"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-lg font-semibold text-white rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200"
                >
                  Login
                </button>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 mt-4 rounded-lg">
            <div className="px-4 py-4 space-y-4">
              <a 
                href="#features" 
                className="block relative px-5 py-2 text-lg font-semibold transition-all rounded-lg text-gray-300 hover:text-orange-500"
              >
                Features
              </a>
              <a 
                href="#about" 
                className="block relative px-5 py-2 text-lg font-semibold transition-all rounded-lg text-gray-300 hover:text-orange-500"
              >
                About
              </a>
              <a 
                href="#contact" 
                className="block relative px-5 py-2 text-lg font-semibold transition-all rounded-lg text-gray-300 hover:text-orange-500"
              >
                Contact
              </a>
              <button
                onClick={() => handleFeatureAccess('Dashboard')}
                className="w-full text-left relative px-5 py-2 text-lg font-semibold transition-all rounded-lg text-gray-300 hover:text-orange-500 flex items-center space-x-1"
              >
                <span>Dashboard</span>
                {!user && <Lock className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleFeatureAccess('Analytics', true)}
                className="w-full text-left relative px-5 py-2 text-lg font-semibold transition-all rounded-lg text-gray-300 hover:text-orange-500 flex items-center space-x-1"
              >
                <span>Analytics</span>
                {(!user || !user.isPremium) && <Lock className="w-4 h-4" />}
              </button>
              
              {user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 border-b border-gray-600">
                    <p className="text-white font-semibold">{user.userName}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-lg font-semibold text-white rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Access Restriction Modal */}
      <AccessRestrictionModal
        isOpen={restrictionModal.isOpen}
        onClose={closeRestrictionModal}
        onLogin={() => setIsLoginModalOpen(true)}
        featureName={restrictionModal.featureName}
        restrictionType={restrictionModal.restrictionType}
        user={user}
        customMessage={restrictionModal.customMessage}
        customIcon={restrictionModal.customIcon}
      />
      
      {/* Login/Register Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {isRegisterMode ? 'Create Account' : 'Welcome Back'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {isRegisterMode && (
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {isRegisterMode && (
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  />
                </div>
              )}
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? 'Processing...' : (isRegisterMode ? 'Create Account' : 'Sign In')}
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={toggleMode}
                  className="ml-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  {isRegisterMode ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;