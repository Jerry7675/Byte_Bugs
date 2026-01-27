import { loginUserService, testLoginService } from '../services/authService';

// Controller: delegates to service
export async function loginUser(params: { email: string; password: string }) {
  return await loginUserService(params);
}

export async function testLogin(params: { email: string; password: string }) {
  return await testLoginService(params);
}
