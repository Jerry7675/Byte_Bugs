import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { getContext } from '@/context/context-store';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(req: NextRequest) {
  return withRequestContext(req, async () => {
    try {
      const { user } = getContext();
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Not authenticated' },
          { status: 401 }
        );
      }

      const formData = await req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided' },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed' },
          { status: 400 }
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'File size exceeds 5MB limit' },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileExt = file.name.split('.').pop();
      const fileName = `posts/${user.id}/${timestamp}-${randomString}.${fileExt}`;

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Configure S3 client for Supabase Storage
      const s3Client = new S3Client({
        endpoint: process.env.SUPABASE_ENDPOINT,
        region: process.env.SUPABASE_REGION || 'ap-south-1',
        credentials: {
          accessKeyId: process.env.SUPABASE_BUCKET_ACCESS_KEY_ID!,
          secretAccessKey: process.env.SUPABASE_BUCKET_SECRET_ACCESS_KEY!,
        },
        forcePathStyle: true,
      });

      // Upload to Supabase S3
      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.SUPABASE_BUCKET || 'myBucket',
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      });

      await s3Client.send(uploadCommand);

      // Generate public URL
      const projectRef = process.env.SUPABASE_PROJECT_REF || 'xvdhxtrtptcxclgenuzp';
      const publicUrl = `https://${projectRef}.supabase.co/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${fileName}`;

      return NextResponse.json({
        success: true,
        data: {
          url: publicUrl,
          fileName,
        },
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to upload image' },
        { status: 500 }
      );
    }
  });
}
