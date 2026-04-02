// src/features/patient/profile/InsuranceInfoForm.tsx
import React, { useState } from 'react';
import { useForm, SubmitHandler, FieldValues, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Building2, Calendar, User, Save, X, Plus, Trash2 } from 'lucide-react';

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
interface InsuranceInfo {
  id?: string;
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  validFrom?: string;
  validUntil?: string;
  coverageAmount?: number;
  deductible?: number;
  copay?: number;
  coinsurance?: number;
  cardUrl?: string;
  primaryHolder?: string;
  primaryHolderId?: string;
  relationshipToHolder?: string;
  insuranceType?: 'private' | 'government' | 'employer' | 'family';
  isPrimary: boolean;
  authorizationRequired?: boolean;
  authorizationCode?: string;
  status?: 'active' | 'expired' | 'pending' | 'cancelled';
}

interface InsuranceInfoFormProps {
  initialData?: InsuranceInfo;
  onSuccess?: () => void;
}

// Validation Schema
const insuranceInfoSchema = z.object({
  provider: z.string()
    .min(2, 'Insurance provider is required')
    .max(100, 'Provider name must be less than 100 characters'),
  
  policyNumber: z.string()
    .min(3, 'Policy number is required')
    .max(50, 'Policy number must be less than 50 characters'),
  
  groupNumber: z.string()
    .max(50, 'Group number must be less than 50 characters')
    .optional()
    .default(''),
  
  validFrom: z.string()
    .optional()
    .default(''),
  
  validUntil: z.string()
    .optional()
    .default(''),
  
  coverageAmount: z.number()
    .min(0, 'Coverage amount must be positive')
    .max(10000000, 'Coverage amount is too high')
    .optional()
    .default(0),
  
  deductible: z.number()
    .min(0, 'Deductible must be positive')
    .max(100000, 'Deductible is too high')
    .optional()
    .default(0),
  
  copay: z.number()
    .min(0, 'Copay must be positive')
    .max(1000, 'Copay is too high')
    .optional()
    .default(0),
  
  coinsurance: z.number()
    .min(0, 'Coinsurance must be between 0 and 100')
    .max(100, 'Coinsurance must be between 0 and 100')
    .optional()
    .default(0),
  
  primaryHolder: z.string()
    .max(100, 'Primary holder name must be less than 100 characters')
    .optional()
    .default(''),
  
  relationshipToHolder: z.string()
    .max(50, 'Relationship must be less than 50 characters')
    .optional()
    .default(''),
  
  insuranceType: z.enum(['private', 'government', 'employer', 'family']).optional().default('private'),
  
  isPrimary: z.boolean().default(false),
  authorizationRequired: z.boolean().default(false),
  authorizationCode: z.string()
    .max(50, 'Authorization code must be less than 50 characters')
    .optional()
    .default(''),
});

type FormData = {
  provider: string;
  policyNumber: string;
  isPrimary: boolean;
  authorizationRequired: boolean;
  groupNumber?: string;
  validFrom?: string;
  validUntil?: string;
  coverageAmount?: number;
  deductible?: number;
  copay?: number;
  coinsurance?: number;
  primaryHolder?: string;
  relationshipToHolder?: string;
  insuranceType?: 'private' | 'government' | 'employer' | 'family';
  authorizationCode?: string;
};

const insuranceTypeOptions = [
  { value: 'private', label: 'Private Insurance' },
  { value: 'government', label: 'Government Insurance' },
  { value: 'employer', label: 'Employer Provided' },
  { value: 'family', label: 'Family Plan' },
];

const relationshipOptions = [
  { value: 'self', label: 'Self' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'child', label: 'Child' },
  { value: 'other', label: 'Other' },
];

