import React, { useState } from 'react';
import { useGetAllCounselorsQuery, useDeleteCounselorMutation } from '@/redux/feautures/admin/adminApi';
import { useGetPendingCounselorsQuery } from '@/redux/feautures/auth/authApi'; // Add this import
import { Loader2, User, Star, Users, Calendar, Activity, Trash2, AlertCircle, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface Counselor {
  _id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  specializations: string[];
  languages: string[];
  gender: string;
  rating: number;
  totalSessions: number;
  completedSessions: number;
  activeClients: number;
  credentials?: string;
  createdAt: string;
}

const ActiveCounselors = () => {
  const { data, isLoading } = useGetAllCounselorsQuery()
  const { data: pendingData } = useGetPendingCounselorsQuery(); // Get pending count
  const [deleteCounselor, { isLoading: isDeleting }] = useDeleteCounselorMutation();
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Filter to only show ACTIVE counselors
  const activeCounselors = data?.counselors.filter(counselor => counselor.isActive) || [];
  const pendingCount = pendingData?.count || 0;
  
  // Update statistics to reflect only active counselors
  const activeStatistics = {
    totalCounselors: activeCounselors.length,
    activeCounselors: activeCounselors.length, // All shown are active
    averageRating: activeCounselors.length > 0 
      ? (activeCounselors.reduce((sum, c) => sum + (c.rating || 0), 0) / activeCounselors.length).toFixed(1)
      : '0.0',
    totalCompletedSessions: activeCounselors.reduce((sum, c) => sum + (c.completedSessions || 0), 0)
  };

  const handleDelete = async () => {
    if (!selectedCounselor) return;

    try {
      await deleteCounselor({
        counselorId: selectedCounselor._id,
        reason: deleteReason.trim(),
      }).unwrap();
      
      toast.success('Counselor account deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedCounselor(null);
      setDeleteReason('');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete counselor account');
    }
  };

  const handleOpenDelete = (counselor: Counselor) => {
    if (counselor.activeClients > 0) {
      toast.error('Cannot delete counselor with active clients');
      return;
    }
    setSelectedCounselor(counselor);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteReason('');
    setConfirmDeleteOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards - Updated to show active counselors only */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Counselors</CardTitle>
            <Activity className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeStatistics.totalCounselors}</div>
            <p className="text-xs text-gray-500 mt-1">Currently active and available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Active Clients</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCounselors.reduce((sum, c) => sum + (c.activeClients || 0), 0)}</div>
            <p className="text-xs text-gray-500 mt-1">Across all active counselors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStatistics.averageRating}</div>
            <p className="text-xs text-gray-500 mt-1">Among active counselors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStatistics.totalCompletedSessions}</div>
            <p className="text-xs text-gray-500 mt-1">Completed by active counselors</p>
          </CardContent>
        </Card>
      </div>

      {/* Show message if no active counselors */}
      {activeCounselors.length === 0 && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <UserX className="w-12 h-12 text-gray-400" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Active Counselors</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                There are currently no active counselor accounts. Check the Pending Applications tab to approve counselors.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Active Counselors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeCounselors.map((counselor) => (
          <HoverCard key={counselor._id}>
            <HoverCardTrigger asChild>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                      <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </div>
                    {/* Active indicator */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {counselor.fullName}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {counselor.email}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{counselor.rating || 'No rating'}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{counselor.activeClients} active clients</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Active & Available</span>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{counselor.fullName}</h4>
                  <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    <Activity className="w-3 h-3" />
                    Active
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Specializations:</strong> {counselor.specializations?.join(', ') || 'None specified'}</p>
                  <p><strong>Languages:</strong> {counselor.languages?.join(', ') || 'None specified'}</p>
                  <p><strong>Gender:</strong> {counselor.gender}</p>
                  <p><strong>Total Sessions:</strong> {counselor.totalSessions || 0}</p>
                  <p><strong>Completed Sessions:</strong> {counselor.completedSessions || 0}</p>
                  <p><strong>Success Rate:</strong> {
                    counselor.totalSessions > 0 
                      ? `${((counselor.completedSessions / counselor.totalSessions) * 100).toFixed(1)}%`
                      : 'N/A'
                  }</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button 
                    className="flex-1"
                    onClick={() => setSelectedCounselor(counselor)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenDelete(counselor);
                    }}
                    disabled={counselor.activeClients > 0}
                    title={counselor.activeClients > 0 ? `Cannot delete counselor with ${counselor.activeClients} active clients` : "Delete counselor"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>

      {/* Rest of the component remains the same - Modal dialogs etc. */}
      {/* Detailed Modal */}
      <Dialog open={!!selectedCounselor && !deleteDialogOpen} onOpenChange={() => setSelectedCounselor(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Counselor Details
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                <Activity className="w-3 h-3" />
                Active
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedCounselor && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                    <User className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedCounselor.fullName}</h3>
                    <p className="text-gray-500">{selectedCounselor.email}</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleOpenDelete(selectedCounselor)}
                  disabled={selectedCounselor.activeClients > 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="font-medium flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {selectedCounselor.rating || 'No rating'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Active Clients</p>
                  <p className="font-medium">{selectedCounselor.activeClients}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Total Sessions</p>
                  <p className="font-medium">{selectedCounselor.totalSessions}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Completed Sessions</p>
                  <p className="font-medium">{selectedCounselor.completedSessions}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCounselor.specializations?.length ? selectedCounselor.specializations.map((spec) => (
                    <span key={spec} className="px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded">
                      {spec}
                    </span>
                  )) : (
                    <span className="text-sm text-gray-400">None specified</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCounselor.languages?.length ? selectedCounselor.languages.map((lang) => (
                    <span key={lang} className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                      {lang}
                    </span>
                  )) : (
                    <span className="text-sm text-gray-400">None specified</span>
                  )}
                </div>
              </div>

              {selectedCounselor.credentials && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Credentials</p>
                  <p className="text-sm">{selectedCounselor.credentials}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog - Same as before */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Delete Counselor Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete {selectedCounselor?.fullName}'s account? This action cannot be undone.
            </p>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Deletion Reason (Optional)
              </label>
              <Textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Please provide a reason for deletion..."
                className="mt-1"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCloseDelete}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => setConfirmDeleteOpen(true)}
              >
                Delete Account
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Final Confirmation Alert - Same as before */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action permanently deletes {selectedCounselor?.fullName}'s account and cannot be undone.
              All associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
             {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActiveCounselors;