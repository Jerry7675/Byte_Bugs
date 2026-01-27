export interface ResetPasswordRequest {
  password: string;
  token: string;
}

export interface ResetPasswordResponse {
  message?: string;
  error?: string;
}

export async function resetPassword(payload: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  try {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    const data = await res.json();
    if (res.ok) {
      return { message: data.message };
    } else {
      return { error: data.error || 'Unknown error' };
    }
  } catch {
    return { error: 'Network error' };
  }
}
