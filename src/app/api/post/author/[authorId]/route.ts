import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/server/services/post/post.service';
import { withRequestContext } from '@/context/init-request-context';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ authorId: string }> }
) {
  return withRequestContext(req, async () => {
    try {
      const { authorId } = await params;
      const result = await PostService.getPostsByAuthor(authorId);
      return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
  });
}
