import { PostService } from '@/server/services/post/post.service';

export async function createPost(params: {
  title: string;
  content: string;
  category: keyof typeof import('@/enumWrapper').PrismaEnums.PostCategory;
}) {
  return await PostService.createPost(params);
}

export async function getAllPosts() {
  return await PostService.getAllPosts();
}
