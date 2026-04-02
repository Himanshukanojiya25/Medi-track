// client/src/features/auth/register/utils/index.ts

export {
  prepareRegisterPayload,
  formatPhoneNumber,
  isValidEmail,
  isValidPhoneNumber,
  validatePasswordStrength,
  validateAge,
  sanitizeInput,
  getRoleDisplayName,
  getRoleIcon,
  getRoleDescription,
} from './register-payload.util';

export type {
  RegisterFormData,
  PasswordValidationResult,
  AgeValidationResult,
} from './register-payload.util';