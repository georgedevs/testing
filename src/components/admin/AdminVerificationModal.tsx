import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface AdminVerificationModalProps {
  isOpen: boolean;
  onVerify: () => void;
}

const AdminVerificationModal: React.FC<AdminVerificationModalProps> = ({ isOpen, onVerify }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // This is a simple hash of 'password1234' - you can replace this with your preferred password's hash
  const ADMIN_VERIFICATION_HASH = '4ea938c1267e5b091555b672d0468868';

  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  const handleVerify = () => {
    const hashedInput = hashString(verificationCode);
    if (hashedInput === ADMIN_VERIFICATION_HASH) {
      sessionStorage.setItem('adminVerified', 'true');
      onVerify();
      setError('');
    } else {
      setError('Invalid verification code');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Verification Required</DialogTitle>
          <DialogDescription>
            Please enter the admin verification code to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            type="password"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleVerify();
              }
            }}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleVerify}>
            Verify
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminVerificationModal;