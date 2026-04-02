// src/features/patient/profile/PrivacySettings.tsx
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Users, 
  FileText, 
  Activity, 
  Download, 
  Trash2, 
  Save, 
  X,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Checkbox } from '../../../components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

// Types
interface PrivacySettingsData {
  shareWithDoctors: boolean;
  shareWithHospitals: boolean;
  shareForResearch: boolean;
  shareWithInsurance: boolean;
  shareWithPharmacy: boolean;
  dataRetentionDays: number;
  allowDataExport: boolean;
  allowThirdParty: boolean;
  anonymizedAnalytics: boolean;
  showProfileToOthers: boolean;
  showMedicalHistory: boolean;
  showPrescriptions: boolean;
  showAppointments: boolean;
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  deviceManagement: boolean;
}

interface PrivacySettingsProps {
  initialData?: {
    shareWithDoctors?: boolean;
    shareWithHospitals?: boolean;
    shareForResearch?: boolean;
    privacy?: {
      shareWithDoctors?: boolean;
      shareWithHospitals?: boolean;
      shareForResearch?: boolean;
      dataRetentionDays?: number;
    };
  };
  onSuccess?: () => void;
}

// Validation Schema
const privacySchema = z.object({
  shareWithDoctors: z.boolean(),
  shareWithHospitals: z.boolean(),
  shareForResearch: z.boolean(),
  shareWithInsurance: z.boolean(),
  shareWithPharmacy: z.boolean(),
  dataRetentionDays: z.number().min(30, 'Minimum 30 days').max(730, 'Maximum 2 years'),
  allowDataExport: z.boolean(),
  allowThirdParty: z.boolean(),
  anonymizedAnalytics: z.boolean(),
  showProfileToOthers: z.boolean(),
  showMedicalHistory: z.boolean(),
  showPrescriptions: z.boolean(),
  showAppointments: z.boolean(),
  twoFactorAuth: z.boolean(),
  loginAlerts: z.boolean(),
  deviceManagement: z.boolean(),
});

type FormData = z.infer<typeof privacySchema>;

