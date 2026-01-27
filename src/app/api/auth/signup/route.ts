import { signupUser } from '../../../../server/api/auth';

export async function POST(req: Request) {
  try {
    const { email, password, firstName, middleName, lastName, dob, phoneNumber } = await req.json();
    const result = await signupUser({
      email,
      password,
      firstName,
      middleName,
      lastName,
      dob,
      phoneNumber,
    });
    if (result !== null && 'error' in result) {
      return new Response(JSON.stringify({ error: result }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ user: result.user }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
