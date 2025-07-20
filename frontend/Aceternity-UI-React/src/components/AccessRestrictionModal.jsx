import React from 'react';
import { X, Shield, Lock, Crown } from 'lucide-react';

const AccessRestrictionModal = ({ 
  isOpen, 
  onClose, 
  onLogin, 
  featureName, 
  restrictionType = 'login', // 'login' or 'premium'
  user = null,
  customMessage = null,
  customIcon = null 
}) => {
  if (!isOpen) return null;

  const getRestrictionConfig = () => {
    switch (restrictionType) {
      case 'premium':
        return {
          icon: customIcon || Crown,
          iconBg: 'from-yellow-500 to-orange-500',
          title: 'Premium Feature',
          message: customMessage || `${featureName} is available for Premium users only.`,
          buttonText: 'Upgrade to Premium',
          buttonAction: () => {
            // Handle premium upgrade logic here
            console.log('Redirect to premium upgrade');
            onClose();
          }
        };
      case 'login':
      default:
        return {
          icon: customIcon || Shield,
          iconBg: 'from-red-500 to-orange-500',
          title: 'Access Restricted',
          message: customMessage || `You need to be logged in to access ${featureName}.`,
          buttonText: 'Login to Continue',
          buttonAction: () => {
            onLogin();
            onClose();
          }
        };
    }
  };

  const config = getRestrictionConfig();
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="text-center">
          {/* Close button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Icon */}
          <div className={`w-16 h-16 bg-gradient-to-r ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2">{config.title}</h2>

          {/* Message */}
          <p className="text-gray-400 mb-6">{config.message}</p>
          
          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={config.buttonAction}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200"
            >
              {config.buttonText}
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-2 text-gray-400 hover:text-white transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessRestrictionModal;