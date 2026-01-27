export interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  phoneNumber: string;
}

export interface SignupResponse {
  error?: string;
}

export async function signupUser(payload: SignupPayload): Promise<SignupResponse> {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      return {};
    } else {
      return { error: data.error?.error || 'Unknown error' };
    }
  } catch {
    return { error: 'Network error' };
  }
}
