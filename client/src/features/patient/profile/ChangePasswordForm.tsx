// src/features/patient/profile/ChangePasswordForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Shield, CheckCircle, XCircle, Save, Lock } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} 
from '../../../components/ui/form';

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

// Password validation schema
const passwordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be less than 50 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  requirements: {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSuccess }) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'Very Weak',
    color: 'red',
    requirements: {
      minLength: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const watchNewPassword = form.watch('newPassword');

  // Calculate password strength
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const requirements = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    let score = 0;
    if (requirements.minLength) score++;
    if (requirements.uppercase) score++;
    if (requirements.lowercase) score++;
    if (requirements.number) score++;
    if (requirements.special) score++;

    let label = '';
    let color = '';

    switch (score) {
      case 0:
      case 1:
        label = 'Very Weak';
        color = 'red';
        break;
      case 2:
        label = 'Weak';
        color = 'orange';
        break;
      case 3:
        label = 'Fair';
        color = 'yellow';
        break;
      case 4:
        label = 'Good';
        color = 'blue';
        break;
      case 5:
        label = 'Strong';
        color = 'green';
        break;
      default:
        label = 'Very Weak';
        color = 'red';
    }

    return { score, label, color, requirements };
  };

  // Update password strength when password changes
  React.useEffect(() => {
    if (watchNewPassword) {
      setPasswordStrength(calculatePasswordStrength(watchNewPassword));
    } else {
      setPasswordStrength({
        score: 0,
        label: 'Very Weak',
        color: 'red',
        requirements: {
          minLength: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
        },
      });
    }
  }, [watchNewPassword]);

  const onSubmit = async (data: PasswordFormData) => {
    setIsPending(true);
    try {
      // API call will go here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Password change data:', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      form.reset();
      onSuccess?.();
      alert('Password changed successfully!');
    } catch (error: any) {
      console.error('Error changing password:', error);
      alert(error?.message || 'Failed to change password. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Password */}
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Current Password *
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter your current password"
                    className="pl-10 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* New Password */}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                New Password *
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    className="pl-10 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormDescription>
                Password must be at least 8 characters with uppercase, lowercase, number, and special character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Strength Indicator */}
        {watchNewPassword && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Password Strength:</span>
              <span className={`text-sm font-medium text-${passwordStrength.color}-600`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 bg-${passwordStrength.color}-500`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <RequirementCheck
                met={passwordStrength.requirements.minLength}
                text="At least 8 characters"
              />
              <RequirementCheck
                met={passwordStrength.requirements.uppercase}
                text="One uppercase letter"
              />
              <RequirementCheck
                met={passwordStrength.requirements.lowercase}
                text="One lowercase letter"
              />
              <RequirementCheck
                met={passwordStrength.requirements.number}
                text="One number"
              />
              <RequirementCheck
                met={passwordStrength.requirements.special}
                text="One special character"
              />
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Confirm New Password *
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    className="pl-10 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Security Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                Security Tips
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Never share your password with anyone</li>
                <li>• Use a unique password not used on other sites</li>
                <li>• Consider using a password manager</li>
                <li>• Enable two-factor authentication for extra security</li>
              </ul>
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
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="px-6 bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isPending ? 'Changing...' : 'Change Password'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Requirement Check Component
const RequirementCheck: React.FC<{ met: boolean; text: string }> = ({ met, text }) => {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      {met ? (
        <CheckCircle className="w-3.5 h-3.5 text-green-600" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-gray-400" />
      )}
      <span className={met ? 'text-gray-700' : 'text-gray-500'}>{text}</span>
    </div>
  );
};

export default ChangePasswordForm;