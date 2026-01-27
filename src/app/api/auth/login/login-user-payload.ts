export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  error?: string;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    const accessToken = res.headers.get('Authorization')?.replace('Bearer ', '');
    if (res.ok) {
      return { accessToken };
    } else {
      return { error: data.error?.error || 'Unknown error' };
    }
  } catch {
    return { error: 'Network error' };
  }
}
