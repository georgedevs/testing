"use client"
import React, { useState, useEffect } from 'react';
import Heading from '@/components/Heading';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ChevronDown, Loader } from 'lucide-react';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useUpdateClientProfileMutation } from "@/redux/feautures/user/userApi";
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
import PasswordUpdateForm from '@/components/PasswordUpdateForm';
import { useDeleteAccountMutation } from '@/redux/feautures/auth/authApi';

type PreferredCounselorGender = 'male' | 'female' | 'no_preference';

interface ProfileFormValues {
  username?: string;
  marriageYears?: number | null;
  age?: number | null;
  preferredCounselorGender?: PreferredCounselorGender;
  preferredLanguages?: string[];
  timezone?: string;
}

interface UpdateClientProfileData {
  username?: string;
  marriageYears?: number;
  age?: number;
  preferredCounselorGender?: PreferredCounselorGender;
  preferredLanguages?: string[];
  timezone?: string;
}

const ProfilePage = () => {
  const { isLoading: authLoading } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const [updateProfile, { isLoading }] = useUpdateClientProfileMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [initialValues, setInitialValues] = useState<ProfileFormValues>({
    username: '',
    marriageYears: null,
    age: null,
    preferredCounselorGender: 'no_preference',
    preferredLanguages: [],
    timezone: '',
  });

  useEffect(() => {
    if (user) {
      setInitialValues({
        username: user.username || '',
        marriageYears: user.marriageYears || null,
        age: user.age || null,
        preferredCounselorGender: (user.preferredCounselorGender as PreferredCounselorGender) || 'no_preference',
        preferredLanguages: user.preferredLanguages || [],
        timezone: user.timezone || '',
      });
    }
  }, [user]);

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount({ password: deletePassword }).unwrap();
      toast.success("Account deleted successfully");
    } catch (error) {
      setDeleteError("Incorrect password. Please try again.");
      toast.error("Failed to delete account");
    }
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .nullable(),
    marriageYears: Yup.number()
      .min(0, "Invalid years")
      .nullable()
      .transform((value) => (isNaN(value) ? null : value)),
    age: Yup.number()
      .min(18, "Must be at least 18 years old")
      .nullable()
      .transform((value) => (isNaN(value) ? null : value)),
    preferredCounselorGender: Yup.string()
      .oneOf(['male', 'female', 'no_preference'] as const)
      .nullable(),
    timezone: Yup.string().nullable(),
  });

  const formik = useFormik<ProfileFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const changedValues = Object.entries(values).reduce((acc, [key, value]) => {
          const initialValue = initialValues[key as keyof ProfileFormValues];
          
          if (value !== initialValue) {
            if (key === 'marriageYears' || key === 'age') {
              if (typeof value === 'number') {
                (acc as any)[key] = value;
              }
            } else {
              (acc as any)[key] = value;
            }
          }
          return acc;
        }, {} as UpdateClientProfileData);

        if (Object.keys(changedValues).length === 0) {
          toast.info("No changes to save");
          return;
        }

        await updateProfile(changedValues).unwrap();
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error("Failed to update profile");
      }
    },
  });

  if (authLoading) return <Loader className="animate-spin" />;

  const hasChanges = Object.keys(formik.values).some(
    (key) => formik.values[key as keyof ProfileFormValues] !== initialValues[key as keyof ProfileFormValues]
  );


  return (
    <>
      <ProtectedRoute allowedRoles={['client']}>
        <Heading 
          title="Profile Settings"
          description="Update your MiCounselor profile"
          keywords="profile, settings, counseling, therapy"
        />
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900">
          <DashboardHeader />
          <DashboardSidebar />
          <main className="lg:ml-72 pt-16 p-4 lg:p-6 lg:mt-16 mt-4">
            <div className="max-w-screen-2xl mx-auto space-y-6">
              <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-900/10">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
                  Profile Settings
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Update your personal information and preferences
                </p>
              </div>
              <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-900/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>
                        Update any field you'd like to change
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Alert variant="destructive" className="mb-6 border-red-500/50 bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertTitle className="text-red-600 dark:text-red-400 font-medium">
                      Important Information
                    </AlertTitle>
                    <AlertDescription className="text-red-600/90 dark:text-red-400/90">
                      You can update any field individually. Only changed fields will be saved.
                    </AlertDescription>
                  </Alert>
                  <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Username</label>
                        <Input
                          name="username"
                          value={formik.values.username || ''}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={
                            formik.touched.username && formik.errors.username
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {formik.touched.username && formik.errors.username && (
                          <p className="text-sm text-red-500">{formik.errors.username}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Age</label>
                        <Input
                          type="number"
                          name="age"
                          value={formik.values.age || ''}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={
                            formik.touched.age && formik.errors.age
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {formik.touched.age && formik.errors.age && (
                          <p className="text-sm text-red-500">{formik.errors.age}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Marriage Years</label>
                        <Input
                          type="number"
                          name="marriageYears"
                          value={formik.values.marriageYears || ''}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={
                            formik.touched.marriageYears && formik.errors.marriageYears
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {formik.touched.marriageYears && formik.errors.marriageYears && (
                          <p className="text-sm text-red-500">{formik.errors.marriageYears}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Preferred Counselor Gender
                        </label>
                        <Select
                          name="preferredCounselorGender"
                          value={formik.values.preferredCounselorGender || ''}
                          onValueChange={(value) =>
                            formik.setFieldValue("preferredCounselorGender", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="no_preference">No Preference</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !hasChanges}
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
                          {hasChanges ? 'Save Changes' : 'No Changes'}
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
                          Deleting your account will permanently remove all your data, including session history and personal information.
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
                              onChange={(e) => {
                                setDeletePassword(e.target.value);
                                setDeleteError(""); // Clear error when user types
                              }}
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

export default ProfilePage;