export const InsuranceInfoForm: React.FC<InsuranceInfoFormProps> = ({ 
  initialData, 
  onSuccess 
}) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [showGroupNumber, setShowGroupNumber] = useState<boolean>(!!initialData?.groupNumber);
  const [showCoverageDetails, setShowCoverageDetails] = useState<boolean>(
    !!initialData?.coverageAmount || !!initialData?.deductible || !!initialData?.copay || !!initialData?.coinsurance
  );
  const [showHolderDetails, setShowHolderDetails] = useState<boolean>(!!initialData?.primaryHolder);
  const [showAuthorization, setShowAuthorization] = useState<boolean>(!!initialData?.authorizationRequired);

  const form = useForm({
    resolver: zodResolver(insuranceInfoSchema),
    defaultValues: {
      provider: initialData?.provider || '',
      policyNumber: initialData?.policyNumber || '',
      groupNumber: initialData?.groupNumber || '',
      validFrom: initialData?.validFrom || '',
      validUntil: initialData?.validUntil || '',
      coverageAmount: initialData?.coverageAmount || 0,
      deductible: initialData?.deductible || 0,
      copay: initialData?.copay || 0,
      coinsurance: initialData?.coinsurance || 0,
      primaryHolder: initialData?.primaryHolder || '',
      relationshipToHolder: initialData?.relationshipToHolder || '',
      insuranceType: initialData?.insuranceType || 'private',
      isPrimary: initialData?.isPrimary ?? false,
      authorizationRequired: initialData?.authorizationRequired ?? false,
      authorizationCode: initialData?.authorizationCode || '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsPending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Insurance Data:', data);
      onSuccess?.();
      alert('Insurance information saved successfully!');
    } catch (error) {
      console.error('Error saving insurance:', error);
      alert('Failed to save insurance information');
    } finally {
      setIsPending(false);
    }
  };

  const isPrimary = form.watch('isPrimary');
  const authRequired = form.watch('authorizationRequired');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Insurance Information</h3>
            <p className="text-sm text-gray-500">
              Add your health insurance details for faster check-in
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Insurance Provider */}
          <FormField
            control={form.control}
            name="provider"
            render={({ field }: { field: ControllerRenderProps<FormData, "provider"> }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-gray-700 font-medium">
                  Insurance Provider *
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="e.g., Blue Cross, UnitedHealth, etc."
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Policy Number */}
          <FormField
            control={form.control}
            name="policyNumber"
            render={({ field }: { field: ControllerRenderProps<FormData, "policyNumber"> }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Policy Number *
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., POL-12345-678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Insurance Type */}
          <FormField
            control={form.control}
            name="insuranceType"
            render={({ field }: { field: ControllerRenderProps<FormData, "insuranceType"> }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Insurance Type
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {insuranceTypeOptions.map((option) => (
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

          {/* Primary Insurance Checkbox */}
          <FormField
            control={form.control}
            name="isPrimary"
            render={({ field }: { field: ControllerRenderProps<FormData, "isPrimary"> }) => (
              <FormItem className="flex items-center space-x-2 space-y-0 pt-8">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal cursor-pointer">
                  This is my primary insurance
                </FormLabel>
              </FormItem>
            )}
          />

          {/* Valid From */}
          <FormField
            control={form.control}
            name="validFrom"
            render={({ field }: { field: ControllerRenderProps<FormData, "validFrom"> }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Valid From
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="date"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Valid Until */}
          <FormField
            control={form.control}
            name="validUntil"
            render={({ field }: { field: ControllerRenderProps<FormData, "validUntil"> }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Valid Until
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="date"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Group Number - Toggle */}
        {showGroupNumber && (
          <FormField
            control={form.control}
            name="groupNumber"
            render={({ field }: { field: ControllerRenderProps<FormData, "groupNumber"> }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Group Number
                </FormLabel>
                <FormControl>
                  <Input placeholder="Group or plan number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Coverage Details - Toggle */}
        {showCoverageDetails && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Coverage Details</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowCoverageDetails(false)}
                className="text-red-600"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Remove
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="coverageAmount"
                render={({ field }: { field: ControllerRenderProps<FormData, "coverageAmount"> }) => (
                  <FormItem>
                    <FormLabel>Coverage Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 500000"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deductible"
                render={({ field }: { field: ControllerRenderProps<FormData, "deductible"> }) => (
                  <FormItem>
                    <FormLabel>Deductible ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 1000"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="copay"
                render={({ field }: { field: ControllerRenderProps<FormData, "copay"> }) => (
                  <FormItem>
                    <FormLabel>Copay ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 20"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coinsurance"
                render={({ field }: { field: ControllerRenderProps<FormData, "coinsurance"> }) => (
                  <FormItem>
                    <FormLabel>Coinsurance (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 20"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Holder Details - Toggle */}
        {showHolderDetails && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Primary Holder Details</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowHolderDetails(false)}
                className="text-red-600"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Remove
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="primaryHolder"
                render={({ field }: { field: ControllerRenderProps<FormData, "primaryHolder"> }) => (
                  <FormItem>
                    <FormLabel>Holder Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relationshipToHolder"
                render={({ field }: { field: ControllerRenderProps<FormData, "relationshipToHolder"> }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
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
            </div>
          </div>
        )}

        {/* Authorization Section */}
        <FormField
          control={form.control}
          name="authorizationRequired"
          render={({ field }: { field: ControllerRenderProps<FormData, "authorizationRequired"> }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked: boolean) => {
                    field.onChange(checked);
                    if (checked) {
                      setShowAuthorization(true);
                    } else {
                      setShowAuthorization(false);
                      form.setValue('authorizationCode', '');
                    }
                  }}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal cursor-pointer">
                Prior authorization required for this insurance
              </FormLabel>
            </FormItem>
          )}
        />

        {showAuthorization && authRequired && (
          <FormField
            control={form.control}
            name="authorizationCode"
            render={({ field }: { field: ControllerRenderProps<FormData, "authorizationCode"> }) => (
              <FormItem>
                <FormLabel>Authorization Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter authorization code if available" {...field} />
                </FormControl>
                <FormDescription>
                  Required for certain procedures or specialists
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Optional Fields Toggle Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {!showGroupNumber && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowGroupNumber(true)}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Group Number
            </Button>
          )}
          {!showCoverageDetails && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCoverageDetails(true)}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Coverage Details
            </Button>
          )}
          {!showHolderDetails && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowHolderDetails(true)}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Holder Details
            </Button>
          )}
        </div>

        {/* Info Box for Primary Insurance */}
        {isPrimary && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              ✓ This is your primary insurance. It will be used for all medical services by default.
            </p>
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
            {isPending ? 'Saving...' : 'Save Insurance'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InsuranceInfoForm;