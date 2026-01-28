export interface CreatePostPayload {
  title: string;
  content: string;
  category: 'FUNDING' | 'TECHNOLOGY' | 'MARKETING' | 'OPERATIONS' | 'GENERAL';
  postType?: 'FUNDING_REQUEST' | 'INVESTMENT_OFFER' | 'UPDATE' | 'ANNOUNCEMENT' | 'MILESTONE' | 'OTHER';
  imageUrl?: string;
  tags?: string[];
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  imageUrl?: string;
  category: string;
  postType: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isVerified: boolean;
  };
}

export interface PostsResponse {
  success: boolean;
  data?: {
    posts: Post[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  error?: string;
}

export interface PostResponse {
  success: boolean;
  data?: Post;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    fileName: string;
  };
  error?: string;
}

// Upload image to Supabase
export async function uploadImage(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    const data = await res.json();
    return data;
  } catch {
    return { success: false, error: 'Network error during upload' };
  }
}

// Create a new post
export async function createPost(payload: CreatePostPayload): Promise<PostResponse> {
  try {
    const res = await fetch('/api/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, error: 'Network error' };
  }
}

// Get all posts with pagination and filters
export async function getPosts({
  page = 1,
  limit = 20,
  category,
  postType,
}: {
  page?: number;
  limit?: number;
  category?: string;
  postType?: string;
} = {}): Promise<PostsResponse> {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (category) params.append('category', category);
    if (postType) params.append('postType', postType);

    const res = await fetch(`/api/post?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, error: 'Network error' };
  }
}

// Get posts by author
export async function getPostsByAuthor(authorId: string): Promise<{ success: boolean; data?: Post[]; error?: string }> {
  try {
    const res = await fetch(`/api/post/author/${authorId}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, error: 'Network error' };
  }
}

// Get single post
export async function getPostById(id: string): Promise<PostResponse> {
  try {
    const res = await fetch(`/api/post/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, error: 'Network error' };
  }
}

// Delete post
export async function deletePost(id: string): Promise<PostResponse> {
  try {
    const res = await fetch(`/api/post/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, error: 'Network error' };
  }
}

// Update post
export async function updatePost(id: string, payload: Partial<CreatePostPayload>): Promise<PostResponse> {
  try {
    const res = await fetch(`/api/post/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, error: 'Network error' };
  }
}
