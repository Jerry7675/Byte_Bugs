import { PrismaEnums } from '../../enumWrapper';
export interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  phoneNumber: string;
  role: (typeof PrismaEnums.UserRole)[keyof typeof PrismaEnums.UserRole];
}

export interface SignupResponse {
  error?: string;
  success?: boolean;
}

export async function signupUser(payload: SignupPayload): Promise<SignupResponse> {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include', //Include cookies in the request
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true };
    } else {
      return { error: data.error?.error || 'Unknown error' };
    }
  } catch {
    return { error: 'Network error' };
  }
}
