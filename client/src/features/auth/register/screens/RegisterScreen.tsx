import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Sparkles
} from 'lucide-react';
import AuthService, { RegisterRequest } from '../../../../services/auth/auth.service';
import { useAuthStore } from '../../../../stores/useAuthStore';

interface FormData {
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

const roles = [
  { id: 'PATIENT' as const, label: 'Patient', icon: User, description: 'Book appointments, manage health records', color: 'blue' },
  { id: 'DOCTOR' as const, label: 'Doctor', icon: Activity, description: 'Manage patients, write prescriptions', color: 'green' },
  { id: 'HOSPITAL_ADMIN' as const, label: 'Hospital Admin', icon: Heart, description: 'Manage hospital operations', color: 'purple' },
];

export const RegisterScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = formData.phone.replace(/\s/g, '');
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      } else if (age > 100) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }
    
    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setApiError(null);
  };

  const handleRoleSelect = (role: 'PATIENT' | 'DOCTOR' | 'HOSPITAL_ADMIN') => {
    setFormData(prev => ({ ...prev, role }));
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      // Register using AuthService
      const registerData: RegisterRequest = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        role: formData.role,
      };
      
      // This will handle API call and store tokens automatically
      const user = await AuthService.register(registerData);
      
      // Get token from localStorage (already stored by AuthService)
      const accessToken = AuthService.getAccessToken();
      
      // Update Zustand store
      if (accessToken) {
        login(user, accessToken);
      }
      
      setSuccess(true);
      
      // Redirect based on role after 2 seconds
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
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle different error responses
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle field-specific errors from server
        const serverErrors = error.response.data.errors;
        if (Array.isArray(serverErrors)) {
          const newErrors: FormErrors = {};
          serverErrors.forEach((err: any) => {
            if (err.field === 'email') newErrors.email = err.message;
            if (err.field === 'phone') newErrors.phone = err.message;
            if (err.field === 'name') newErrors.name = err.message;
          });
          setErrors(newErrors);
          if (!newErrors.email && !newErrors.phone && !newErrors.name) {
            setApiError('Registration failed. Please check your details.');
          }
        } else {
          setApiError(serverErrors.message || 'Registration failed. Please try again.');
        }
      } else {
        setApiError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
                <Sparkles size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Join MediTrack Today</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Create Your Account
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join India's most trusted healthcare platform. Start your journey to better health today.
              </p>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Side - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="sticky top-24">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                  <h2 className="text-2xl font-bold mb-6">Why Join MediTrack?</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Trusted & Secure</h3>
                        <p className="text-sm text-blue-100">HIPAA compliant, bank-grade security for your health data</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Heart size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Personalized Care</h3>
                        <p className="text-sm text-blue-100">AI-powered health insights tailored just for you</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Activity size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">24/7 Access</h3>
                        <p className="text-sm text-blue-100">Book appointments, view reports, consult doctors anytime</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xs font-bold">
                            {i}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm">Join 10,000+ happy patients</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
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
                          ×
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Registration Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          aria-label="Full name"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "name-error" : undefined}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.name && (
                        <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          aria-label="Email address"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : undefined}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                          }`}
                          placeholder="you@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          aria-label="Phone number"
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? "phone-error" : undefined}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                          }`}
                          placeholder="9876543210"
                        />
                      </div>
                      {errors.phone && (
                        <p id="phone-error" className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          id="dateOfBirth"
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          aria-label="Date of birth"
                          aria-invalid={!!errors.dateOfBirth}
                          aria-describedby={errors.dateOfBirth ? "dob-error" : undefined}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.dateOfBirth ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                          }`}
                        />
                      </div>
                      {errors.dateOfBirth && (
                        <p id="dob-error" className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                      )}
                    </div>

                    {/* Role Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        I want to sign up as *
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {roles.map((role) => {
                          const Icon = role.icon;
                          const isSelected = formData.role === role.id;
                          return (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => handleRoleSelect(role.id)}
                              className={`p-3 rounded-lg border-2 transition-all text-center ${
                                isSelected
                                  ? `border-${role.color}-500 bg-${role.color}-50`
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              aria-label={`Sign up as ${role.label}`}
                            >
                              <Icon size={24} className={`mx-auto mb-2 ${isSelected ? `text-${role.color}-600` : 'text-gray-400'}`} />
                              <p className={`text-sm font-medium ${isSelected ? `text-${role.color}-700` : 'text-gray-700'}`}>
                                {role.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 hidden md:block">{role.description}</p>
                            </button>
                          );
                        })}
                      </div>
                      {errors.role && (
                        <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          aria-label="Password"
                          aria-invalid={!!errors.password}
                          aria-describedby={errors.password ? "password-error" : undefined}
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                          }`}
                          placeholder="Create a strong password"
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
                      {errors.password && (
                        <p id="password-error" className="mt-1 text-sm text-red-600">{errors.password}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Must contain at least 8 characters, one uppercase, one lowercase, and one number
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          aria-label="Confirm password"
                          aria-invalid={!!errors.confirmPassword}
                          aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                          }`}
                          placeholder="Confirm your password"
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
                      {errors.confirmPassword && (
                        <p id="confirm-password-error" className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
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
                        aria-invalid={!!errors.agreeToTerms}
                        aria-describedby={errors.agreeToTerms ? "terms-error" : undefined}
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
                    {errors.agreeToTerms && (
                      <p id="terms-error" className="text-sm text-red-600">{errors.agreeToTerms}</p>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading || success}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};