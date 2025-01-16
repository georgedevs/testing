import React, { useState, useEffect } from 'react';
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
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();
  const MAX_ATTEMPTS = 5;

  // Using a simple string comparison for reliability
  const ADMIN_PASSWORD = 'password1234';

  useEffect(() => {
    // Reset attempts when modal opens
    const storedAttempts = sessionStorage.getItem('adminAttempts');
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts));
    }
  }, []);

  const handleVerify = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    sessionStorage.setItem('adminAttempts', newAttempts.toString());

    if (newAttempts >= MAX_ATTEMPTS) {
      sessionStorage.removeItem('adminAttempts');
      router.push('/signin');
      return;
    }

    if (verificationCode === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminVerified', 'true');
      sessionStorage.removeItem('adminAttempts');
      onVerify();
      setError('');
    } else {
      setError(`Invalid verification code. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
    }
  };

  const handleCancel = () => {
    sessionStorage.removeItem('adminAttempts');
    router.push('/signin');
  };

  if (attempts >= MAX_ATTEMPTS) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Maximum Attempts Exceeded</DialogTitle>
            <DialogDescription>
              You have exceeded the maximum number of attempts. Please try signing in again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => router.push('/signin')}>
              Return to Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Verification Required</DialogTitle>
          <DialogDescription>
            Please enter the admin verification code to continue.
            {attempts > 0 && ` (${MAX_ATTEMPTS - attempts} attempts remaining)`}
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