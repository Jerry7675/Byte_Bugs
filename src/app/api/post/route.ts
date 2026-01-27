import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/server/services/post/post.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, category } = body;
    const result = await PostService.createPost({ title, content, category });
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const result = await PostService.getAllPosts();
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
