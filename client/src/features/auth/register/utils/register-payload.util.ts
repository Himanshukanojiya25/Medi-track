// client/src/features/auth/register/utils/register-payload.util.ts

import type { RegisterRequest } from '../../../../services/auth/auth.service';

/**
 * Register form data interface
 */
export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  role: 'PATIENT' | 'DOCTOR' | 'HOSPITAL_ADMIN';
  agreeToTerms: boolean;
}

/**
 * Sanitize and prepare register payload for API
 */
export const prepareRegisterPayload = (formData: RegisterFormData): RegisterRequest => {
  // Trim whitespace from all string fields
  const trimmedName = formData.name.trim();
  const trimmedEmail = formData.email.trim().toLowerCase();
  const trimmedPhone = formData.phone.replace(/\s/g, '');
  
  // Validate required fields
  if (!trimmedName) {
    throw new Error('Name is required');
  }
  if (!trimmedEmail) {
    throw new Error('Email is required');
  }
  if (!trimmedPhone) {
    throw new Error('Phone number is required');
  }
  if (!formData.password) {
    throw new Error('Password is required');
  }
  if (!formData.dateOfBirth) {
    throw new Error('Date of birth is required');
  }
  
  return {
    name: trimmedName,
    email: trimmedEmail,
    phone: trimmedPhone,
    password: formData.password,
    dateOfBirth: formData.dateOfBirth,
    role: formData.role,
  };
};

/**
 * Format phone number for display
 * Input: 9876543210 -> Output: +91 98765 43210
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\s/g, '');
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(cleaned);
};

/**
 * Validate password strength
 * Returns object with validation results
 */
export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar?: boolean;
  errors: string[];
}

export const validatePasswordStrength = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasMinLength) errors.push('Password must be at least 8 characters');
  if (!hasUpperCase) errors.push('Password must contain at least one uppercase letter');
  if (!hasLowerCase) errors.push('Password must contain at least one lowercase letter');
  if (!hasNumber) errors.push('Password must contain at least one number');
  
  // Special characters are optional but recommended
  if (!hasSpecialChar) {
    errors.push('Password should contain at least one special character for better security');
  }
  
  return {
    isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber,
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    errors,
  };
};

/**
 * Validate date of birth (must be 18+ years)
 */
export interface AgeValidationResult {
  isValid: boolean;
  age: number;
  errors: string[];
}

export const validateAge = (dateOfBirth: string): AgeValidationResult => {
  const errors: string[] = [];
  
  if (!dateOfBirth) {
    errors.push('Date of birth is required');
    return { isValid: false, age: 0, errors };
  }
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  if (isNaN(birthDate.getTime())) {
    errors.push('Invalid date format');
    return { isValid: false, age: 0, errors };
  }
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  
  if (age < 18) {
    errors.push('You must be at least 18 years old to register');
  }
  
  if (age > 100) {
    errors.push('Please enter a valid date of birth');
  }
  
  return {
    isValid: errors.length === 0,
    age,
    errors,
  };
};

/**
 * Sanitize user input (remove potential XSS)
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > characters
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    PATIENT: 'Patient',
    DOCTOR: 'Doctor',
    HOSPITAL_ADMIN: 'Hospital Administrator',
    SUPER_ADMIN: 'Super Administrator',
  };
  return roleMap[role] || role;
};

/**
 * Get role icon name for UI
 */
export const getRoleIcon = (role: string): string => {
  const iconMap: Record<string, string> = {
    PATIENT: 'user',
    DOCTOR: 'stethoscope',
    HOSPITAL_ADMIN: 'building',
    SUPER_ADMIN: 'crown',
  };
  return iconMap[role] || 'user';
};

/**
 * Get role description
 */
export const getRoleDescription = (role: string): string => {
  const descMap: Record<string, string> = {
    PATIENT: 'Book appointments, manage health records, and track your wellness journey',
    DOCTOR: 'Manage patient appointments, write prescriptions, and provide care',
    HOSPITAL_ADMIN: 'Manage hospital operations, staff, and patient services',
    SUPER_ADMIN: 'Full system administration and platform management',
  };
  return descMap[role] || '';
};