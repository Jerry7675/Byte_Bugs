import { signupUser } from '../../../../server/api/auth';
import { withRequestContext } from '@/context/init-request-context';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return withRequestContext(req, async () => {
    try {
      const { email, password, firstName, middleName, lastName, dob, phoneNumber, role } =
        await req.json();
      const result = await signupUser({
        email,
        password,
        firstName,
        middleName,
        lastName,
        dob,
        phoneNumber,
        role,
      });
      if (result !== null && 'error' in result) {
        return new NextResponse(JSON.stringify({ error: result.error }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new NextResponse(JSON.stringify({ user: result.user }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new NextResponse(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  });
}
