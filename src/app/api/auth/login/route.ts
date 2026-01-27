import { loginUser, testLogin } from '../../../../server/api/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const result = await testLogin({ email, password });
    if (result !== null && 'error' in result) {
      return new Response(JSON.stringify({ error: result }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
