import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Heart,
  Activity,
  Sparkles,
  UserCheck,
  Building2,
  Stethoscope,
  XCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService, { RegisterRequest } from '../../../../services/auth/auth.service';
import { useAuthStore } from '../../../../stores/useAuthStore';
import {
  validatePasswordStrength,
  validateAge,
  isValidEmail,
  isValidPhoneNumber,
  sanitizeInput,
  getRoleDisplayName,
  getRoleIcon,
  getRoleDescription,
  PasswordValidationResult,
  AgeValidationResult,
} from '../utils';

// ============================================================================
// TYPES
// ============================================================================

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  role: 'PATIENT' | 'DOCTOR' | 'HOSPITAL_ADMIN';
  agreeToTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  role?: string;
  agreeToTerms?: string;
}

interface RegisterFormProps {
  onSuccess?: (user: any) => void;
  onError?: (error: Error) => void;
  redirectOnSuccess?: boolean;
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ROLES = [
  { 
    id: 'PATIENT' as const, 
    label: 'Patient', 
    icon: User, 
    description: 'Book appointments, manage health records, track wellness',
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    hoverColor: 'hover:border-blue-300',
    iconColor: 'text-blue-600',
    selectedBg: 'bg-blue-100',
    selectedBorder: 'border-blue-500'
  },
  { 
    id: 'DOCTOR' as const, 
    label: 'Doctor', 
    icon: Stethoscope, 
    description: 'Manage patients, write prescriptions, provide care',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    hoverColor: 'hover:border-green-300',
    iconColor: 'text-green-600',
    selectedBg: 'bg-green-100',
    selectedBorder: 'border-green-500'
  },
  { 
    id: 'HOSPITAL_ADMIN' as const, 
    label: 'Hospital Admin', 
    icon: Building2, 
    description: 'Manage hospital operations, staff, patient services',
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    hoverColor: 'hover:border-purple-300',
    iconColor: 'text-purple-600',
    selectedBg: 'bg-purple-100',
    selectedBorder: 'border-purple-500'
  },
];

const PASSWORD_REQUIREMENTS = [
  { key: 'minLength', label: 'At least 8 characters', regex: /.{8,}/ },
  { key: 'uppercase', label: 'One uppercase letter', regex: /[A-Z]/ },
  { key: 'lowercase', label: 'One lowercase letter', regex: /[a-z]/ },
  { key: 'number', label: 'One number', regex: /\d/ },
  { key: 'special', label: 'One special character (!@#$%^&*)', regex: /[!@#$%^&*(),.?":{}|<>]/, optional: true },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onError,
  redirectOnSuccess = true,
  className = '',
}) => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  // Form State
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    role: 'PATIENT',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordValidationResult | null>(null);
  const [ageValidation, setAgeValidation] = useState<AgeValidationResult | null>(null);

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  const validateField = useCallback((name: string, value: any): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 50) return 'Name must be less than 50 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        return undefined;

      case 'email':
        if (!value) return 'Email is required';
        if (!isValidEmail(value)) return 'Please enter a valid email address';
        return undefined;

      case 'phone':
        if (!value) return 'Phone number is required';
        if (!isValidPhoneNumber(value)) return 'Please enter a valid 10-digit phone number';
        return undefined;

      case 'password':
        if (!value) return 'Password is required';
        const strength = validatePasswordStrength(value);
        if (!strength.isValid) return strength.errors[0];
        return undefined;

      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return undefined;

      case 'dateOfBirth':
        if (!value) return 'Date of birth is required';
        const ageResult = validateAge(value);
        if (!ageResult.isValid) return ageResult.errors[0];
        return undefined;

      case 'role':
        if (!value) return 'Please select a role';
        return undefined;

      case 'agreeToTerms':
        if (!value) return 'You must agree to the terms and conditions';
        return undefined;

      default:
        return undefined;
    }
  }, [formData.password]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof RegisterFormData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Mark as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Clear field error
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Real-time validation
    const error = validateField(name, newValue);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Password strength validation
    if (name === 'password') {
      setPasswordStrength(validatePasswordStrength(value));
    }
    
    // Age validation
    if (name === 'dateOfBirth') {
      setAgeValidation(validateAge(value));
    }
    
    setApiError(null);
  };

  const handleRoleSelect = (role: 'PATIENT' | 'DOCTOR' | 'HOSPITAL_ADMIN') => {
    setFormData(prev => ({ ...prev, role }));
    setTouched(prev => ({ ...prev, role: true }));
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof RegisterFormData]);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      const registerData: RegisterRequest = {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        name: sanitizeInput(formData.name.trim()),
        phone: formData.phone.replace(/\s/g, ''),
        dateOfBirth: formData.dateOfBirth,
        role: formData.role,
      };
      
      const user = await AuthService.register(registerData);
      const accessToken = AuthService.getAccessToken();
      
      if (accessToken) {
        login(user, accessToken);
      }
      
      setSuccess(true);
      onSuccess?.(user);
      
      if (redirectOnSuccess) {
        setTimeout(() => {
          switch (formData.role) {
            case 'PATIENT':
              navigate('/patient/dashboard');
              break;
            case 'DOCTOR':
              navigate('/doctor/dashboard');
              break;
            case 'HOSPITAL_ADMIN':
              navigate('/hospital-admin/dashboard');
              break;
            default:
              navigate('/dashboard');
          }
        }, 1500);
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        if (Array.isArray(serverErrors)) {
          const newErrors: FormErrors = {};
          serverErrors.forEach((err: any) => {
            if (err.field === 'email') newErrors.email = err.message;
            if (err.field === 'phone') newErrors.phone = err.message;
            if (err.field === 'name') newErrors.name = err.message;
          });
          setErrors(newErrors);
          if (Object.keys(newErrors).length === 0) {
            errorMessage = 'Registration failed. Please check your details.';
          }
        }
      }
      
      setApiError(errorMessage);
      onError?.(new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  const getFieldError = (fieldName: keyof FormErrors): string | undefined => {
    return touched[fieldName] ? errors[fieldName] : undefined;
  };

  const getInputClassName = (fieldName: keyof FormErrors, hasIcon: boolean = true): string => {
    const hasError = !!getFieldError(fieldName);
    const baseClasses = `w-full ${hasIcon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all`;
    const errorClasses = hasError 
      ? 'border-red-500 focus:ring-red-200' 
      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500';
    
    return `${baseClasses} ${errorClasses}`;
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden ${className}`}>
      <div className="p-6 md:p-8">
        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-green-800 font-medium">Registration successful!</p>
                <p className="text-green-600 text-sm">Redirecting to your dashboard...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* API Error */}
        <AnimatePresence>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 flex-1">{apiError}</p>
              <button
                onClick={() => setApiError(null)}
                className="text-red-600 hover:text-red-800"
                aria-label="Close error message"
              >
                <XCircle size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                aria-label="Full name"
                aria-invalid={!!getFieldError('name')}
                aria-describedby={getFieldError('name') ? "name-error" : undefined}
                className={getInputClassName('name')}
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </div>
            {getFieldError('name') && (
              <p id="name-error" className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                aria-label="Email address"
                aria-invalid={!!getFieldError('email')}
                aria-describedby={getFieldError('email') ? "email-error" : undefined}
                className={getInputClassName('email')}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            {getFieldError('email') && (
              <p id="email-error" className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                aria-label="Phone number"
                aria-invalid={!!getFieldError('phone')}
                aria-describedby={getFieldError('phone') ? "phone-error" : undefined}
                className={getInputClassName('phone')}
                placeholder="9876543210"
                autoComplete="tel"
              />
            </div>
            {getFieldError('phone') && (
              <p id="phone-error" className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                onBlur={handleBlur}
                aria-label="Date of birth"
                aria-invalid={!!getFieldError('dateOfBirth')}
                aria-describedby={getFieldError('dateOfBirth') ? "dob-error" : undefined}
                className={getInputClassName('dateOfBirth')}
              />
            </div>
            {getFieldError('dateOfBirth') && (
              <p id="dob-error" className="mt-1 text-sm text-red-600">{getFieldError('dateOfBirth')}</p>
            )}
            {ageValidation && !getFieldError('dateOfBirth') && ageValidation.isValid && (
              <p className="mt-1 text-xs text-green-600">
                Age: {ageValidation.age} years
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I want to sign up as <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = formData.role === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      isSelected
                        ? `${role.selectedBg} ${role.selectedBorder}`
                        : `${role.bgColor} ${role.borderColor} ${role.hoverColor}`
                    }`}
                    aria-label={`Sign up as ${role.label}`}
                  >
                    <Icon size={24} className={`mx-auto mb-2 ${isSelected ? role.iconColor : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${isSelected ? `text-${role.color}-700` : 'text-gray-700'}`}>
                      {role.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 hidden md:block line-clamp-2">{role.description}</p>
                  </button>
                );
              })}
            </div>
            {getFieldError('role') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('role')}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                aria-label="Password"
                aria-invalid={!!getFieldError('password')}
                aria-describedby={getFieldError('password') ? "password-error" : undefined}
                className={getInputClassName('password')}
                placeholder="Create a strong password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {getFieldError('password') && (
              <p id="password-error" className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
            )}
            
            {/* Password strength indicator */}
            {formData.password && passwordStrength && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {['hasMinLength', 'hasUpperCase', 'hasLowerCase', 'hasNumber'].map((req) => (
                    <div
                      key={req}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        passwordStrength[req as keyof PasswordValidationResult] 
                          ? 'bg-green-500' 
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {PASSWORD_REQUIREMENTS.map((req) => {
                    const isMet = passwordStrength[req.key as keyof PasswordValidationResult];
                    if (req.optional && !isMet) return null;
                    return (
                      <span
                        key={req.key}
                        className={`text-xs flex items-center gap-1 ${
                          isMet ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {isMet ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                        {req.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                aria-label="Confirm password"
                aria-invalid={!!getFieldError('confirmPassword')}
                aria-describedby={getFieldError('confirmPassword') ? "confirm-password-error" : undefined}
                className={getInputClassName('confirmPassword')}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {getFieldError('confirmPassword') && (
              <p id="confirm-password-error" className="mt-1 text-sm text-red-600">{getFieldError('confirmPassword')}</p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3">
            <input
              id="agreeToTerms"
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              aria-label="I agree to the terms and conditions"
              aria-invalid={!!getFieldError('agreeToTerms')}
              aria-describedby={getFieldError('agreeToTerms') ? "terms-error" : undefined}
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
              I agree to the{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                Privacy Policy
              </Link>
            </label>
          </div>
          {getFieldError('agreeToTerms') && (
            <p id="terms-error" className="text-sm text-red-600">{getFieldError('agreeToTerms')}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            aria-label={isLoading ? 'Creating account...' : 'Create account'}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;