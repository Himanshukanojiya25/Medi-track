// src/features/patient/profile/EmergencyContactForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, Phone, Mail, User, Save, X, Plus } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
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

// Types
interface EmergencyContact {
  id?: string;
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  isPrimary?: boolean;
  priority?: number;
  consentToContact?: boolean;
}

interface EmergencyContactFormProps {
  initialData?: EmergencyContact;
  onSuccess?: () => void;
}

// Validation Schema - Fixed: all fields optional except required ones
const emergencyContactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  relationship: z.string()
    .min(2, 'Relationship is required')
    .max(50, 'Relationship must be less than 50 characters'),
  
  phone: z.string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,3}[)]?[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,4}$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits'),
  
  alternatePhone: z.string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,3}[)]?[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,4}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  
  email: z.string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  
  address: z.string()
    .max(200, 'Address must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  
  isPrimary: z.boolean().optional().default(false),
  consentToContact: z.boolean().optional().default(true),
});

type FormData = z.infer<typeof emergencyContactSchema>;

// Relationship options
const relationshipOptions = [
  { value: 'parent', label: 'Parent' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'partner', label: 'Partner' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'child', label: 'Child' },
  { value: 'relative', label: 'Relative' },
  { value: 'friend', label: 'Friend' },
  { value: 'guardian', label: 'Guardian' },
  { value: 'other', label: 'Other' },
];

export const EmergencyContactForm: React.FC<EmergencyContactFormProps> = ({ 
  initialData, 
  onSuccess 
}) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [showAlternatePhone, setShowAlternatePhone] = useState<boolean>(!!initialData?.alternatePhone);
  const [showEmail, setShowEmail] = useState<boolean>(!!initialData?.email);
  const [showAddress, setShowAddress] = useState<boolean>(!!initialData?.address);

  const form = useForm({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      name: initialData?.name || '',
      relationship: initialData?.relationship || '',
      phone: initialData?.phone || '',
      alternatePhone: initialData?.alternatePhone || '',
      email: initialData?.email || '',
      address: initialData?.address || '',
      isPrimary: initialData?.isPrimary || false,
      consentToContact: initialData?.consentToContact !== undefined ? initialData.consentToContact : true,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsPending(true);
    try {
      // API call will go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Emergency Contact Data:', data);
      
      onSuccess?.();
      alert('Emergency contact saved successfully!');
    } catch (error) {
      console.error('Error saving emergency contact:', error);
      alert('Failed to save emergency contact. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const isPrimary = form.watch('isPrimary');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header with icon */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-2 bg-red-100 rounded-lg">
            <Heart className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
            <p className="text-sm text-gray-500">
              This contact will be notified in case of medical emergency
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: any }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-gray-700 font-medium">
                  Full Name *
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Enter emergency contact's full name"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Relationship */}
          <FormField
            control={form.control}
            name="relationship"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Relationship *
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {relationshipOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Primary Contact Checkbox */}
          <FormField
            control={form.control}
            name="isPrimary"
            render={({ field }: { field: any }) => (
              <FormItem className="flex items-center space-x-2 space-y-0 pt-8">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal cursor-pointer">
                  Make this my primary emergency contact
                </FormLabel>
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Phone Number *
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="tel"
                      placeholder="+1 234 567 8900"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alternate Phone - Toggle */}
          {showAlternatePhone && (
            <FormField
              control={form.control}
              name="alternatePhone"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Alternate Phone
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="Alternate phone number"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Email - Toggle */}
          {showEmail && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="contact@example.com"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Address - Toggle */}
          {showAddress && (
            <FormField
              control={form.control}
              name="address"
              render={({ field }: { field: any }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-gray-700 font-medium">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Optional Fields Toggle Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {!showAlternatePhone && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAlternatePhone(true)}
              className="text-gray-600"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Alternate Phone
            </Button>
          )}
          {!showEmail && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowEmail(true)}
              className="text-gray-600"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Email
            </Button>
          )}
          {!showAddress && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddress(true)}
              className="text-gray-600"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Address
            </Button>
          )}
        </div>

        {/* Consent Checkbox */}
        <FormField
          control={form.control}
          name="consentToContact"
          render={({ field }: { field: any }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div>
                <FormLabel className="text-sm font-normal cursor-pointer">
                  I consent to contact this person in case of emergency
                </FormLabel>
                <FormDescription className="text-xs">
                  This contact will be notified only during medical emergencies
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Info Box */}
        {isPrimary && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900">
                  Primary Emergency Contact
                </h4>
                <p className="text-xs text-blue-800 mt-1">
                  This contact will be the first person notified in case of emergency. 
                  Make sure their contact details are always up to date.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            <Save className="w-4 h-4 mr-2" />
            {isPending ? 'Saving...' : 'Save Emergency Contact'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmergencyContactForm;