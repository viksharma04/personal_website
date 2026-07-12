// app/api/[...path]/route.ts (App Router)

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// Env vars this route needs to talk to S3. AWS credentials and region are
// read by the v3 SDK's default provider chain from AWS_ACCESS_KEY_ID /
// AWS_SECRET_ACCESS_KEY / AWS_REGION; S3_BUCKET_NAME is used below.
const REQUIRED_ENV = [
  'S3_BUCKET_NAME',
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
] as const;

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    // region comes from AWS_REGION; credentials from the default env provider
    // chain (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY).
    s3Client = new S3Client({ region: process.env.AWS_REGION });
  }
  return s3Client;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missingEnv.length > 0) {
    const list = missingEnv.join(', ');
    console.error(`S3 not configured: missing env var(s) ${list}`);
    return NextResponse.json(
      { error: `S3 is not configured: set ${list} (see .env.example)` },
      { status: 500 }
    );
  }

  try {
    const resolvedParams = await params;
    const key = resolvedParams.path.join('/');

    if (!key) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 });
    }

    // Fetch the file data directly from S3
    const object = await getS3Client().send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      })
    );

    if (!object.Body) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // v3 returns a streaming Body; collect it into bytes for the response.
    const uint8ArrayBody = await object.Body.transformToByteArray();

    // Return the file data with proper headers
    return new NextResponse(uint8ArrayBody, {
      status: 200,
      headers: {
        'Content-Type': object.ContentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': object.ContentLength?.toString() || '',
      },
    });

  } catch (error: unknown) {
    console.error('S3 Error:', error);

    // v3 surfaces the S3 error code on `name` (e.g. "NoSuchKey").
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as { name?: string }).name === 'NoSuchKey'
    ) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch file from S3' },
      { status: 500 }
    );
  }
}
