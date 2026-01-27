import { loginUser } from '../../../../server/api/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    // Get user agent
    const userAgent = req.headers.get('user-agent') || undefined;

    const result = await loginUser({ email, password, userAgent });
    if (result !== null && 'error' in result) {
      return new Response(JSON.stringify({ error: result }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Only send user info in body, set accessToken as header
    const { accessToken, user } = result;
    const responseHeaders = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
