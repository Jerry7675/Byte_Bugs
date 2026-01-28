import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/server/services/post/post.service';
import { withRequestContext } from '@/context/init-request-context';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRequestContext(req, async () => {
    try {
      const { id } = await params;
      const result = await PostService.getPostById(id);
      
      if (!result) {
        return NextResponse.json(
          { success: false, error: 'Post not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRequestContext(req, async () => {
    try {
      const { id } = await params;
      await PostService.deletePost(id);
      return NextResponse.json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRequestContext(req, async () => {
    try {
      const { id } = await params;
      const body = await req.json();
      const { title, content, category, postType, imageUrl, tags } = body;
      
      const result = await PostService.updatePost({
        id,
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
