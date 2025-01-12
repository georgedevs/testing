import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, Key, Loader2, ChevronDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { toast } from 'sonner';
import { useUpdatePasswordMutation } from '@/redux/feautures/auth/authApi';

const CollapsiblePasswordForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: async (values) => {
      try {
        await updatePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }).unwrap();
        
        toast.success('Password updated successfully');
        formik.resetForm();
        setIsOpen(false);
      } catch (error) {
        toast.error('Failed to update password');
      }
    },
  });

  const togglePasswordVisibility = (field:any) => {
    if (field === 'old') {
      setShowOldPassword(!showOldPassword);
    } else {
      setShowNewPassword(!showNewPassword);
    }
  };

  return (
    <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-900/10">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <CardTitle>Update Password</CardTitle>
                  <CardDescription>
                    Change your account password
                  </CardDescription>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <div className="relative">
                  <Input
                    type={showOldPassword ? 'text' : 'password'}
                    name="oldPassword"
                    value={formik.values.oldPassword}
                    onChange={formik.handleChange}
                    className={formik.touched.oldPassword && formik.errors.oldPassword ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => togglePasswordVisibility('old')}
                  >
                    {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formik.touched.oldPassword && formik.errors.oldPassword && (
                  <p className="text-sm text-red-500">{formik.errors.oldPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    className={formik.touched.newPassword && formik.errors.newPassword ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <p className="text-sm text-red-500">{formik.errors.newPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  className={formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : ""}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-sm text-red-500">{formik.errors.confirmPassword}</p>
                )}
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
                  'Update Password'
                )}
              </Button>
            </form>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CollapsiblePasswordForm;