// src/features/patient/profile/ProfileScreen.tsx
console.log('🔥🔥🔥 PROFILE SCREEN FILE LOADED 🔥🔥🔥');

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { 
  User, 
  Shield, 
  Bell, 
  Heart, 
  CreditCard, 
  AlertTriangle,
  ChevronRight,
  LogOut,
  UserCircle
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { useAuth } from '../../../hooks/auth/useAuth';
import { usePatientProfile } from '../hooks/usePatientProfile';

import { PersonalInfoForm } from './PersonalInfoForm';
import { ProfilePictureUpload } from './ProfilePictureUpload';
import { ChangePasswordForm } from './ChangePasswordForm';
import { EmergencyContactForm } from './EmergencyContactForm';
import { InsuranceInfoForm } from './InsuranceInfoForm';
import { NotificationPreferences } from './NotificationPreferences';
import { PrivacySettings } from './PrivacySettings';
import { DeleteAccountModal } from './DeleteAccountModal';

import type { Patient } from '../../../types/patient/patient.types';

interface ProfileScreenProps {
  className?: string;
}

// Helper functions
const formatBloodGroupForForm = (bloodGroup?: string): string => {
  if (!bloodGroup) return 'O+';
  const mapping: Record<string, string> = {
    'A_POSITIVE': 'A+', 'A_NEGATIVE': 'A-', 'B_POSITIVE': 'B+', 'B_NEGATIVE': 'B-',
    'O_POSITIVE': 'O+', 'O_NEGATIVE': 'O-', 'AB_POSITIVE': 'AB+', 'AB_NEGATIVE': 'AB-',
    'UNKNOWN': 'O+'
  };
  return mapping[bloodGroup] || 'O+';
};

const formatGenderForForm = (gender?: string): string => {
  if (!gender) return 'prefer_not_to_say';
  const mapping: Record<string, string> = {
    'MALE': 'male', 'FEMALE': 'female', 'OTHER': 'other', 'PREFER_NOT_TO_SAY': 'prefer_not_to_say'
  };
  return mapping[gender] || 'prefer_not_to_say';
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ className }) => {
  console.log('🔵🔵🔵 PROFILE SCREEN COMPONENT MOUNTING 🔵🔵🔵');
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const { profile, isLoading: isProfileLoading, refetch } = usePatientProfile();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showContent, setShowContent] = useState(false);

  // Force show content after 2 seconds even if loading
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Force showing content after timeout');
      setShowContent(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = isAuthLoading || isProfileLoading;
  
  console.log('Debug - user:', user);
  console.log('Debug - isAuthenticated:', isAuthenticated);
  console.log('Debug - isAuthLoading:', isAuthLoading);
  console.log('Debug - profile:', profile);
  console.log('Debug - isProfileLoading:', isProfileLoading);
  console.log('Debug - isLoading:', isLoading);
  console.log('Debug - showContent:', showContent);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileUpdate = async () => {
    await refetch();
    queryClient.invalidateQueries({ queryKey: ['patient-profile'] });
  };

  const personalInfoData = profile ? {
    fullName: profile.name,
    email: profile.email,
    phone: profile.phone,
    dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : new Date(),
    gender: formatGenderForForm(profile.gender),
    bloodGroup: formatBloodGroupForForm(profile.bloodGroup),
    address: profile.address ? {
      street: profile.address.street,
      city: profile.address.city,
      state: profile.address.state,
      zipCode: profile.address.postalCode,
      country: profile.address.country,
    } : {
      street: '', city: '', state: '', zipCode: '', country: '',
    },
    bio: '',
  } : undefined;

  const primaryEmergencyContact = profile?.emergencyContacts?.find(contact => contact.isPrimary) || profile?.emergencyContacts?.[0];
  const primaryInsurance = profile?.insurance?.find(ins => ins.isPrimary) || profile?.insurance?.[0];

  // Force show content after timeout or when data is ready
  if ((isLoading || !profile) && !showContent) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Display name and email from either user or profile
  const displayName = profile?.name || user?.name || 'Patient';
  const displayEmail = profile?.email || user?.email || '';

  return (
    <div className={`container mx-auto px-4 py-8 max-w-7xl ${className || ''}`}>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your personal information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  {profile?.profilePicture ? (
                    <img 
                      src={profile.profilePicture} 
                      alt={displayName} 
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center border-4 border-blue-500">
                      <UserCircle className="w-12 h-12 text-blue-500" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg">{displayName}</h3>
                <p className="text-sm text-gray-500">{displayEmail}</p>
              </div>

              <Separator className="my-4" />

              <nav className="space-y-2">
                {[
                  { id: 'personal', label: 'Personal Info', icon: User },
                  { id: 'security', label: 'Security', icon: Shield },
                  { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
                  { id: 'insurance', label: 'Insurance', icon: CreditCard },
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                  { id: 'privacy', label: 'Privacy', icon: Heart },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                      ${activeTab === item.id 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === item.id ? 'translate-x-1' : ''}`} />
                  </button>
                ))}
              </nav>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-6">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and profile photo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ProfilePictureUpload 
                    currentAvatar={profile?.profilePicture} 
                    onUploadSuccess={handleProfileUpdate}
                  />
                  <Separator />
                  <PersonalInfoForm 
                    initialData={personalInfoData}
                    onSuccess={handleProfileUpdate}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Change your password and manage security preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChangePasswordForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                  <CardDescription>Add emergency contact information for critical situations</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmergencyContactForm 
                    initialData={primaryEmergencyContact}
                    onSuccess={handleProfileUpdate}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insurance">
              <Card>
                <CardHeader>
                  <CardTitle>Insurance Information</CardTitle>
                  <CardDescription>Manage your health insurance details</CardDescription>
                </CardHeader>
                <CardContent>
                  <InsuranceInfoForm 
                    initialData={primaryInsurance}
                    onSuccess={handleProfileUpdate}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what updates you want to receive</CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationPreferences 
                    initialData={profile?.preferences}
                    onSuccess={handleProfileUpdate}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your data and privacy preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <PrivacySettings 
                    initialData={profile?.preferences?.privacy}
                    onSuccess={handleProfileUpdate}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <DeleteAccountModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={() => navigate('/')}
      />
    </div>
  );
};

export default ProfileScreen;