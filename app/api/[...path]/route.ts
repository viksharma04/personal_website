// app/api/[...path]/route.ts (App Router)

import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const key = params.path.join('/');
    
    if (!key) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 });
    }

    // Fetch the file data directly from S3
    const object = await s3.getObject({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key
    }).promise();

    const body = object.Body as Buffer;
    const uint8ArrayBody = new Uint8Array(body);

    // Return the file data with proper headers
    return new NextResponse(uint8ArrayBody, {
      status: 200,
      headers: {
        'Content-Type': object.ContentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': object.ContentLength?.toString() || '',
      },
    });

  } catch (error: any) {
    console.error('S3 Error:', error);
    
    if (error.code === 'NoSuchKey') {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch file from S3' },
      { status: 500 }
    );
  }
}