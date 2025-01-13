import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useGetAvatarsQuery, useUpdateAvatarMutation } from '@/redux/feautures/auth/authApi';
import { AvatarCategory, AvatarOption } from '../../src/types/avatar';
import { useDispatch } from 'react-redux';
import { updateUserAvatar } from '@/redux/feautures/auth/authSlice';

interface AvatarSelectionModalProps {
  open: boolean;
  onClose: () => void;
  isRequired?: boolean;
  onAvatarUpdated?: () => void;
}

export const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({
  open,
  onClose,
  isRequired = false,
  onAvatarUpdated
}) => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState<AvatarCategory>('male');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(open);
  
  const { data: avatarsData, isLoading: loadingAvatars } = useGetAvatarsQuery(undefined);
  const [updateAvatar, { isLoading: updating }] = useUpdateAvatarMutation();

  useEffect(() => {
    setModalOpen(open);
  }, [open]);

  const getAvatarsForCategory = (category: AvatarCategory): AvatarOption[] => {
    return avatarsData?.avatars?.[category] || [];
  };

  const handleAvatarSelect = async (avatarId: string) => {
    try {
      const response = await updateAvatar(avatarId).unwrap();
      
      setSelectedAvatar(avatarId);  
      if (response.success && response.user.avatar) {
        dispatch(updateUserAvatar({
          avatarId: response.user.avatar.avatarId,
          imageUrl: response.user.avatar.imageUrl
        }));
      }
  
      toast.success('Avatar updated successfully');
  
      if (!isRequired) {
        onClose();
      }
  
      if (onAvatarUpdated) {
        await onAvatarUpdated();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update avatar');
    }
  };

  useEffect(() => {
    if (open) {
      setSelectedAvatar(null);
    }
  }, [open]);

  return (
    <Dialog 
      open={modalOpen} 
      onOpenChange={(newOpen) => {
        if (!isRequired) {
          setModalOpen(newOpen);
          if (!newOpen) onClose();
        }
      }}
    >
      <DialogContent className="w-[95vw] max-w-[600px] h-[90vh] sm:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center mb-2 sm:mb-4">
            {isRequired ? 'Select Your Avatar to Continue' : 'Choose Your Avatar'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="male" value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as AvatarCategory)}>
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
            <TabsTrigger value="male" className="text-sm sm:text-base capitalize px-2 py-1 sm:px-4 sm:py-2">Male</TabsTrigger>
            <TabsTrigger value="female" className="text-sm sm:text-base capitalize px-2 py-1 sm:px-4 sm:py-2">Female</TabsTrigger>
            <TabsTrigger value="neutral" className="text-sm sm:text-base capitalize px-2 py-1 sm:px-4 sm:py-2">Neutral</TabsTrigger>
          </TabsList>

          {loadingAvatars ? (
            <div className="flex justify-center items-center h-48 sm:h-64">
              <Loader className="animate-spin" />
            </div>
          ) : (
            <TabsContent value={selectedCategory} className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-4">
                {getAvatarsForCategory(selectedCategory).map((avatar) => (
                  <div
                    key={avatar.id}
                    onClick={() => handleAvatarSelect(avatar.id)}
                    className={`
                      cursor-pointer rounded-xl p-2 sm:p-3 transition-all
                      hover:scale-105 transform duration-200
                      ${selectedAvatar === avatar.id
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-1 sm:mb-2">
                      <img
                        src={avatar.imageUrl}
                        alt={avatar.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-300">
                      {avatar.label}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>

        {updating && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded-lg">
            <Loader className="animate-spin" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AvatarSelectionModal;