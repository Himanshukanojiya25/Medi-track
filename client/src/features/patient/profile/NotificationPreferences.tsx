// src/features/patient/profile/NotificationPreferences.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bell, Mail, Phone, Smartphone, Calendar, Heart, Megaphone, Save, X, MessageCircle } from 'lucide-react';

import { Button } from '../../../components/ui/button/Button';
import { Switch } from '../../../components/ui/switch/Switch';
import { Checkbox } from '../../../components/ui/checkbox/Checkbox';
import { Input } from '../../../components/ui/input/Input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form/Form';
// ✅ Removed Select imports since they are not used in this file

// Types
interface NotificationPreferencesProps {
  initialData?: {
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
      appointmentReminders?: boolean;
      promotionalEmails?: boolean;
      newsletter?: boolean;
      healthTips?: boolean;
      paymentAlerts?: boolean;
      prescriptionUpdates?: boolean;
      medicalReportAlerts?: boolean;
    };
    communication?: string[];
    reminderTiming?: string;
    quietHoursStart?: string;
    quietHoursEnd?: string;
  };
  onSuccess?: () => void;
}

// Validation Schema - All fields required with defaults
const notificationSchema = z.object({
  email: z.boolean(),
  sms: z.boolean(),
  push: z.boolean(),
  whatsapp: z.boolean(),
  appointmentReminders: z.boolean(),
  promotionalEmails: z.boolean(),
  newsletter: z.boolean(),
  healthTips: z.boolean(),
  paymentAlerts: z.boolean(),
  prescriptionUpdates: z.boolean(),
  medicalReportAlerts: z.boolean(),
  communication: z.array(z.string()),
  reminderTiming: z.enum(['immediate', '1hour', '1day', '2days']),
  quietHoursStart: z.string(),
  quietHoursEnd: z.string(),
});

type FormData = z.infer<typeof notificationSchema>;

const reminderTimingOptions = [
  { value: 'immediate', label: 'Immediately' },
  { value: '1hour', label: '1 hour before' },
  { value: '1day', label: '1 day before' },
  { value: '2days', label: '2 days before' },
];

const communicationChannels = [
  { id: 'email', label: 'Email', icon: Mail, description: 'Receive updates via email' },
  { id: 'sms', label: 'SMS', icon: Phone, description: 'Receive updates via text message' },
  { id: 'push', label: 'Push Notifications', icon: Smartphone, description: 'Receive updates on your device' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, description: 'Receive updates on WhatsApp' },
];

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ 
  initialData, 
  onSuccess 
}) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [showQuietHours, setShowQuietHours] = useState<boolean>(
    !!(initialData?.quietHoursStart || initialData?.quietHoursEnd)
  );

  // Create default values with proper types
  const getDefaultValues = (): FormData => ({
    email: initialData?.notifications?.email ?? true,
    sms: initialData?.notifications?.sms ?? false,
    push: initialData?.notifications?.push ?? true,
    whatsapp: false,
    appointmentReminders: initialData?.notifications?.appointmentReminders ?? true,
    promotionalEmails: initialData?.notifications?.promotionalEmails ?? false,
    newsletter: initialData?.notifications?.newsletter ?? false,
    healthTips: initialData?.notifications?.healthTips ?? true,
    paymentAlerts: initialData?.notifications?.paymentAlerts ?? true,
    prescriptionUpdates: initialData?.notifications?.prescriptionUpdates ?? true,
    medicalReportAlerts: initialData?.notifications?.medicalReportAlerts ?? true,
    communication: initialData?.communication ?? ['email', 'push'],
    reminderTiming: (initialData?.reminderTiming === 'immediate' || 
                     initialData?.reminderTiming === '1hour' || 
                     initialData?.reminderTiming === '1day' || 
                     initialData?.reminderTiming === '2days') 
                     ? initialData.reminderTiming 
                     : '1day',
    quietHoursStart: initialData?.quietHoursStart ?? '',
    quietHoursEnd: initialData?.quietHoursEnd ?? '',
  });

  const form = useForm<FormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: getDefaultValues(),
  });

  const onSubmit = async (data: FormData) => {
    setIsPending(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Notification Preferences:', data);
      onSuccess?.();
      alert('Notification preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save notification preferences');
    } finally {
      setIsPending(false);
    }
  };

  const communication = form.watch('communication');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Bell className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
            <p className="text-sm text-gray-500">
              Choose how and when you want to receive updates
            </p>
          </div>
        </div>

        {/* Communication Channels Section */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Communication Channels
          </h4>
          <FormField
            control={form.control}
            name="communication"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {communicationChannels.map((channel) => {
                    const Icon = channel.icon;
                    const isChecked = field.value?.includes(channel.id);
                    return (
                      <label
                        key={channel.id}
                        className={`
                          flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all
                          ${isChecked 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              field.onChange([...field.value, channel.id]);
                            } else {
                              field.onChange(field.value.filter((v: string) => v !== channel.id));
                            }
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-600" />
                            <span className="font-medium text-gray-700">{channel.label}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{channel.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Notification Categories */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            What to Notify
          </h4>
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="appointmentReminders"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <FormLabel className="font-medium">Appointment Reminders</FormLabel>
                    <FormDescription className="text-xs">
                      Get reminders about upcoming appointments
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
              name="prescriptionUpdates"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <FormLabel className="font-medium">Prescription Updates</FormLabel>
                    <FormDescription className="text-xs">
                      Notify when prescriptions are ready or refill needed
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
              name="medicalReportAlerts"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <FormLabel className="font-medium">Medical Reports</FormLabel>
                    <FormDescription className="text-xs">
                      Alert when new reports are available
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
              name="paymentAlerts"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <FormLabel className="font-medium">Payment Alerts</FormLabel>
                    <FormDescription className="text-xs">
                      Notify about payments, invoices, and billing
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

        {/* Marketing Preferences */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <Megaphone className="w-4 h-4" />
            Marketing & Updates
          </h4>
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="promotionalEmails"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <FormLabel className="font-medium">Promotional Emails</FormLabel>
                    <FormDescription className="text-xs">
                      Special offers, discounts, and promotions
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
              name="newsletter"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <FormLabel className="font-medium">Newsletter</FormLabel>
                    <FormDescription className="text-xs">
                      Monthly newsletter with health tips and updates
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
              name="healthTips"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <FormLabel className="font-medium">Health Tips</FormLabel>
                    <FormDescription className="text-xs">
                      Weekly health and wellness tips
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

        {/* Reminder Timing - Using Radio buttons instead of Select for better UX */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Reminder Timing
          </h4>
          <FormField
            control={form.control}
            name="reminderTiming"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-wrap gap-4">
                  {reminderTimingOptions.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value={option.value}
                        checked={field.value === option.value}
                        onChange={() => field.onChange(option.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                <FormDescription>
                  When to send appointment reminders
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Quiet Hours */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Quiet Hours
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowQuietHours(!showQuietHours)}
            >
              {showQuietHours ? 'Remove' : 'Add Quiet Hours'}
            </Button>
          </div>
          
          {showQuietHours && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <FormField
                control={form.control}
                name="quietHoursStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quietHoursEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {showQuietHours && (
            <FormDescription className="text-xs">
              No notifications will be sent during quiet hours
            </FormDescription>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900">
                Important Notifications
              </h4>
              <p className="text-xs text-blue-800 mt-1">
                Critical notifications like appointment cancellations and emergency alerts
                will always be sent regardless of your preferences.
              </p>
            </div>
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
            {isPending ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NotificationPreferences;