'use client'
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { 
  AlertCircle, 
  Calendar, 
  Loader2, 
  User,
  VideoIcon,
  Users,
  Heart,
  UserCheck,
  Clock,
  Activity
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { MeetingRequest, useAssignCounselorMutation, useGetMeetingRequestsQuery } from '@/redux/feautures/booking/bookingApi';
import { useGetActiveCounselorsQuery } from '@/redux/feautures/admin/adminApi'; // Updated import
import { useSocket } from '../SocketProvider';

interface ApiError {
  data?: {
    message?: string;
  };
}

export default function MeetingRequests() {
  const socket = useSocket();
  const { data, isLoading, error, refetch } = useGetMeetingRequestsQuery(undefined, {
    refetchOnMountOrArgChange: true, 
    refetchOnFocus: true,            
    refetchOnReconnect: true          
  });
  const { data: counselorsData } = useGetActiveCounselorsQuery() // Use the new active counselors query
  const [assignCounselor] = useAssignCounselorMutation();
  
  const [selectedRequest, setSelectedRequest] = useState<MeetingRequest | null>(null);
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [assignmentError, setAssignmentError] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Now we get only active and available counselors from the API
  const activeCounselors = counselorsData?.counselors || [];

  useEffect(() => {
    if (!socket) return;

    // Listen for admin-specific updates
    const handleAdminUpdate = (data: { type: string }) => {
      if (data.type === 'new_booking' || data.type === 'meeting_requests_fetched') {
        refetch();
      }
    };

    socket.on('admin_update', handleAdminUpdate);

    return () => {
      socket.off('admin_update', handleAdminUpdate);
    };
  }, [socket, refetch]);

  const handleAssign = async () => {
    if (!selectedRequest) return;
    
    if (!selectedCounselor) {
      setAssignmentError('Please select a counselor');
      return;
    }

    setIsAssigning(true);
    try {
      await assignCounselor({
        meetingId: selectedRequest._id,
        counselorId: selectedCounselor
      }).unwrap();
      
      setSelectedRequest(null);
      setSelectedCounselor('');
      setAssignmentError('');
    } catch (err) {
      const apiError = err as ApiError;
      setAssignmentError(apiError.data?.message || 'Failed to assign counselor');
    } finally {
      setIsAssigning(false);
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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load meeting requests
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.requests.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Virtual Sessions
            </CardTitle>
            <VideoIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.requests.filter(r => r.meetingType === 'virtual').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Physical Sessions
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.requests.filter(r => r.meetingType === 'physical').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Available Counselors
            </CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeCounselors.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Ready for assignment</p>
          </CardContent>
        </Card>
      </div>

      {/* Show warning if no active counselors available */}
   {activeCounselors.length === 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong className="text-red-900 dark:text-red-100">No active counselors available!</strong> 
            <br />
            <span className="text-red-800 dark:text-red-200">Please approve and activate counselors in the Counselors section before assigning meetings.</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {data?.requests.map((request) => (
          <Card key={request._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    {request.clientId && request.clientId.avatar?.imageUrl ? (
                      <img 
                        src={request.clientId.avatar.imageUrl} 
                        alt={`${request.clientId.username}'s avatar`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {request.clientId?.username || "Unknown User"}
                    </CardTitle>
                    <CardDescription>
                      {request.clientId?.email || "No email available"}
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedRequest(request)}
                  disabled={activeCounselors.length === 0}
                >
                  {activeCounselors.length === 0 ? 'No Counselors Available' : 'Assign Counselor'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {request.clientId && (request.clientId.age || request.clientId.marriageYears || request.clientId.preferredCounselorGender) && (
                  <div className="flex flex-wrap gap-4">
                    {request.clientId.age && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {request.clientId.age} Years Old
                      </Badge>
                    )}
                    {request.clientId.marriageYears && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {request.clientId.marriageYears} Years Married
                      </Badge>
                    )}
                    {request.clientId.preferredCounselorGender && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        Prefers {request.clientId.preferredCounselorGender} Counselor
                      </Badge>
                    )}
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Session Type
                  </p>
                  <p className="mt-1">
                    {request.meetingType === 'virtual' ? 'Virtual Session' : 'Physical Session'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Issue Description
                  </p>
                  <p className="mt-1">
                    {request.issueDescription || "No description provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Requested On
                  </p>
                  <p className="mt-1">
                    {format(new Date(request.createdAt), 'PPP')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {data?.requests.length === 0 && (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <Calendar className="w-12 h-12 text-gray-400" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Meeting Requests</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  There are currently no pending meeting requests.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Assignment Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => {
        if (!open) {
          setSelectedRequest(null);
          setSelectedCounselor('');
          setAssignmentError('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Counselor</DialogTitle>
            <DialogDescription>
              Select an active and available counselor for this session request
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {assignmentError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{assignmentError}</AlertDescription>
              </Alert>
            )}

            {activeCounselors.length === 0 ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>No active counselors available!</strong>
                  <br />Please approve and activate counselors before making assignments.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Active Counselor</label>
                  <Select
                    value={selectedCounselor}
                    onValueChange={setSelectedCounselor}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an active counselor" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeCounselors.map((counselor) => (
                        <SelectItem key={counselor._id} value={counselor._id}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{counselor.fullName}</span>
                            <span className="text-xs text-gray-500">
                              ({counselor.activeClients} active clients)
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Only active and available counselors are shown
                  </p>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleAssign}
                  disabled={isAssigning || !selectedCounselor}
                >
                  {isAssigning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    'Assign Counselor'
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}