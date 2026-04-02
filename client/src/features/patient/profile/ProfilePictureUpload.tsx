// src/features/patient/profile/ProfilePictureUpload.tsx
import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, UserCircle, CheckCircle, AlertCircle } from 'lucide-react';

import { Button } from '../../../components/ui/button';

interface ProfilePictureUploadProps {
  currentAvatar?: string;
  onUploadSuccess?: (url: string) => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentAvatar,
  onUploadSuccess,
  maxSizeMB = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (options: { title: string; description: string; variant: 'success' | 'error' }) => {
    // Simple alert for now - replace with your actual toast implementation
    if (options.variant === 'success') {
      alert(`${options.title}: ${options.description}`);
    } else {
      alert(`${options.title}: ${options.description}`);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }

    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      setError(`File format not supported. Please upload ${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setShowSuccess(false);

    if (!validateFile(file)) {
      event.target.value = '';
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 150);

      // API call will go here - replace with actual upload logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Mock response - replace with actual API response
      const uploadedUrl = previewUrl; // In real scenario, this would come from API
      
      setShowSuccess(true);
      showToast({
        title: 'Success',
        description: 'Profile picture updated successfully',
        variant: 'success',
      });
      
      // Call onSuccess with the uploaded URL
      if (onUploadSuccess && uploadedUrl) {
        onUploadSuccess(uploadedUrl);
      }
      
      // Auto hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image. Please try again.');
      // Reset preview if upload failed
      setPreviewUrl(currentAvatar || null);
      showToast({
        title: 'Error',
        description: 'Failed to upload profile picture',
        variant: 'error',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setError(null);
    setShowSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showToast({
      title: 'Success',
      description: 'Profile picture removed',
      variant: 'success',
    });
    if (onUploadSuccess) {
      onUploadSuccess('');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Preview */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCircle className="w-20 h-20 text-gray-400" />
          )}
        </div>

        {/* Upload Overlay */}
        {!isUploading && (
          <div className="absolute -bottom-2 -right-2 flex gap-1">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="rounded-full w-8 h-8 p-0 shadow-md hover:scale-110 transition-transform"
              onClick={triggerFileInput}
            >
              <Camera className="w-4 h-4" />
            </Button>
            {previewUrl && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="rounded-full w-8 h-8 p-0 shadow-md hover:scale-110 transition-transform"
                onClick={handleRemove}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {/* Upload Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-1" />
              <span className="text-xs text-white font-medium">{uploadProgress}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* Upload Instructions */}
      <div className="text-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload New Photo
            </>
          )}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Recommended: Square image, at least 200x200px<br />
          Max size: {maxSizeMB}MB. Formats: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && !isUploading && !error && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Profile picture updated successfully!</span>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;