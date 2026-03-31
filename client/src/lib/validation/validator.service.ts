/**
 * @fileoverview Validator Service
 * @module lib/validation/validator.service
 * @description Production-grade schema-based validation service with:
 * - Field-level and form-level validation (Zod-powered)
 * - Async validation with superRefine support
 * - Indian domain validators (phone, Aadhaar, PAN, GSTIN, pincode)
 * - Medical domain validators (MCI/State registration, hospital reg)
 * - Date/time range validation (appointments, availability slots)
 * - Password strength enforcement (HIPAA-aligned)
 * - Cross-field validation (confirmPassword, date ranges)
 * - Structured error messages — i18n-ready
 * - React Hook Form integration helpers (zodResolver, toRHFRules)
 * - All domain Zod schemas (auth, patient, doctor, appointment, etc.)
 *
 * Design Principles:
 *  - Pure functions — no side effects, fully testable
 *  - Composable — validators can be chained or combined
 *  - Type-safe — all inputs/outputs are strictly typed
 *
 * @version 1.0.0
 */

import { z, ZodSchema, ZodError } from 'zod';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  code?: string;
}

export interface FieldValidationResult extends ValidationResult {
  field: string;
  value?: unknown;
}

export interface FormValidationResult<T = unknown> {
  isValid: boolean;
  data: T | null;
  errors: Record<string, string>;
  rawError?: ZodError;
}

export interface PhoneValidationResult extends ValidationResult {
  digits?: string;
  formatted?: string;
}

export interface MedicalIdValidationResult extends ValidationResult {
  normalizedId?: string;
  council?: 'MCI' | 'STATE';
}

export interface DateRangeValidationResult extends ValidationResult {
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
}

export interface PasswordStrengthResult {
  isValid: boolean;
  score: number;       // 0–6
  strength: 'weak' | 'fair' | 'strong' | 'very-strong';
  suggestions: string[];
}

export interface ValidationOptions {
  abortEarly?: boolean;
  stripUnknown?: boolean;
  context?: ValidationContext;
}

export interface ValidationContext {
  userId?: string;
  role?: string;
  hospitalId?: string;
  phase?: string;
}

// ============================================================================
// INTERNAL CONSTANTS
// ============================================================================

