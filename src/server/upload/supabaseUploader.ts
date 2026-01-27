// src/server/upload/supabaseUploader.ts

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.SUPABASE_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.SUPABASE_BUCKET_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SUPABASE_BUCKET_SECRET_ACCESS_KEY!,
  },
});
console.log(
  'Supabase S3 Client initialized with endpoint:',
  process.env.SUPABASE_ENDPOINT,
  'and region:',
  'us-east-1',
  'using bucket:',
  process.env.SUPABASE_BUCKET,
  process.env.SUPABASE_ACCESS_KEY_ID,
  process.env.SUPABASE_ACCESS_KEY_ID,
  process.env.SUPABASE_BUCKET,
);

export async function uploadImageToSupabase(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
  const bucket = process.env.SUPABASE_BUCKET || 'uploads';
  console.log('Uploading to Supabase bucket:', bucket, 'with filename:', filename);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: filename,
    Body: buffer,
    ContentType: file.type,
  });

  await s3Client.send(command);

  const projectRef = process.env.SUPABASE_PROJECT_REF!;
  return `https://${projectRef}.supabase.co/storage/v1/object/public/${bucket}/${filename}`;
}
