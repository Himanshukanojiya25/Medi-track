// client/src/features/patient/services/upload.service.ts

import { httpClient } from '../../../services/api/http.client';
import type {
  UploadedDocument,
  UploadDocumentPayload,
  UploadDocumentResponse,
  DeleteDocumentResponse,
  DocumentFilters,
  DocumentListResponse,
  BulkUploadResponse,
  DocumentPreviewConfig,
} from '../../../types/patient/upload.types';
import type { ID } from '../../../types/shared';

// ============================================================================
// TYPES
// ============================================================================

export interface UploadProgressCallback {
  (progressPercent: number): void;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Determines if a MIME type can be previewed inline in the browser.
 */
const resolvePreviewConfig = (
  doc: UploadedDocument,
): DocumentPreviewConfig => {
  const mime = doc.mimeType.toLowerCase();

  if (mime.startsWith('image/')) {
    return { url: doc.fileUrl, type: 'image', canPreview: true, thumbnail: doc.metadata?.thumbnail };
  }
  if (mime === 'application/pdf') {
    return { url: doc.fileUrl, type: 'pdf', canPreview: true };
  }
  if (mime.startsWith('video/')) {
    return { url: doc.fileUrl, type: 'video', canPreview: true, thumbnail: doc.metadata?.thumbnail };
  }
  return { url: doc.fileUrl, type: 'other', canPreview: false };
};

// ============================================================================
// SERVICE
// ============================================================================

const API_BASE = '/api/v1/patients/me/documents';

export const uploadService = {

  /**
   * Get all uploaded documents (paginated + filterable)
   * GET /api/v1/patients/me/documents
   */
  list: async (filters?: DocumentFilters): Promise<DocumentListResponse> => {
    const response = await httpClient.get<DocumentListResponse>(API_BASE, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get a single document by ID
   * GET /api/v1/patients/me/documents/:id
   */
  getById: async (id: ID): Promise<UploadedDocument> => {
    const response = await httpClient.get<UploadDocumentResponse>(
      `${API_BASE}/${id}`,
    );
    return response.data.data;
  },

  /**
   * Upload a single document with optional progress tracking
   * POST /api/v1/patients/me/documents
   */
  upload: async (
    payload: UploadDocumentPayload,
    onProgress?: UploadProgressCallback,
  ): Promise<UploadedDocument> => {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('fileType', payload.fileType);
    if (payload.description) formData.append('description', payload.description);
    if (payload.isPublic !== undefined)
      formData.append('isPublic', String(payload.isPublic));
    if (payload.tags?.length)
      formData.append('tags', JSON.stringify(payload.tags));

    const response = await httpClient.post<UploadDocumentResponse>(
      API_BASE,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (onProgress && event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            onProgress(percent);
          }
        },
      },
    );
    return response.data.data;
  },

  /**
   * Upload multiple documents at once
   * POST /api/v1/patients/me/documents/bulk
   */
  bulkUpload: async (
    payloads: UploadDocumentPayload[],
    onProgress?: UploadProgressCallback,
  ): Promise<BulkUploadResponse> => {
    const formData = new FormData();
    payloads.forEach((p, idx) => {
      formData.append(`files[${idx}]`, p.file);
      formData.append(`fileTypes[${idx}]`, p.fileType);
      if (p.description) formData.append(`descriptions[${idx}]`, p.description);
    });

    const response = await httpClient.post<BulkUploadResponse>(
      `${API_BASE}/bulk`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (onProgress && event.total) {
            onProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      },
    );
    return response.data;
  },

  /**
   * Delete a document by ID
   * DELETE /api/v1/patients/me/documents/:id
   */
  delete: async (id: ID): Promise<void> => {
    await httpClient.delete<DeleteDocumentResponse>(`${API_BASE}/${id}`);
  },

  /**
   * Download a document as a Blob (for "Save as" flow)
   * GET /api/v1/patients/me/documents/:id/download
   */
  download: async (id: ID): Promise<Blob> => {
    const response = await httpClient.get(`${API_BASE}/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Trigger browser download for a document
   * (helper — does not hit the API directly, uses the Blob)
   */
  triggerBrowserDownload: async (
    id: ID,
    fileName: string,
  ): Promise<void> => {
    const blob = await uploadService.download(id);
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Resolve preview configuration for a document
   * (pure helper — no API call)
   */
  getPreviewConfig: (doc: UploadedDocument): DocumentPreviewConfig => {
    return resolvePreviewConfig(doc);
  },

} as const;

export default uploadService;