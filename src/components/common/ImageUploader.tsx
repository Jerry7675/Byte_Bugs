'use client';

import { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  currentImage?: string | null;
  label?: string;
}

export default function ImageUploader({
  onUploadSuccess,
  currentImage,
  label = 'Upload Image',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shrink-0">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <FaCloudUploadAlt size={32} />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
              <FaSpinner className="animate-spin" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span>Change</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
          {error && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <FaExclamationCircle /> {error}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
