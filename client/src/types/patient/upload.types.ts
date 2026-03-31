import type { ID, ISODateString, Timestamps } from "../shared";

/**
 * Document type enum
 */
export enum DocumentType {
  PRESCRIPTION = "PRESCRIPTION",
  LAB_REPORT = "LAB_REPORT",
  DISCHARGE_SUMMARY = "DISCHARGE_SUMMARY",
  MEDICAL_CERTIFICATE = "MEDICAL_CERTIFICATE",
  INSURANCE_DOCUMENT = "INSURANCE_DOCUMENT",
  ID_PROOF = "ID_PROOF",
  X_RAY = "X_RAY",
  MRI = "MRI",
  CT_SCAN = "CT_SCAN",
  ULTRASOUND = "ULTRASOUND",
  OTHER = "OTHER",
}

/**
 * Document status enum
 */
export enum DocumentStatus {
  PENDING = "PENDING",
  PROCESSED = "PROCESSED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  DELETED = "DELETED",
}

/**
 * Uploaded document interface
 */
export interface UploadedDocument extends Timestamps {
  readonly id: ID;
  readonly patientId: ID;
  readonly fileName: string;
  readonly originalName: string;
  readonly fileUrl: string;
  readonly fileType: DocumentType;
  readonly fileSize: number; // in bytes
  readonly mimeType: string;
  readonly status: DocumentStatus;
  readonly description?: string;
  readonly tags?: string[];
  readonly uploadedBy: ID;
  readonly uploadedAt: ISODateString;
  readonly processedAt?: ISODateString;
  readonly metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    pages?: number;
    thumbnail?: string;
  };
  readonly isPublic?: boolean;
}

/**
 * Upload request payload
 */
export interface UploadDocumentPayload {
  file: File;
  fileType: DocumentType;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

/**
 * Upload progress event
 */
export interface UploadProgressEvent {
  loaded: number;
  total: number;
  percent: number;
}

/**
 * Upload response
 */
export interface UploadDocumentResponse {
  success: boolean;
  data: UploadedDocument;
  message?: string;
}

/**
 * Delete document response
 */
export interface DeleteDocumentResponse {
  success: boolean;
  message: string;
}

/**
 * Document filters
 */
export interface DocumentFilters {
  fileType?: DocumentType;
  status?: DocumentStatus;
  fromDate?: ISODateString;
  toDate?: ISODateString;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Upload state for Redux store
 */
export interface UploadState {
  documents: UploadedDocument[];
  currentDocument: UploadedDocument | null;
  isLoading: boolean;
  error: string | null;
  isUploading: boolean;
  uploadProgress: number;
  isDeleting: boolean;
  isDownloading: boolean;
  filters: DocumentFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Document list response
 */
export interface DocumentListResponse {
  success: boolean;
  data: UploadedDocument[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Document preview config
 */
export interface DocumentPreviewConfig {
  url: string;
  type: 'image' | 'pdf' | 'video' | 'other';
  canPreview: boolean;
  thumbnail?: string;
}

/**
 * Bulk upload response
 */
export interface BulkUploadResponse {
  success: boolean;
  data: {
    successful: UploadedDocument[];
    failed: Array<{
      fileName: string;
      error: string;
    }>;
  };
  message?: string;
}