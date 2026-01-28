'use client';
import { useState } from 'react';
import { createPost, uploadImage, type CreatePostPayload } from '@/client/api/post-api';
import { Button } from '../ui/button';
import Image from 'next/image';
import { toast } from 'sonner';

interface CreatePostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreatePostForm({ onSuccess, onCancel }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'FINTECH' | 'HEALTH' | 'AI' | 'OTHER'>('FINTECH');
  const [postType, setPostType] = useState<'FUNDING_REQUEST' | 'INVESTMENT_OFFER' | 'UPDATE' | 'ANNOUNCEMENT' | 'MILESTONE' | 'OTHER'>('UPDATE');
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        toast.error('Only JPEG, PNG, WebP, and GIF images are allowed');
        return;
      }

      setImageFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let imageUrl: string | undefined;

      // Upload image if selected
      if (imageFile) {
        setUploading(true);
        const uploadResult = await uploadImage(imageFile);
        setUploading(false);

        if (!uploadResult.success || !uploadResult.data) {
          setError(uploadResult.error || 'Failed to upload image');
          setLoading(false);
          return;
        }

        imageUrl = uploadResult.data.url;
      }

      // Parse tags
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Create post
      const payload: CreatePostPayload = {
        title,
        content,
        category,
        postType,
        imageUrl,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      };

      const result = await createPost(payload);

      if (result.success) {
        // Reset form
        setTitle('');
        setContent('');
        setCategory('FINTECH');
        setPostType('UPDATE');
        setTags('');
        setImageFile(null);
        setImagePreview(null);
        onSuccess?.();
      } else {
        setError(result.error || 'Failed to create post');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Create New Post</h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter post title"
        />
        <p className="text-xs text-gray-500 mt-1">{title.length}/200 characters</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="FINTECH">FinTech</option>
            <option value="HEALTH">Health</option>
            <option value="AI">AI</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="postType" className="block text-sm font-medium text-gray-700 mb-1">
            Post Type *
          </label>
          <select
            id="postType"
            value={postType}
            onChange={(e) => setPostType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="UPDATE">Update</option>
            <option value="FUNDING_REQUEST">Funding Request</option>
            <option value="INVESTMENT_OFFER">Investment Offer</option>
            <option value="ANNOUNCEMENT">Announcement</option>
            <option value="MILESTONE">Milestone</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content *
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          maxLength={5000}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Write your post content..."
        />
        <p className="text-xs text-gray-500 mt-1">{content.length}/5000 characters</p>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma-separated)
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g. series-a, saas, b2b"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image (optional, max 5MB)
        </label>
        
        {imagePreview ? (
          <div className="relative">
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg
                className="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm text-gray-600">
                Click to upload an image
              </span>
              <span className="text-xs text-gray-500 mt-1">
                JPEG, PNG, WebP, or GIF (max 5MB)
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading || uploading}
          className="flex-1"
        >
          {uploading ? 'Uploading Image...' : loading ? 'Creating Post...' : 'Create Post'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading || uploading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
