import type { ID, Timestamps } from "../shared";

/**
 * Uploaded medical document / report metadata
 * File storage provider agnostic
 */
export interface PatientUpload extends Timestamps {
  readonly id: ID;
  readonly patientId: ID;

  readonly fileName: string;
  readonly fileType: string; // MIME type
  readonly fileSizeBytes: number;

  readonly storageKey: string; // S3/GCS/etc reference
  readonly uploadedBy?: ID;    // userId (doctor/patient)
}