const REGEX = {
  EMAIL              : /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
  INDIAN_PHONE       : /^[6-9]\d{9}$/,
  PAN                : /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  GSTIN              : /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  AADHAAR            : /^\d{12}$/,
  PINCODE            : /^[1-9][0-9]{5}$/,
  MEDICAL_REG        : /^[A-Z0-9\-\/]{5,50}$/,
  TIME_24H           : /^([01]\d|2[0-3]):([0-5]\d)$/,
  UUID_V4            : /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  SPECIAL_CHAR       : /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  NAME               : /^[a-zA-Z\u0900-\u097F\s'\-\.]{2,100}$/,
  SLUG               : /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

const LIMITS = {
  PASSWORD_MIN            : 8,
  PASSWORD_MIN_ADMIN      : 12,
  PASSWORD_MAX            : 128,
  NAME_MIN                : 2,
  NAME_MAX                : 100,
  SHORT_TEXT_MAX          : 255,
  MEDIUM_TEXT_MAX         : 1000,
  LONG_TEXT_MAX           : 5000,
  PRESCRIPTION_NOTE_MIN   : 10,
  PRESCRIPTION_NOTE_MAX   : 5000,
  APPOINTMENT_MIN_NOTICE  : 30,   // minutes
  APPOINTMENT_MAX_DAYS    : 90,
  SLOT_MIN_MINUTES        : 15,
  SLOT_MAX_MINUTES        : 120,
  PATIENT_MIN_AGE         : 0,
  PATIENT_MAX_AGE         : 150,
  SELF_REGISTER_MIN_AGE   : 18,
} as const;

const MSG = {
  // Generic
  REQUIRED                : 'This field is required.',
  INVALID                 : 'The value entered is invalid.',
  TOO_SHORT               : 'Value is too short.',
  TOO_LONG                : 'Value is too long.',
  // Auth
  EMAIL_INVALID           : 'Please enter a valid email address.',
  PASSWORDS_MISMATCH      : 'Passwords do not match.',
  PASSWORD_WEAK           : 'Password does not meet minimum security requirements.',
  // Phone
  PHONE_LENGTH            : 'Phone number must be exactly 10 digits.',
  PHONE_PREFIX            : 'Mobile number must start with 6, 7, 8, or 9.',
  PHONE_SEQUENTIAL        : 'Please enter a valid phone number.',
  // Documents
  PAN_INVALID             : 'PAN must be in the format AAAAA9999A.',
  GSTIN_INVALID           : 'Please enter a valid 15-character GSTIN.',
  AADHAAR_LENGTH          : 'Aadhaar number must be exactly 12 digits.',
  AADHAAR_START           : 'Aadhaar number cannot start with 0 or 1.',
  PINCODE_INVALID         : 'Please enter a valid 6-digit PIN code.',
  // Medical
  MEDICAL_ID_INVALID      : 'Medical registration number contains invalid characters.',
  HOSPITAL_REG_INVALID    : 'Hospital registration number is invalid.',
  // Appointments
  APPT_TOO_SOON           : 'Appointment must be at least 30 minutes from now.',
  APPT_TOO_FAR            : 'Appointments can only be booked up to {days} days in advance.',
  APPT_SUNDAY             : 'Appointments are not available on Sundays.',
  // Time slots
  TIME_FORMAT             : 'Time must be in HH:mm (24-hour) format.',
  TIME_END_BEFORE_START   : 'End time must be after start time.',
  SLOT_TOO_SHORT          : 'Time slot must be at least {min} minutes.',
  SLOT_TOO_LONG           : 'Time slot cannot exceed {max} minutes.',
  // DOB
  DOB_FUTURE              : 'Date of birth cannot be in the future.',
  DOB_TOO_YOUNG           : 'You must be at least {age} years old to register.',
  DOB_TOO_OLD             : 'Please enter a valid date of birth.',
  // Prescription
  PRESCRIPTION_SHORT      : 'Prescription notes must be at least {min} characters.',
  PRESCRIPTION_LONG       : 'Prescription notes cannot exceed {max} characters.',
} as const;

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

/**
 * Flattens a ZodError into a record of field → first error message.
 */
function flattenZodErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) errors[path] = issue.message;
  }
  return errors;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * All domain-specific Zod schemas used across the platform.
 * Import via ValidatorService.schemas or directly from this module.
 */
