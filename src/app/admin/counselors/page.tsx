"use client"
import React, { useState } from 'react'
import Heading from '@/components/Heading'
import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Users, UserPlus, Clock } from 'lucide-react'
import ActiveCounselors from '@/components/admin/ActiveCounselors'
import PendingCounselors from '@/components/admin/PendingCounselors'
import CounselorManagement from '@/components/admin/CounselorManagement'

const CounselorsPage = () => {
  return (
    <>
      <ProtectedRoute allowedRoles={['admin']}>
        <Heading 
          title="Counselor Management"
          description="Manage counselors and generate registration links"
          keywords="admin, counselors, management, registration"
        />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <DashboardHeader />
          <AdminSidebar />
          <main className="lg:ml-72 p-4 lg:p-6 lg:mt-16 mt-4">
            <div className="max-w-screen-2xl mx-auto">
              <div className="p-6 lg:p-8 rounded-xl lg:rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-900/10">
                <div className="mb-8">
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Counselor Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Manage your counseling team and review applications
                  </p>
                </div>

                <CounselorManagement />
                
                <Separator className="my-8" />
                
                <Tabs defaultValue="active" className="mt-8">
                  <TabsList className="mb-8">
                    <TabsTrigger value="active" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Active Counselors
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Pending Applications
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active" className="mt-6">
                    <ActiveCounselors />
                  </TabsContent>
                  
                  <TabsContent value="pending" className="mt-6">
                    <PendingCounselors />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    </>
  )
}

export default CounselorsPage