import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/server/services/post/post.service';
import { withRequestContext } from '@/context/init-request-context';

export async function POST(req: NextRequest) {
  return withRequestContext(req, async () => {
    try {
      const body = await req.json();
      const { title, content, category, postType, imageUrl, tags } = body;
      
      // Validation
      if (!title || !content || !category) {
        return NextResponse.json(
          { success: false, error: 'Title, content, and category are required' },
          { status: 400 }
        );
      }
      
      if (title.length > 200) {
        return NextResponse.json(
          { success: false, error: 'Title must be less than 200 characters' },
          { status: 400 }
        );
      }
      
      if (content.length > 5000) {
        return NextResponse.json(
          { success: false, error: 'Content must be less than 5000 characters' },
          { status: 400 }
        );
      }

      const result = await PostService.createPost({
        title,
        content,
        category,
        postType,
        imageUrl,
        tags,
      });
      
      return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
  });
}

export async function GET(req: NextRequest) {
  return withRequestContext(req, async () => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const category = searchParams.get('category') as any;
      const postType = searchParams.get('postType') as any;
      
      const result = await PostService.getAllPosts({
        page,
        limit,
        category,
        postType,
      });
      
      return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
  });
}