const retentionOptions = [
  { value: 30, label: '30 days' },
  { value: 90, label: '3 months' },
  { value: 180, label: '6 months' },
  { value: 365, label: '1 year' },
  { value: 730, label: '2 years' },
];

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({ 
  initialData, 
  onSuccess 
}) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [showDataExportDialog, setShowDataExportDialog] = useState<boolean>(false);
  const [showDeleteDataDialog, setShowDeleteDataDialog] = useState<boolean>(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');

  const form = useForm<FormData>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      shareWithDoctors: initialData?.shareWithDoctors ?? true,
      shareWithHospitals: initialData?.shareWithHospitals ?? true,
      shareForResearch: initialData?.shareForResearch ?? false,
      shareWithInsurance: true,
      shareWithPharmacy: true,
      dataRetentionDays: initialData?.privacy?.dataRetentionDays ?? 365,
      allowDataExport: true,
      allowThirdParty: false,
      anonymizedAnalytics: true,
      showProfileToOthers: false,
      showMedicalHistory: false,
      showPrescriptions: false,
      showAppointments: false,
      twoFactorAuth: false,
      loginAlerts: true,
      deviceManagement: true,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsPending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Privacy Settings:', data);
      onSuccess?.();
      alert('Privacy settings saved successfully!');
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      alert('Failed to save privacy settings');
    } finally {
      setIsPending(false);
    }
  };

  const handleDataExport = async () => {
    setExportStatus('exporting');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setExportStatus('success');
      setTimeout(() => {
        setShowDataExportDialog(false);
        setExportStatus('idle');
      }, 1500);
      alert('Your data export has been prepared and will be sent to your email');
    } catch (error) {
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 2000);
    }
  };

  const handleDataDeletion = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowDeleteDataDialog(false);
      alert('Your data deletion request has been submitted. You will receive a confirmation email.');
    } catch (error) {
      alert('Failed to submit deletion request');
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
              <p className="text-sm text-gray-500">
                Control how your data is shared and protected
              </p>
            </div>
          </div>

          {/* Data Sharing Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Data Sharing Preferences
            </h4>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="shareWithDoctors"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <FormLabel className="font-medium">Share with My Doctors</FormLabel>
                      <FormDescription className="text-xs">
                        Allow your doctors to access your medical history
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shareWithHospitals"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <FormLabel className="font-medium">Share with Hospitals</FormLabel>
                      <FormDescription className="text-xs">
                        Allow hospitals to access your medical records
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shareWithInsurance"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <FormLabel className="font-medium">Share with Insurance</FormLabel>
                      <FormDescription className="text-xs">
                        Share information with your insurance provider
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shareForResearch"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <FormLabel className="font-medium">Share for Medical Research</FormLabel>
                      <FormDescription className="text-xs">
                        Contribute anonymously to medical research
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowThirdParty"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <FormLabel className="font-medium">Third-Party Integrations</FormLabel>
                      <FormDescription className="text-xs">
                        Allow integration with third-party health apps
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Profile Visibility Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Profile Visibility
            </h4>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="showProfileToOthers"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <FormLabel className="font-medium">Show Profile to Others</FormLabel>
                      <FormDescription className="text-xs">
                        Allow other patients to view your basic profile
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showMedicalHistory"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <FormLabel className="font-medium">Show Medical History</FormLabel>
                      <FormDescription className="text-xs">
                        Allow healthcare providers to see your full history
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Security Settings
            </h4>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="twoFactorAuth"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <FormLabel className="font-medium">Two-Factor Authentication</FormLabel>
                      <FormDescription className="text-xs">
                        Add an extra layer of security to your account
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loginAlerts"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <FormLabel className="font-medium">Login Alerts</FormLabel>
                      <FormDescription className="text-xs">
                        Get notified when someone logs into your account
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deviceManagement"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <FormLabel className="font-medium">Device Management</FormLabel>
                      <FormDescription className="text-xs">
                        Manage and track devices accessing your account
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Data Retention */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Data Management
            </h4>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="dataRetentionDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Retention Period</FormLabel>
                    <Select 
                      onValueChange={(val) => field.onChange(parseInt(val))} 
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full md:w-64">
                          <SelectValue placeholder="Select retention period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {retentionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How long we keep your medical data after account inactivity
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anonymizedAnalytics"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <FormLabel className="font-medium">Anonymous Analytics</FormLabel>
                      <FormDescription className="text-xs">
                        Help us improve by sharing anonymous usage data
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Data Actions */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Your Data
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDataExportDialog(true)}
                className="justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Download My Data
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteDataDialog(true)}
                className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Request Data Deletion
              </Button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isPending}
            >
              <X className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button type="submit" disabled={isPending}>
              <Save className="w-4 h-4 mr-2" />
              {isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Data Export Dialog */}
      <Dialog open={showDataExportDialog} onOpenChange={setShowDataExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Your Data</DialogTitle>
            <DialogDescription>
              Download a copy of all your medical records, prescriptions, and personal information.
            </DialogDescription>
          </DialogHeader>
          
          {exportStatus === 'idle' && (
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-600">
                Your data will be exported in JSON and PDF formats. This may take a few moments.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Personal information
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Medical history and records
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Prescriptions and reports
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Appointment history
                </li>
              </ul>
            </div>
          )}

          {exportStatus === 'exporting' && (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Preparing your data export...</p>
            </div>
          )}

          {exportStatus === 'success' && (
            <div className="py-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-sm text-gray-600">Your data export has been prepared!</p>
              <p className="text-xs text-gray-500 mt-1">Check your email for the download link</p>
            </div>
          )}

          {exportStatus === 'error' && (
            <div className="py-8 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-sm text-red-600">Failed to export data. Please try again.</p>
            </div>
          )}

          <DialogFooter>
            {exportStatus === 'idle' && (
              <>
                <Button variant="outline" onClick={() => setShowDataExportDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleDataExport}>
                  Start Export
                </Button>
              </>
            )}
            {exportStatus !== 'idle' && (
              <Button variant="outline" onClick={() => setShowDataExportDialog(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Deletion Dialog */}
      <Dialog open={showDeleteDataDialog} onOpenChange={setShowDeleteDataDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Request Data Deletion</DialogTitle>
            <DialogDescription>
              This action is irreversible. All your data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                ⚠️ Warning: Deleting your data will permanently remove all your medical records, 
                prescriptions, appointment history, and personal information. This action cannot be undone.
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Please confirm that you want to request deletion of all your personal data.
              You will receive a confirmation email with further instructions.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDataDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDataDeletion}>
              Request Deletion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrivacySettings;