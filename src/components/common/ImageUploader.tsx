'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import {
  FaCloudUploadAlt,
  FaSpinner,
  FaExclamationCircle,
  FaUser,
  FaBuilding,
} from 'react-icons/fa';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  currentImage?: string | null;
  label?: string;
  isCompany?: boolean; // To determine which icon to show
}

const ACCEPTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUploader({
  onUploadSuccess,
  currentImage,
  label = 'Upload Image',
  isCompany = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Update preview when currentImage changes
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
      setImageError(false);
    }
  }, [currentImage]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_IMAGE_FORMATS.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        onUploadSuccess(response.data.url);
        setImageError(false);
      } else {
        throw new Error(response.data.error || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
      setPreview(currentImage || null); // Revert preview on error
    } finally {
      setUploading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full overflow-hidden border-2 border-gray-300 shrink-0 shadow-sm">
          {preview && !imageError ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              {isCompany ? <FaBuilding size={32} /> : <FaUser size={32} />}
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
              <FaSpinner className="animate-spin" size={24} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="cursor-pointer bg-green-600 hover:bg-green-700 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm leading-4 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <span className="flex items-center gap-2">
              <FaCloudUploadAlt size={16} />
              {preview && !imageError ? 'Change Image' : 'Upload Image'}
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
          {error && (
            <span className="text-xs text-red-600 flex items-center gap-1">
              <FaExclamationCircle /> {error}
            </span>
          )}
          {!error && <span className="text-xs text-gray-500">JPEG, PNG, WebP, GIF (max 5MB)</span>}
        </div>
      </div>
    </div>
  );
}