export const schemas = {

  // ── Auth ───────────────────────────────────────────────────────────────────

  auth: {

    login: z.object({
      email   : z.string().min(1, MSG.REQUIRED).email(MSG.EMAIL_INVALID),
      password: z.string().min(1, MSG.REQUIRED),
    }),

    register: z.object({
      name           : z.string().min(LIMITS.NAME_MIN).max(LIMITS.NAME_MAX).regex(REGEX.NAME, 'Name contains invalid characters.'),
      email          : z.string().email(MSG.EMAIL_INVALID),
      phone          : z.string().regex(REGEX.INDIAN_PHONE, MSG.PHONE_PREFIX),
      password       : z.string().min(LIMITS.PASSWORD_MIN, `Password must be at least ${LIMITS.PASSWORD_MIN} characters.`).max(LIMITS.PASSWORD_MAX),
      confirmPassword: z.string().min(1, MSG.REQUIRED),
    }).refine((data) => data.password === data.confirmPassword, {
      message: MSG.PASSWORDS_MISMATCH,
      path   : ['confirmPassword'],
    }),

    forgotPassword: z.object({
      email: z.string().email(MSG.EMAIL_INVALID),
    }),

    resetPassword: z.object({
      token          : z.string().min(1, MSG.REQUIRED),
      password       : z.string().min(LIMITS.PASSWORD_MIN).max(LIMITS.PASSWORD_MAX),
      confirmPassword: z.string().min(1, MSG.REQUIRED),
    }).refine((data) => data.password === data.confirmPassword, {
      message: MSG.PASSWORDS_MISMATCH,
      path   : ['confirmPassword'],
    }),

    setPassword: z.object({
      password       : z.string().min(LIMITS.PASSWORD_MIN).max(LIMITS.PASSWORD_MAX),
      confirmPassword: z.string().min(1, MSG.REQUIRED),
    }).refine((data) => data.password === data.confirmPassword, {
      message: MSG.PASSWORDS_MISMATCH,
      path   : ['confirmPassword'],
    }),

  },

  // ── Patient ─────────────────────────────────────────────────────────────────

  patient: {

    signup: z.object({
      name           : z.string().min(LIMITS.NAME_MIN).max(LIMITS.NAME_MAX).regex(REGEX.NAME),
      email          : z.string().email(MSG.EMAIL_INVALID),
      phone          : z.string().regex(REGEX.INDIAN_PHONE, MSG.PHONE_PREFIX),
      dateOfBirth    : z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Invalid date of birth.' }),
      gender         : z.enum(['male', 'female', 'other']),
      password       : z.string().min(LIMITS.PASSWORD_MIN).max(LIMITS.PASSWORD_MAX),
      confirmPassword: z.string(),
    }).refine((d) => d.password === d.confirmPassword, {
      message: MSG.PASSWORDS_MISMATCH,
      path   : ['confirmPassword'],
    }),

    updateProfile: z.object({
      name       : z.string().min(LIMITS.NAME_MIN).max(LIMITS.NAME_MAX).regex(REGEX.NAME).optional(),
      phone      : z.string().regex(REGEX.INDIAN_PHONE).optional(),
      dateOfBirth: z.string().optional(),
      gender     : z.enum(['male', 'female', 'other']).optional(),
      bloodGroup : z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
      address    : z.object({
        line1  : z.string().max(LIMITS.SHORT_TEXT_MAX),
        line2  : z.string().max(LIMITS.SHORT_TEXT_MAX).optional(),
        city   : z.string().max(100),
        state  : z.string().max(100),
        pincode: z.string().regex(REGEX.PINCODE, MSG.PINCODE_INVALID),
      }).optional(),
    }),

  },

  // ── Doctor ──────────────────────────────────────────────────────────────────

  doctor: {

    updateProfile: z.object({
      name              : z.string().min(LIMITS.NAME_MIN).max(LIMITS.NAME_MAX).regex(REGEX.NAME).optional(),
      phone             : z.string().regex(REGEX.INDIAN_PHONE).optional(),
      bio               : z.string().max(LIMITS.MEDIUM_TEXT_MAX).optional(),
      specialization    : z.string().min(2).max(100).optional(),
      qualification     : z.string().min(2).max(200).optional(),
      experienceYears   : z.number().int().min(0).max(70).optional(),
      registrationNumber: z.string().regex(REGEX.MEDICAL_REG, MSG.MEDICAL_ID_INVALID).optional(),
      consultationFee   : z.number().min(0).max(100000).optional(),
      languages         : z.array(z.string()).max(10).optional(),
    }),

    availability: z.object({
      dayOfWeek : z.number().int().min(0).max(6),  // 0 = Sunday
      startTime : z.string().regex(REGEX.TIME_24H, MSG.TIME_FORMAT),
      endTime   : z.string().regex(REGEX.TIME_24H, MSG.TIME_FORMAT),
      slotDuration: z.number().int().min(LIMITS.SLOT_MIN_MINUTES).max(LIMITS.SLOT_MAX_MINUTES),
      isActive  : z.boolean().default(true),
    }).refine(
      (d) => {
        const [sh, sm] = d.startTime.split(':').map(Number);
        const [eh, em] = d.endTime.split(':').map(Number);
        return eh * 60 + em > sh * 60 + sm;
      },
      { message: MSG.TIME_END_BEFORE_START, path: ['endTime'] }
    ),

    query: z.object({
      specialization: z.string().optional(),
      city          : z.string().optional(),
      hospitalId    : z.string().uuid().optional(),
      page          : z.number().int().min(1).default(1),
      limit         : z.number().int().min(1).max(50).default(10),
      sortBy        : z.enum(['rating', 'experience', 'fee']).default('rating'),
      order         : z.enum(['asc', 'desc']).default('asc'),
    }),

  },

  // ── Appointment ──────────────────────────────────────────────────────────────

  appointment: {

    book: z.object({
      doctorId        : z.string().uuid(),
      hospitalId      : z.string().uuid(),
      scheduledAt     : z.string().refine((d) => !isNaN(Date.parse(d)), { message: 'Invalid appointment date.' }),
      type            : z.enum(['in-person', 'video', 'phone']).default('in-person'),
      reasonForVisit  : z.string().min(5).max(LIMITS.MEDIUM_TEXT_MAX),
      symptoms        : z.array(z.string()).max(20).optional(),
      notes           : z.string().max(LIMITS.MEDIUM_TEXT_MAX).optional(),
    }),

    cancel: z.object({
      appointmentId: z.string().uuid(),
      reason       : z.string().min(5).max(500),
    }),

    patientList: z.object({
      status  : z.enum(['upcoming', 'completed', 'cancelled', 'all']).default('all'),
      page    : z.number().int().min(1).default(1),
      limit   : z.number().int().min(1).max(50).default(10),
      fromDate: z.string().optional(),
      toDate  : z.string().optional(),
    }),

    doctorList: z.object({
      status  : z.enum(['upcoming', 'completed', 'cancelled', 'all']).default('all'),
      date    : z.string().optional(),
      page    : z.number().int().min(1).default(1),
      limit   : z.number().int().min(1).max(50).default(10),
    }),

  },

  // ── Prescription ─────────────────────────────────────────────────────────────

  prescription: {

    create: z.object({
      appointmentId: z.string().uuid(),
      diagnosis    : z.string().min(LIMITS.PRESCRIPTION_NOTE_MIN).max(LIMITS.PRESCRIPTION_NOTE_MAX),
      notes        : z.string().max(LIMITS.PRESCRIPTION_NOTE_MAX).optional(),
      medicines    : z.array(z.object({
        name       : z.string().min(1).max(200),
        dosage     : z.string().min(1).max(100),
        frequency  : z.string().min(1).max(100),
        duration   : z.string().min(1).max(100),
        instructions: z.string().max(300).optional(),
      })).min(1, 'At least one medicine is required.').max(30),
      followUpDate: z.string().optional(),
    }),

  },

  // ── Hospital Admin ───────────────────────────────────────────────────────────

  hospitalAdmin: {

    onboarding: z.object({
      hospitalName      : z.string().min(2).max(200),
      registrationNumber: z.string().min(5).max(30),
      gstin             : z.string().regex(REGEX.GSTIN, MSG.GSTIN_INVALID).optional(),
      phone             : z.string().regex(REGEX.INDIAN_PHONE, MSG.PHONE_PREFIX),
      email             : z.string().email(MSG.EMAIL_INVALID),
      website           : z.string().url().optional(),
      address           : z.object({
        line1  : z.string().min(5).max(LIMITS.SHORT_TEXT_MAX),
        line2  : z.string().max(LIMITS.SHORT_TEXT_MAX).optional(),
        city   : z.string().min(2).max(100),
        state  : z.string().min(2).max(100),
        pincode: z.string().regex(REGEX.PINCODE, MSG.PINCODE_INVALID),
      }),
      adminName    : z.string().min(LIMITS.NAME_MIN).max(LIMITS.NAME_MAX).regex(REGEX.NAME),
      adminEmail   : z.string().email(),
      adminPhone   : z.string().regex(REGEX.INDIAN_PHONE),
      adminPassword: z.string().min(LIMITS.PASSWORD_MIN_ADMIN).max(LIMITS.PASSWORD_MAX),
      bedCount     : z.number().int().min(1).max(10000).optional(),
      specialties  : z.array(z.string()).min(1).max(50),
    }),

    updateHospital: z.object({
      hospitalName: z.string().min(2).max(200).optional(),
      phone       : z.string().regex(REGEX.INDIAN_PHONE).optional(),
      email       : z.string().email().optional(),
      website     : z.string().url().optional(),
      address     : z.object({
        line1  : z.string().min(5).max(LIMITS.SHORT_TEXT_MAX),
        line2  : z.string().max(LIMITS.SHORT_TEXT_MAX).optional(),
        city   : z.string().min(2).max(100),
        state  : z.string().min(2).max(100),
        pincode: z.string().regex(REGEX.PINCODE, MSG.PINCODE_INVALID),
      }).optional(),
    }),

    inviteDoctor: z.object({
      name              : z.string().min(LIMITS.NAME_MIN).max(LIMITS.NAME_MAX).regex(REGEX.NAME),
      email             : z.string().email(),
      phone             : z.string().regex(REGEX.INDIAN_PHONE),
      specialization    : z.string().min(2).max(100),
      registrationNumber: z.string().regex(REGEX.MEDICAL_REG, MSG.MEDICAL_ID_INVALID),
      departmentId      : z.string().uuid().optional(),
    }),

  },

  // ── Super Admin ──────────────────────────────────────────────────────────────

  superAdmin: {

    hospitalApproval: z.object({
      hospitalId: z.string().uuid(),
      action    : z.enum(['approve', 'reject']),
      reason    : z.string().min(5).max(500).optional(),
    }),

    hospitalSuspension: z.object({
      hospitalId: z.string().uuid(),
      reason    : z.string().min(10).max(1000),
      suspendAt : z.string().optional(),
    }),

  },

  // ── Subscription ─────────────────────────────────────────────────────────────

  subscription: {

    plan: z.object({
      name           : z.string().min(2).max(100),
      description    : z.string().max(LIMITS.MEDIUM_TEXT_MAX).optional(),
      price          : z.number().min(0).max(1000000),
      billingCycle   : z.enum(['monthly', 'quarterly', 'annual']),
      maxDoctors     : z.number().int().min(1).max(10000),
      maxAppointments: z.number().int().min(1).max(1000000),
      features       : z.array(z.string()).max(50),
      isActive       : z.boolean().default(true),
    }),

  },

  // ── Department ───────────────────────────────────────────────────────────────

  department: {

    create: z.object({
      name       : z.string().min(2).max(100),
      description: z.string().max(LIMITS.MEDIUM_TEXT_MAX).optional(),
      hospitalId : z.string().uuid(),
    }),

  },

  // ── AI / Chat ─────────────────────────────────────────────────────────────────

  ai: {

    chatMessage: z.object({
      sessionId: z.string().uuid(),
      message  : z.string().min(1).max(LIMITS.LONG_TEXT_MAX),
      role     : z.enum(['user', 'assistant']).default('user'),
    }),

    prompt: z.object({
      context: z.string().max(LIMITS.LONG_TEXT_MAX).optional(),
      prompt : z.string().min(1).max(LIMITS.LONG_TEXT_MAX),
    }),

  },

} as const;

