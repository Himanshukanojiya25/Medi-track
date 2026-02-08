/**
 * Generic form field state
 * Library-agnostic (Formik / RHF / custom)
 */
export interface FormField<T = unknown> {
  readonly name: string;
  readonly value: T;
  readonly error?: string;
  readonly touched?: boolean;
}

/**
 * Generic form state container
 */
export interface FormState<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  readonly isSubmitting: boolean;
  readonly isValid: boolean;
}

/**
 * Form submit handler signature
 */
export type FormSubmitHandler<TValues> = (
  values: TValues
) => Promise<void> | void;
