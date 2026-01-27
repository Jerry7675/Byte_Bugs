import { loginUser } from '../../../../server/api/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    // Get user agent
    const userAgent = req.headers.get('user-agent') || undefined;

    const cookieStore = await cookies();

    const result = await loginUser({ 
        email, 
        password, 
        userAgent,
        setCookie: (name, value, options) => {
            cookieStore.set(name, value, options);
        }
    });
    
    // Check if result has error or is null (though loginUser returns object, error handling in service returns { error: ... })
    if (result && 'error' in result && result.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if success
    if (result && 'success' in result && result.success) {
         const { user } = result;
         return new Response(JSON.stringify({ user }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         });
    }
   
    return new Response(JSON.stringify({ error: 'Login failed' }), {
      status: 400,
       headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error("Login route error:", err);
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
