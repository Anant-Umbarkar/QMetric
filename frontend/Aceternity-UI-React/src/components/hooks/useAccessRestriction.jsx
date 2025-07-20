import { useState } from 'react';

const useAccessRestriction = (user = null, onLogin = null) => {
  const [restrictionModal, setRestrictionModal] = useState({
    isOpen: false,
    featureName: '',
    restrictionType: 'login',
    customMessage: null,
    customIcon: null
  });

  const showRestrictionModal = (config) => {
    const {
      featureName,
      restrictionType = 'login',
      customMessage = null,
      customIcon = null
    } = config;

    setRestrictionModal({
      isOpen: true,
      featureName,
      restrictionType,
      customMessage,
      customIcon
    });
  };

  const closeRestrictionModal = () => {
    setRestrictionModal(prev => ({ ...prev, isOpen: false }));
  };

  const checkAccess = (config) => {
    const { 
      featureName, 
      requiresLogin = true, 
      requiresPremium = false,
      customMessage = null,
      customIcon = null
    } = config;

    // Check if user needs to be logged in
    if (requiresLogin && !user) {
      showRestrictionModal({
        featureName,
        restrictionType: 'login',
        customMessage,
        customIcon
      });
      return false;
    }

    // Check if feature requires premium
    if (requiresPremium && (!user || !user.isPremium)) {
      showRestrictionModal({
        featureName,
        restrictionType: 'premium',
        customMessage,
        customIcon
      });
      return false;
    }

    return true;
  };

  return {
    restrictionModal,
    showRestrictionModal,
    closeRestrictionModal,
    checkAccess,
    handleLogin: onLogin
  };
};

export default useAccessRestriction;