export interface OtpVerifyRequest {
  email: string;
  otp: string;
}

export interface OtpVerifyResponse {
  token?: string;
  error?: string;
}

export async function verifyOtp(payload: OtpVerifyRequest): Promise<OtpVerifyResponse> {
  try {
    const res = await fetch('/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    const data = await res.json();
    if (res.ok) {
      return { token: data.token };
    } else {
      return { error: data.error || 'Unknown error' };
    }
  } catch {
    return { error: 'Network error' };
  }
}
