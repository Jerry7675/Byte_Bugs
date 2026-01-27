import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  forcePathStyle: true,
  region: process.env.SUPABASE_REGION || 'ap-south-1',
  endpoint: process.env.SUPABASE_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.SUPABASE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SUPABASE_SECRET_ACCESS_KEY!,
  },
});

export async function uploadImageToSupabase(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
  const bucket = process.env.SUPABASE_BUCKET || 'uploads';

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: filename,
    Body: buffer,
    ContentType: file.type,
    ACL: 'public-read',
  });

  await s3Client.send(command);

  // Construct public URL
  const projectRef = process.env.SUPABASE_PROJECT_REF || 'xvdhxtrtptcxclgenuzp';
  const publicUrl = `https://${projectRef}.supabase.co/storage/v1/object/public/${bucket}/${filename}`;
  return publicUrl;
}
