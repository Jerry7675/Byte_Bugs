export async function resendOtp({ email }: { email: string }) {
  const res = await fetch('/api/auth/otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, resend: true }),
  });
  return res.json();
}
