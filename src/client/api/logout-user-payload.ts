export interface LogoutRequest {
  userId: string;
  sessionId: string;
}

export interface LogoutResponse {
  success?: boolean;
  error?: string;
}

export async function logoutUser(payload: LogoutRequest): Promise<LogoutResponse> {
  try {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true };
    } else {
      return { error: data.error || 'Unknown error' };
    }
  } catch {
    return { error: 'Network error' };
  }
}
