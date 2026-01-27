import { loginUserService } from '../../services/auth/authService';
import { logoutUserService } from '../../services/auth/authService';
import { signupUserService } from '../../services/auth/authService';
export async function signupUser(params: {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  phoneNumber: string;
}) {
  return await signupUserService(params);
}
export async function loginUser(params: { email: string; password: string; userAgent?: string }) {
  return await loginUserService(params);
}
export async function logoutUser(params: { userId: string; sessionId: string }) {
  return await logoutUserService(params);
}
