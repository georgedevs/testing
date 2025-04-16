import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export const useAvatarCheck = () => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [requiresAvatar, setRequiresAvatar] = useState(false);
  const [isProcessingUpdate, setIsProcessingUpdate] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const checkAvatarRequirement = useCallback(() => {
    if (isAuthenticated && user && !isProcessingUpdate) {
      const needsAvatar = !user?.avatar?.avatarId;
      setRequiresAvatar(needsAvatar);
      
      if (needsAvatar && !isInitialized) {
        setShowAvatarModal(true);
        setIsInitialized(true);
      }
      
      // Only set ready when we have definitive user data
      setIsReady(true);
    }
  }, [isAuthenticated, user, isProcessingUpdate, isInitialized]);

  // Initial check with delay to ensure proper loading order
  useEffect(() => {
    if (!isLoading && user) {
      // Only proceed if we have actual user data
      const timer = setTimeout(() => {
        checkAvatarRequirement();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, user, checkAvatarRequirement]);

  // Watch for user changes
  useEffect(() => {
    if (user) {
      checkAvatarRequirement();
    }
  }, [user, checkAvatarRequirement]);

  const handleAvatarUpdated = async () => {
    setIsProcessingUpdate(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    setRequiresAvatar(false);
    setShowAvatarModal(false);
    setIsProcessingUpdate(false);
  };

  return {
    showAvatarModal,
    setShowAvatarModal,
    requiresAvatar,
    checkAvatarRequirement,
    handleAvatarUpdated,
    isAvatarModalComplete: !requiresAvatar && isInitialized,
    isReady
  };
};