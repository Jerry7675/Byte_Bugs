import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/server/services/post/post.service';
import { withRequestContext } from '@/context/init-request-context';

export async function POST(req: NextRequest) {
  return withRequestContext(req, async () => {
    try {
      const body = await req.json();
      const { postId } = body;

      if (!postId) {
        return NextResponse.json({ success: false, error: 'Post ID is required' }, { status: 400 });
      }

      const result = await PostService.boostPost(postId);

      return NextResponse.json({
        success: true,
        data: result,
        message: 'Post boosted successfully!',
      });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
  });
}

export async function GET(req: NextRequest) {
  return withRequestContext(req, async () => {
    try {
      const info = await PostService.getBoostInfo();

      return NextResponse.json({
        success: true,
        data: info,
      });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
  });
}
