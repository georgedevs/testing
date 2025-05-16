"use client"
import React, { useState } from 'react';
import Heading from '@/components/Heading';
import { CounselorSidebar } from '@/components/counselor/CounselorSidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ChevronDown, Loader } from 'lucide-react';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Edit2, Save, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/app/hooks/useAuth';
import { useUpdateCounselorProfileMutation } from '@/redux/feautures/user/userApi';
import { useDeleteAccountMutation } from '@/redux/feautures/auth/authApi';
import PasswordUpdateForm from '@/components/PasswordUpdateForm';
import { ICounselorProfile } from '@/redux/types/auth';
import { IUser } from '@/redux/types/auth';
import { DashboardHeader } from '@/components/counselor/DashboardHeader';

interface CounselorProfileFormValues {
  fullName: string;
  marriageYears: number;
  gender: "male" | "female";
  languages: string[];
  maxDailyMeetings: number;
  isAvailable: boolean;
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  meetingPreferences: {
    maxConsecutiveMeetings: number;
  };
}

const CounselorProfilePage = () => {
  const { isLoading: authLoading } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user as IUser & ICounselorProfile);
  const [updateProfile, { isLoading }] = useUpdateCounselorProfileMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount({ password: deletePassword }).unwrap();
      toast.success("Account deleted successfully");
      // Redirect will happen automatically due to the auth state change
    } catch (error:any) {
      const errorMesage = error?.data?.message || "Failed to delete account";
      setDeleteError(errorMesage);
      toast.error(errorMesage);
    }
  };

  const formik = useFormik<CounselorProfileFormValues>({
    initialValues: {
      fullName: user?.fullName || "",
      marriageYears: typeof user?.marriageYears === 'number' ? user.marriageYears : 0,
      gender: user?.gender || "male",
      languages: user?.languages || [],
      maxDailyMeetings: user?.maxDailyMeetings || 8,
      isAvailable: user?.isAvailable ?? true,
      workingHours: {
        start: user?.workingHours?.start || "09:00",
        end: user?.workingHours?.end || "17:00",
        timezone: user?.workingHours?.timezone || "UTC",
      },
      meetingPreferences: {
        maxConsecutiveMeetings: user?.meetingPreferences?.maxConsecutiveMeetings || 4,
      },
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .required("Full name is required")
        .min(3, "Full name must be at least 3 characters"),
      marriageYears: Yup.number()
        .required("Marriage years is required")
        .min(0, "Invalid years")
        .transform((value) => (isNaN(value) ? undefined : value)),
      maxDailyMeetings: Yup.number()
        .required("Max daily meetings is required")
        .min(1, "Must be at least 1")
        .max(20, "Cannot exceed 20"),
      gender: Yup.string()
        .required("Gender is required")
        .oneOf(["male", "female"], "Invalid gender selection"),
      workingHours: Yup.object({
        start: Yup.string().required("Start time is required"),
        end: Yup.string().required("End time is required"),
        timezone: Yup.string().required("Timezone is required"),
      }),
      meetingPreferences: Yup.object({
        maxConsecutiveMeetings: Yup.number()
          .required("Max consecutive meetings is required")
          .min(1, "Must be at least 1")
          .max(10, "Cannot exceed 10"),
      }),
    }),
    onSubmit: async (values) => {
      try {
        // Transform the values to ensure numbers are properly typed
        const payload = {
          ...values,
          marriageYears: Number(values.marriageYears),
          maxDailyMeetings: Number(values.maxDailyMeetings),
          meetingPreferences: {
            ...values.meetingPreferences,
            maxConsecutiveMeetings: Number(values.meetingPreferences.maxConsecutiveMeetings),
          },
        };
        
        await updateProfile(payload).unwrap();
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error("Failed to update profile");
      }
    },
  });

  if (authLoading) return <Loader className="animate-spin" />;

  return (
    <>
      <ProtectedRoute allowedRoles={['counselor']}>
        <Heading 
          title="Counselor Profile Settings"
          description="Update your counselor profile and preferences"
          keywords="profile, counselor, settings, therapy"
        />
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900">
          <DashboardHeader />
          <CounselorSidebar />
          <main className="lg:ml-72 p-4 lg:p-6 lg:mt-16 mt-4">
          <div className="max-w-screen-2xl mx-auto space-y-6">
              {/* New Header Section */}
              <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-900/10">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
                  Profile Overview
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Manage and customize your counseling profile settings
                </p>
              </div>
              <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-900/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle>Counselor Profile</CardTitle>
                      <CardDescription>
                        Manage your professional information and preferences
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Existing form fields remain the same */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                          name="fullName"
                          value={formik.values.fullName}
                          onChange={formik.handleChange}
                          className={
                            formik.touched.fullName && formik.errors.fullName
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {formik.touched.fullName && formik.errors.fullName && (
                          <p className="text-sm text-red-500">{formik.errors.fullName}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Marriage Years</label>
                        <Input
                          type="number"
                          name="marriageYears"
                          value={formik.values.marriageYears}
                          onChange={(e) => {
                            const value = e.target.value;
                            formik.setFieldValue('marriageYears', value === '' ? 0 : Number(value));
                          }}
                          onBlur={formik.handleBlur}
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Gender</label>
                        <Select
                          name="gender"
                          value={formik.values.gender}
                          onValueChange={(value) =>
                            formik.setFieldValue("gender", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Max Daily Meetings</label>
                        <Input
                          type="number"
                          name="maxDailyMeetings"
                          value={formik.values.maxDailyMeetings}
                          onChange={formik.handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Working Hours</h4>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <label className="text-sm font-medium">Start Time</label>
                          <Input
                            type="time"
                            name="workingHours.start"
                            value={formik.values.workingHours.start}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">End Time</label>
                          <Input
                            type="time"
                            name="workingHours.end"
                            value={formik.values.workingHours.end}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Timezone</label>
                          <Input
                            name="workingHours.timezone"
                            value={formik.values.workingHours.timezone}
                            onChange={formik.handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Meeting Preferences</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium">Max Consecutive Meetings</label>
                          <Input
                            type="number"
                            name="meetingPreferences.maxConsecutiveMeetings"
                            value={formik.values.meetingPreferences.maxConsecutiveMeetings}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="isAvailable"
                            checked={formik.values.isAvailable}
                            onChange={formik.handleChange}
                            className="rounded border-gray-300"
                          />
                          <label className="text-sm font-medium">Available for Sessions</label>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-500 dark:text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-900/10">
                <PasswordUpdateForm />
              </Card>

              <Card className="border border-red-200/50 dark:border-red-700/50 shadow-xl shadow-gray-900/10">
                <Collapsible open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="text-left">
                            <CardTitle className="text-red-600 dark:text-red-400">Delete Account</CardTitle>
                            <CardDescription className="text-red-600/80 dark:text-red-400/80">
                              Permanently delete your account and all associated data
                            </CardDescription>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDeleteOpen ? 'transform rotate-180' : ''}`} />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <Alert variant="destructive" className="mb-6 border-red-500/50 bg-red-50 dark:bg-red-900/20">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-300" />
                        <AlertTitle className="text-red-600 dark:text-red-300 font-semibold">
                          Warning: This action cannot be undone
                        </AlertTitle>
                        <AlertDescription className="text-red-600/90 dark:text-red-300/90">
                          Deleting your account will permanently remove all your data, including session history, client information, and personal data.
                        </AlertDescription>
                      </Alert>

                      <Button 
                        variant="destructive"
                        className="w-full md:w-auto bg-red-600 hover:bg-red-700"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        Delete Account
                      </Button>

                      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your account
                              and remove your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="space-y-3 py-4">
                            <label className="text-sm font-medium">
                              Please enter your password to confirm:
                            </label>
                            <Input
                              type="password"
                              value={deletePassword}
                              onChange={(e) => setDeletePassword(e.target.value)}
                              className={deleteError ? "border-red-500" : ""}
                            />
                           {deleteError && (
                              <p className="text-sm text-red-500">{deleteError}</p>
                            )}
                            </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => {
                              setDeletePassword("");
                              setDeleteError("");
                            }}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={handleDeleteAccount}
                            >
                              Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default CounselorProfilePage;