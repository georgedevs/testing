import React, { useState, useCallback } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Mail, Copy, Check, Loader2, Users, Plus, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { useGenerateCounselorLinkMutation } from '@/redux/feautures/auth/authApi'

const CounselorManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')
  const [generateLink, { isLoading }] = useGenerateCounselorLinkMutation()

  const handleOpenChange = useCallback((open:any) => {
    setDialogOpen(open)
    if (!open) {
      formik.resetForm()
      setGeneratedLink('')
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      counselorEmail: '',
    },
    validationSchema: Yup.object({
      counselorEmail: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
    onSubmit: async (values) => {
      try {
        const result = await generateLink(values).unwrap()
        setGeneratedLink(result.registrationLink)
        toast.success('Registration link generated successfully')
      } catch (error) {
        toast.error('Failed to generate registration link')
        console.error('Error:', error)
      }
    },
  })

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
            <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add New Counselor</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Generate registration links for new counselors</p>
          </div>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20">
              <Plus className="w-4 h-4 mr-2" />
              Generate Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Generate Counselor Registration Link
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
              <div>
                <label htmlFor="counselorEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Counselor's Email
                </label>
                <div className="relative">
                  <Input
                    id="counselorEmail"
                    name="counselorEmail"
                    type="email"
                    placeholder="counselor@example.com"
                    value={formik.values.counselorEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`pl-4 pr-10 py-2 ${
                      formik.touched.counselorEmail && formik.errors.counselorEmail 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
                    }`}
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {formik.touched.counselorEmail && formik.errors.counselorEmail && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.counselorEmail}</p>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : 'Generate Link'}
              </Button>
            </form>

            {generatedLink && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Registration Link:</p>
                <div className="flex items-center gap-2 relative">
                  <Input 
                    value={generatedLink} 
                    readOnly 
                    className="pr-12"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={copyToClipboard}
                    className="absolute right-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default CounselorManagement