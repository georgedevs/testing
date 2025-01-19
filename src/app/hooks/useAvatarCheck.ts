import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export const useAvatarCheck = () => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [requiresAvatar, setRequiresAvatar] = useState(false);
  const [isProcessingUpdate, setIsProcessingUpdate] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAvatarModalComplete, setIsAvatarModalComplete] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const checkAvatarRequirement = useCallback(() => {
    if (isAuthenticated && user && !isProcessingUpdate) {
      const needsAvatar = !user?.avatar?.avatarId;
      setRequiresAvatar(needsAvatar);
      if (needsAvatar && !isInitialized) {
        setShowAvatarModal(true);
        setIsInitialized(true);
        setIsAvatarModalComplete(false);
      } else if (!needsAvatar) {
        setIsAvatarModalComplete(true);
      }
    } else {
      setRequiresAvatar(false);
      setShowAvatarModal(false);
    }
  }, [isAuthenticated, user, isProcessingUpdate, isInitialized]);

  // Initial check with delay to ensure proper loading order
  useEffect(() => {
    const timer = setTimeout(() => {
      checkAvatarRequirement();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Watch for user changes
  useEffect(() => {
    checkAvatarRequirement();
  }, [checkAvatarRequirement]);

  const handleAvatarUpdated = async () => {
    setIsProcessingUpdate(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      setRequiresAvatar(false);
      setShowAvatarModal(false);
      setIsAvatarModalComplete(true);
    } finally {
      setIsProcessingUpdate(false);
    }
  };

  return {
    showAvatarModal,
    setShowAvatarModal,
    requiresAvatar,
    checkAvatarRequirement,
    handleAvatarUpdated,
    isAvatarModalComplete,
    isProcessingUpdate
  };
};