// ============================================================================
// VALIDATOR SERVICE
// ============================================================================

export const ValidatorService = {

  /**
   * Expose all Zod schemas for direct use in components.
   *
   * @example
   * const { register } = useForm({
   *   resolver: ValidatorService.zodResolver(ValidatorService.schemas.auth.login)
   * });
   */
  schemas,

  // --------------------------------------------------------------------------
  // SCHEMA VALIDATION
  // --------------------------------------------------------------------------

  /**
   * Validates a single field value against a Zod object schema's field.
   *
   * @example
   * ValidatorService.validateField('email', 'bad@', schemas.auth.login)
   * // → { isValid: false, error: 'Invalid email address', field: 'email' }
   */
  validateField<T extends z.ZodRawShape>(
    fieldName  : keyof T & string,
    value      : unknown,
    schema     : z.ZodObject<T>,
    _options   : ValidationOptions = {}
  ): FieldValidationResult {
    const fieldSchema = schema.shape[fieldName] as ZodSchema | undefined;

    if (!fieldSchema) {
      return { isValid: false, field: fieldName, error: `Unknown field: "${fieldName}"`, value };
    }

    const result = fieldSchema.safeParse(value);

    if (result.success) return { isValid: true, field: fieldName, value: result.data };

    const issue = result.error.issues[0];
    return {
      isValid: false,
      field  : fieldName,
      error  : issue?.message ?? MSG.INVALID,
      code   : issue?.code,
      value,
    };
  },

  /**
   * Validates a full form payload against a Zod schema.
   * Returns per-field errors map.
   *
   * @example
   * const result = ValidatorService.validateForm(formData, schemas.patient.signup);
   * if (!result.isValid) setErrors(result.errors);
   */
  validateForm<T>(
    data    : unknown,
    schema  : ZodSchema<T>,
    _options: ValidationOptions = {}
  ): FormValidationResult<T> {
    const result = schema.safeParse(data);

    if (result.success) return { isValid: true, data: result.data, errors: {} };

    return {
      isValid  : false,
      data     : null,
      errors   : flattenZodErrors(result.error),
      rawError : result.error,
    };
  },

  /**
   * Async form validation — awaits async Zod refinements
   * (e.g. username availability, duplicate email checks).
   */
  async validateFormAsync<T>(
    data    : unknown,
    schema  : ZodSchema<T>,
    _options: ValidationOptions = {}
  ): Promise<FormValidationResult<T>> {
    try {
      const parsed = await schema.parseAsync(data);
      return { isValid: true, data: parsed, errors: {} };
    } catch (error) {
      if (error instanceof ZodError) {
        return { isValid: false, data: null, errors: flattenZodErrors(error), rawError: error };
      }
      throw error;
    }
  },

  // --------------------------------------------------------------------------
  // INDIAN DOMAIN VALIDATORS
  // --------------------------------------------------------------------------

  /**
   * Validates an Indian mobile phone number (10 digits, starts with 6-9).
   *
   * @example
   * ValidatorService.validateIndianPhone('9876543210')
   * // → { isValid: true, formatted: '+91 98765 43210' }
   */
  validateIndianPhone(phone: string): PhoneValidationResult {
    const digits = phone.replace(/\D/g, '');

    if (digits.length !== 10) return { isValid: false, error: MSG.PHONE_LENGTH, digits };
    if (!REGEX.INDIAN_PHONE.test(digits)) return { isValid: false, error: MSG.PHONE_PREFIX, digits };
    if (/^(\d)\1{9}$/.test(digits)) return { isValid: false, error: MSG.PHONE_SEQUENTIAL, digits };

    return {
      isValid  : true,
      digits,
      formatted: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`,
    };
  },

  /**
   * Validates an Aadhaar number (12 digits, doesn't start with 0 or 1).
   *
   * @phi - Sensitive PII
   */
  validateAadhaar(aadhaar: string): ValidationResult {
    const digits = aadhaar.replace(/\s/g, '');
    if (!REGEX.AADHAAR.test(digits)) return { isValid: false, error: MSG.AADHAAR_LENGTH };
    if (/^[01]/.test(digits))       return { isValid: false, error: MSG.AADHAAR_START };
    return { isValid: true };
  },

  /**
   * Validates an Indian PAN card (format: AAAAA9999A).
   *
   * @example
   * ValidatorService.validatePAN('ABCDE1234F') // → { isValid: true }
   */
  validatePAN(pan: string): ValidationResult {
    const normalized = pan.trim().toUpperCase();
    if (!REGEX.PAN.test(normalized)) return { isValid: false, error: MSG.PAN_INVALID };
    return { isValid: true };
  },

  /**
   * Validates an Indian GSTIN (15-character format).
   *
   * @example
   * ValidatorService.validateGSTIN('27ABCDE1234F1Z5')
   */
  validateGSTIN(gstin: string): ValidationResult {
    const normalized = gstin.trim().toUpperCase();
    if (!REGEX.GSTIN.test(normalized)) return { isValid: false, error: MSG.GSTIN_INVALID };
    return { isValid: true };
  },

  /**
   * Validates an Indian Pincode (6-digit postal code).
   */
  validatePincode(pincode: string): ValidationResult {
    const digits = pincode.replace(/\D/g, '');
    if (!REGEX.PINCODE.test(digits)) return { isValid: false, error: MSG.PINCODE_INVALID };
    return { isValid: true };
  },

  // --------------------------------------------------------------------------
  // MEDICAL DOMAIN VALIDATORS
  // --------------------------------------------------------------------------

  /**
   * Validates an MCI / State Medical Council registration number.
   *
   * @example
   * ValidatorService.validateMedicalRegistration('MH/2021/12345')
   */
  validateMedicalRegistration(
    registrationNumber: string,
    council: 'MCI' | 'STATE' = 'STATE'
  ): MedicalIdValidationResult {
    const normalized = registrationNumber.trim().toUpperCase();
    if (!REGEX.MEDICAL_REG.test(normalized)) {
      return { isValid: false, error: MSG.MEDICAL_ID_INVALID, council };
    }
    return { isValid: true, normalizedId: normalized, council };
  },

  /**
   * Validates a hospital CIN or health facility registration number.
   */
  validateHospitalRegistration(registrationNumber: string): ValidationResult {
    const normalized = registrationNumber.trim().toUpperCase();
    if (normalized.length < 5 || normalized.length > 30)
      return { isValid: false, error: MSG.HOSPITAL_REG_INVALID };
    if (!/^[A-Z0-9\-\/]+$/.test(normalized))
      return { isValid: false, error: MSG.HOSPITAL_REG_INVALID };
    return { isValid: true };
  },

  // --------------------------------------------------------------------------
  // DATE & TIME VALIDATORS
  // --------------------------------------------------------------------------

  /**
   * Validates an appointment datetime.
   * Ensures ≥30 min from now, ≤90 days ahead, Mon–Sat only.
   *
   * @example
   * ValidatorService.validateAppointmentDate(new Date('2025-12-25'))
   */
  validateAppointmentDate(
    date       : Date,
    options    : { allowSunday?: boolean; maxDaysAhead?: number } = {}
  ): ValidationResult {
    const { allowSunday = false, maxDaysAhead = LIMITS.APPOINTMENT_MAX_DAYS } = options;
    const now     = new Date();
    const minDate = new Date(now.getTime() + LIMITS.APPOINTMENT_MIN_NOTICE * 60 * 1000);
    const maxDate = new Date(now.getTime() + maxDaysAhead * 24 * 60 * 60 * 1000);

    if (date < minDate) return { isValid: false, error: MSG.APPT_TOO_SOON };
    if (date > maxDate) return {
      isValid: false,
      error  : MSG.APPT_TOO_FAR.replace('{days}', String(maxDaysAhead)),
    };
    if (!allowSunday && date.getDay() === 0) return { isValid: false, error: MSG.APPT_SUNDAY };
    return { isValid: true };
  },

  /**
   * Validates a time slot range (HH:mm format, 24h).
   *
   * @example
   * ValidatorService.validateTimeSlot('09:00', '09:30')
   * // → { isValid: true, durationMinutes: 30 }
   */
  validateTimeSlot(
    startTime: string,
    endTime  : string,
    options  : { minMinutes?: number; maxMinutes?: number } = {}
  ): DateRangeValidationResult {
    const { minMinutes = LIMITS.SLOT_MIN_MINUTES, maxMinutes = LIMITS.SLOT_MAX_MINUTES } = options;

    if (!REGEX.TIME_24H.test(startTime) || !REGEX.TIME_24H.test(endTime)) {
      return { isValid: false, error: MSG.TIME_FORMAT, startTime, endTime };
    }

    const toMins = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const duration = toMins(endTime) - toMins(startTime);

    if (duration <= 0)
      return { isValid: false, error: MSG.TIME_END_BEFORE_START, startTime, endTime };
    if (duration < minMinutes)
      return { isValid: false, error: MSG.SLOT_TOO_SHORT.replace('{min}', String(minMinutes)), startTime, endTime, durationMinutes: duration };
    if (duration > maxMinutes)
      return { isValid: false, error: MSG.SLOT_TOO_LONG.replace('{max}', String(maxMinutes)), startTime, endTime, durationMinutes: duration };

    return { isValid: true, startTime, endTime, durationMinutes: duration };
  },

  /**
   * Validates a patient's date of birth.
   *
   * @example
   * ValidatorService.validateDateOfBirth(new Date('1990-01-01'), { minAge: 18 })
   */
  validateDateOfBirth(
    dob    : Date,
    options: { minAge?: number; maxAge?: number } = {}
  ): ValidationResult & { ageYears?: number } {
    const { minAge = LIMITS.PATIENT_MIN_AGE, maxAge = LIMITS.PATIENT_MAX_AGE } = options;
    const now      = new Date();

    if (dob > now) return { isValid: false, error: MSG.DOB_FUTURE };

    const ageYears = Math.floor(
      (now.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );

    if (ageYears < minAge)
      return { isValid: false, error: MSG.DOB_TOO_YOUNG.replace('{age}', String(minAge)), ageYears };
    if (ageYears > maxAge)
      return { isValid: false, error: MSG.DOB_TOO_OLD, ageYears };

    return { isValid: true, ageYears };
  },

  // --------------------------------------------------------------------------
  // PASSWORD VALIDATION
  // --------------------------------------------------------------------------

  /**
   * Validates password strength (HIPAA-aligned security requirements).
   *
   * Scoring:
   *  0-2 → weak | 3-4 → fair | 5 → strong | 6 → very-strong
   *
   * @example
   * ValidatorService.validatePasswordStrength('MySecure@123', 'patient')
   * // → { isValid: true, score: 5, strength: 'strong', suggestions: [] }
   */
  validatePasswordStrength(
    password: string,
    role    : 'patient' | 'doctor' | 'hospital-admin' | 'super-admin' = 'patient'
  ): PasswordStrengthResult {
    const suggestions: string[] = [];
    let score = 0;

    const minLength = ['doctor', 'hospital-admin', 'super-admin'].includes(role)
      ? LIMITS.PASSWORD_MIN_ADMIN
      : LIMITS.PASSWORD_MIN;

    if (password.length < minLength) {
      suggestions.push(`Password must be at least ${minLength} characters.`);
    } else {
      score += 1;
      if (password.length >= 16) score += 1;
    }

    if (!/[A-Z]/.test(password)) suggestions.push('Add at least one uppercase letter.');
    else score += 1;

    if (!/[a-z]/.test(password)) suggestions.push('Add at least one lowercase letter.');
    else score += 1;

    if (!/\d/.test(password)) suggestions.push('Add at least one number.');
    else score += 1;

    if (!REGEX.SPECIAL_CHAR.test(password))
      suggestions.push('Add at least one special character (!@#$%^&*).');
    else score += 1;

    if (/\s/.test(password)) {
      suggestions.push('Password must not contain spaces.');
      score -= 1;
    }

    const commonPatterns = ['password', '123456', 'qwerty', 'abc123', 'letmein', 'admin', 'welcome'];
    if (commonPatterns.some((p) => password.toLowerCase().includes(p))) {
      suggestions.push('Avoid common words or patterns.');
      score -= 1;
    }

    const clampedScore = Math.max(0, Math.min(score, 6));
    const strength: PasswordStrengthResult['strength'] =
      clampedScore <= 2 ? 'weak'
      : clampedScore <= 4 ? 'fair'
      : clampedScore <= 5 ? 'strong'
      : 'very-strong';

    return {
      isValid    : suggestions.length === 0 && clampedScore >= 4,
      score      : clampedScore,
      strength,
      suggestions,
    };
  },

  /**
   * Validates that two password fields match.
   */
  validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
    if (password !== confirmPassword) return { isValid: false, error: MSG.PASSWORDS_MISMATCH };
    return { isValid: true };
  },

  // --------------------------------------------------------------------------
  // CONTENT VALIDATORS
  // --------------------------------------------------------------------------

  /**
   * Validates a prescription note for min/max length.
   *
   * @phi - Clinical data
   */
  validatePrescriptionNote(note: string): ValidationResult {
    const trimmed = note.trim();
    if (trimmed.length < LIMITS.PRESCRIPTION_NOTE_MIN)
      return { isValid: false, error: MSG.PRESCRIPTION_SHORT.replace('{min}', String(LIMITS.PRESCRIPTION_NOTE_MIN)) };
    if (trimmed.length > LIMITS.PRESCRIPTION_NOTE_MAX)
      return { isValid: false, error: MSG.PRESCRIPTION_LONG.replace('{max}', String(LIMITS.PRESCRIPTION_NOTE_MAX)) };
    return { isValid: true };
  },

  // --------------------------------------------------------------------------
  // REACT HOOK FORM HELPERS
  // --------------------------------------------------------------------------

  /**
   * Converts a Zod schema into a React Hook Form resolver.
   * Drop-in replacement for @hookform/resolvers/zod.
   *
   * @example
   * const { register, handleSubmit } = useForm({
   *   resolver: ValidatorService.zodResolver(schemas.auth.login),
   * });
   */
  zodResolver<T>(schema: ZodSchema<T>) {
    return async (values: unknown) => {
      const result = schema.safeParse(values);
      if (result.success) return { values: result.data, errors: {} };

      const errors: Record<string, { message: string; type: string }> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (!errors[path]) errors[path] = { message: issue.message, type: issue.code };
      }
      return { values: {}, errors };
    };
  },

  /**
   * Returns a React Hook Form validation rule object from a Zod field schema.
   *
   * @example
   * <input {...register('email', ValidatorService.toRHFRules(z.string().email()))} />
   */
  toRHFRules(fieldSchema: ZodSchema) {
    return {
      validate: (value: unknown) => {
        const result = fieldSchema.safeParse(value);
        if (result.success) return true;
        return result.error.issues[0]?.message ?? MSG.INVALID;
      },
    };
  },

  // --------------------------------------------------------------------------
  // UTILITY TYPE GUARDS
  // --------------------------------------------------------------------------

  /** Checks whether value is a non-empty trimmed string */
  isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
  },

  /** Checks whether value is a valid positive integer */
  isPositiveInteger(value: unknown): value is number {
    return typeof value === 'number' && Number.isInteger(value) && value > 0;
  },

  /** Checks whether value is a valid UUID v4 */
  isValidUUID(value: unknown): value is string {
    if (typeof value !== 'string') return false;
    return REGEX.UUID_V4.test(value);
  },

} as const;

export type ValidatorServiceType = typeof ValidatorService;