/**
 * @fileoverview Validation Library - Main Entry Point
 * @module lib/validation
 * @description Centralized validation and sanitization layer for the healthcare SaaS platform.
 *
 * @example
 * ```typescript
 * // Form validation
 * import { ValidatorService } from '@/lib/validation';
 *
 * const result = ValidatorService.validateForm(formData, ValidatorService.schemas.auth.login);
 * if (!result.isValid) setErrors(result.errors);
 *
 * // Input sanitization
 * import { SanitizerService } from '@/lib/validation';
 *
 * const clean = SanitizerService.sanitizeText(rawInput);
 * const phone = SanitizerService.sanitizePhone('+91 98765-43210'); // → '9876543210'
 *
 * // React Hook Form
 * const { register, handleSubmit } = useForm({
 *   resolver: ValidatorService.zodResolver(ValidatorService.schemas.patient.signup),
 * });
 * ```
 *
 * @version 1.0.0
 */

// ============================================================================
// SERVICES
// ============================================================================

export { ValidatorService } from './validator.service';
export { SanitizerService } from './sanitizer.service';

// ============================================================================
// SCHEMAS (re-exported for direct access)
// ============================================================================

export { schemas } from './validator.service';

// ============================================================================
// TYPES
// ============================================================================

export type {
  // Validator
  ValidationResult,
  FieldValidationResult,
  FormValidationResult,
  PhoneValidationResult,
  MedicalIdValidationResult,
  DateRangeValidationResult,
  PasswordStrengthResult,
  ValidationOptions,
  ValidationContext,
  ValidatorServiceType,
} from './validator.service';

export type {
  // Sanitizer
  SanitizationOptions,
  SanitizationResult,
  FileValidationResult,
  SanitizerServiceType,
} from './sanitizer.service';