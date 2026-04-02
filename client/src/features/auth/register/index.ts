// client/src/features/auth/register/index.ts

// ============================================================================
// SCREENS
// ============================================================================
export { RegisterScreen } from './screens';

// ============================================================================
// COMPONENTS
// ============================================================================
export { RegisterForm } from './components';

// ============================================================================
// UTILS - Most Commonly Used
// ============================================================================
export {
  // Core utilities
  prepareRegisterPayload,
  formatPhoneNumber,
  
  // Validation
  isValidEmail,
  isValidPhoneNumber,
  validatePasswordStrength,
  validateAge,
  sanitizeInput,
  
  // Role helpers
  getRoleDisplayName,
  getRoleIcon,
  
  // Types
  type RegisterFormData,
  type PasswordValidationResult,
  type AgeValidationResult,
} from './utils';

// ============================================================================
// CONSTANTS - Most Needed
// ============================================================================
export const REGISTER_ROLES = [
  { id: 'PATIENT', label: 'Patient', description: 'Book appointments, manage health records' },
  { id: 'DOCTOR', label: 'Doctor', description: 'Manage patients, write prescriptions' },
  { id: 'HOSPITAL_ADMIN', label: 'Hospital Admin', description: 'Manage hospital operations' },
] as const;

export const MINIMUM_AGE = 18;

// ============================================================================
// HELPER FUNCTIONS - Most Useful
// ============================================================================
export const getRegistrationRedirectPath = (role: string): string => {
  const redirectMap: Record<string, string> = {
    PATIENT: '/patient/dashboard',
    DOCTOR: '/doctor/dashboard',
    HOSPITAL_ADMIN: '/hospital-admin/dashboard',
  };
  return redirectMap[role] || '/dashboard';
};

// ============================================================================
// ROUTES (if exists)
// ============================================================================
export { registerRoutes } from './routes';