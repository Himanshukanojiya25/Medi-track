// client/src/features/patient/hooks/useUploadReport.ts

import { useState, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface UploadedDocument {
  id: string;
  name: string;
  type: 'medical_report' | 'prescription' | 'lab_result' | 'imaging' | 'other';
  url: string;
  size: number;
  uploadedAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  thumbnail?: string;
  notes?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  compressImage?: boolean;
}

interface UseUploadReportReturn {
  isUploading: boolean;
  uploadProgress: UploadProgress | null;
  uploadedDocuments: UploadedDocument[];
  error: string | null;
  validationErrors: Record<string, string>;
  uploadReport: (file: File, type?: UploadedDocument['type'], notes?: string) => Promise<UploadedDocument>;
  uploadMultiple: (files: File[], type?: UploadedDocument['type']) => Promise<UploadedDocument[]>;
  deleteDocument: (id: string) => Promise<void>;
  retryUpload: (id: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// ============================================================================
// MOCK SERVICE (Replace with actual API call)
// ============================================================================

const uploadService = {
  upload: async (file: File, type: UploadedDocument['type'], notes?: string, onProgress?: (progress: UploadProgress) => void): Promise<UploadedDocument> => {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 200));
      if (onProgress) {
        onProgress({ loaded: (file.size * i) / 100, total: file.size, percentage: i });
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: `doc_${Date.now()}`,
      name: file.name,
      type,
      url: URL.createObjectURL(file),
      size: file.size,
      uploadedAt: new Date().toISOString(),
      status: 'completed',
      notes,
    };
  },
  
  deleteDocument: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  
  retryUpload: async (id: string): Promise<UploadedDocument> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id,
      name: 'Retried Document.pdf',
      type: 'medical_report',
      url: 'https://example.com/document.pdf',
      size: 1024 * 1024,
      uploadedAt: new Date().toISOString(),
      status: 'completed',
    };
  },
};

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useUploadReport = (options: UploadOptions = {}): UseUploadReportReturn => {
  const { maxSize = DEFAULT_MAX_SIZE, allowedTypes = ALLOWED_TYPES, compressImage = true } = options;
  
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const clearError = useCallback(() => setError(null), []);
  const reset = useCallback(() => {
    setUploadProgress(null);
    setError(null);
    setValidationErrors({});
  }, []);

  const validateFile = useCallback((file: File): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!file) {
      errors.file = 'No file selected';
      return errors;
    }
    
    if (file.size > maxSize) {
      errors.size = `File size exceeds ${maxSize / (1024 * 1024)}MB limit`;
    }
    
    if (!allowedTypes.includes(file.type)) {
      errors.type = `File type ${file.type} is not allowed. Allowed: ${allowedTypes.join(', ')}`;
    }
    
    return errors;
  }, [maxSize, allowedTypes]);

  const uploadReport = useCallback(async (
    file: File,
    type: UploadedDocument['type'] = 'medical_report',
    notes?: string
  ): Promise<UploadedDocument> => {
    setIsUploading(true);
    setError(null);
    setValidationErrors({});
    setUploadProgress(null);
    
    const errors = validateFile(file);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsUploading(false);
      throw new Error('Validation failed');
    }
    
    try {
      const document = await uploadService.upload(file, type, notes, (progress) => {
        setUploadProgress(progress);
      });
      
      setUploadedDocuments(prev => [document, ...prev]);
      return document;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload document';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  }, [validateFile]);

  const uploadMultiple = useCallback(async (
    files: File[],
    type: UploadedDocument['type'] = 'medical_report'
  ): Promise<UploadedDocument[]> => {
    const results: UploadedDocument[] = [];
    
    for (const file of files) {
      try {
        const result = await uploadReport(file, type);
        results.push(result);
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
      }
    }
    
    return results;
  }, [uploadReport]);

  const deleteDocument = useCallback(async (id: string): Promise<void> => {
    try {
      await uploadService.deleteDocument(id);
      setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete document';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const retryUpload = useCallback(async (id: string): Promise<void> => {
    setIsUploading(true);
    setError(null);
    
    try {
      const document = await uploadService.retryUpload(id);
      setUploadedDocuments(prev => prev.map(doc => doc.id === id ? document : doc));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to retry upload';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    isUploading,
    uploadProgress,
    uploadedDocuments,
    error,
    validationErrors,
    uploadReport,
    uploadMultiple,
    deleteDocument,
    retryUpload,
    clearError,
    reset,
  };
};

export default useUploadReport;