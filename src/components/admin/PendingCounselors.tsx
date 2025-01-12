import React, { useState } from 'react';
import { useGetPendingCounselorsQuery, useApproveCounselorMutation, useRejectCounselorMutation } from '@/redux/feautures/auth/authApi';
import { Loader2, CheckCircle2, XCircle, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

interface Counselor {
  _id: string;
  fullName: string;
  email: string;
  credentials?: string;
  createdAt: string;
}


const PendingCounselors = () => {
  const { data, isLoading, error } = useGetPendingCounselorsQuery()
  const [approveCounselor] = useApproveCounselorMutation();
  const [rejectCounselor] = useRejectCounselorMutation();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async (counselorId: string) => {
    try {
      await approveCounselor(counselorId).unwrap();
      toast.success('Counselor approved successfully');
    } catch (error) {
      toast.error('Failed to approve counselor');
    }
  };

  const handleOpenRejectDialog = (counselorId: string) => {
    setSelectedCounselor(counselorId);
    setRejectDialogOpen(true);
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setSelectedCounselor(null);
    setRejectReason('');
  };

  const handleReject = async () => {
    if (!selectedCounselor) return;
    
    try {
      await rejectCounselor({
        counselorId: selectedCounselor,
        reason: rejectReason,
      }).unwrap();
      toast.success('Counselor rejected successfully');
      handleCloseRejectDialog();
    } catch (error) {
      toast.error('Failed to reject counselor');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
        Failed to load pending counselors
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50">
          <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Pending Approvals
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data?.count || 0} counselors awaiting approval
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {data?.counselors?.map((counselor: Counselor) => (
          <div
            key={counselor._id}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                  <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {counselor.fullName}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {counselor.email}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Registered {new Date(counselor.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(counselor._id)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                
                <Button
                  onClick={() => handleOpenRejectDialog(counselor._id)}
                  variant="destructive"
                  size="sm"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
            
            {counselor.credentials && (
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                <strong className="text-gray-700 dark:text-gray-200">Credentials:</strong>
                <p className="mt-1">{counselor.credentials}</p>
              </div>
            )}
          </div>
        ))}

        {data?.counselors?.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No pending counselor approvals
          </div>
        )}
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Counselor Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Rejection Reason
              </label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCloseRejectDialog}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingCounselors;