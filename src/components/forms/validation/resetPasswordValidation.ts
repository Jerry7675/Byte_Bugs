export function validateResetPassword(password: string, confirmPassword: string): string | null {
  if (!password || !confirmPassword) {
    return 'Please fill in all fields.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  // Add more rules as needed (e.g., complexity)
  return null;
}
