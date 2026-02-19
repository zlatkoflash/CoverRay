import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 1. Get parameters from the URL
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');
  const token = searchParams.get('token');

  // 2. Security Check: Validate the token
  const SECRET_TOKEN = "derkoskiA1";

  if (token !== SECRET_TOKEN) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid token. Access denied.", invalidToken: token }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 3. Validation: Ensure a tag was actually provided
  if (!tag) {
    return new NextResponse(
      JSON.stringify({ message: "Missing 'tag' parameter in URL." }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 4. Clear the cache using the mandatory second argument for Next.js 15/16
  // "max" uses Stale-While-Revalidate (SWR) logic
  revalidateTag(tag, "max");

  // 5. Return success message
  return new NextResponse(
    `<html>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f0f2f5;">
        <div style="text-align: center; background: white; border: 1px solid #ddd; padding: 3rem; border-radius: 12px; shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h1 style="color: #0070f3; margin-bottom: 1rem;">Cache Cleared!</h1>
          <p style="font-size: 1.1rem; color: #333;">
            The cache tag <span style="background: #eee; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${tag}</span> is now stale.
          </p>
          <p style="color: #666;">Fresh data will be fetched on the next page visit.</p>
          <hr style="margin: 2rem 0; border: 0; border-top: 1px solid #eee;" />
          <a href="/" style="color: #0070f3; text-decoration: none; font-weight: bold;">← Return to Site</a>
        </div>
      </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}