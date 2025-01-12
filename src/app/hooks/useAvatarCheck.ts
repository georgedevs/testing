import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export const useAvatarCheck = () => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [requiresAvatar, setRequiresAvatar] = useState(false);
  const [isProcessingUpdate, setIsProcessingUpdate] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const checkAvatarRequirement = useCallback(() => {
    if (isAuthenticated && user && !isProcessingUpdate) {
      const needsAvatar = !user?.avatar?.avatarId;
      setRequiresAvatar(needsAvatar);
      setShowAvatarModal(needsAvatar);
    } else {
      setRequiresAvatar(false);
      setShowAvatarModal(false);
    }
  }, [isAuthenticated, user, isProcessingUpdate]);

  useEffect(() => {
    checkAvatarRequirement();
  }, [checkAvatarRequirement]);

  const handleAvatarUpdated = async () => {
    setIsProcessingUpdate(true);
    // Wait for next tick to ensure state updates are processed
    await new Promise(resolve => setTimeout(resolve, 0));
    setRequiresAvatar(false);
    setShowAvatarModal(false);
    setIsProcessingUpdate(false);
  };

  return {
    showAvatarModal,
    setShowAvatarModal,
    requiresAvatar,
    checkAvatarRequirement,
    handleAvatarUpdated
  };
};