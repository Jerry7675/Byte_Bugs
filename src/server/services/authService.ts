import { prismaService } from '../../lib/prisma.service';
import { validateLogin } from '../validators/loginValidation';
import { JwtService } from '../lib/jwt.service';

export async function loginUserService(params: { email: string; password: string }) {
  const { email, password } = params;
  //Validate input
  const valid = await validateLogin({ email, password });
  if (!valid.success) {
    return { error: valid.error };
  }
  //test only hai
  const prisma = prismaService.getClient();
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password,
        firstName: 'Test',
        lastName: 'User',
        dob: new Date('2000-01-01'),
        phoneNumber: '1234567890',
        role: 'user', // default role
      },
    });
    return { success: true, user };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}
//testing ko lagi hai tw
export async function testLoginService(params: { email: string; password: string }) {
  const user = params;

  const valid = await validateLogin({ email: user.email, password: user.password });
  if (!valid.success) {
    return { error: valid.error };
  }
  const prisma = prismaService.getClient();
  try {
    const userInDb = await prisma.user.findUnique({
      where: { email: user.email, password: user.password },
    });
    if (userInDb?.password === user.password) {
      const token = JwtService.sign({ userId: userInDb.id, role: userInDb.role ?? 'user' });
      return { success: true, userInDb, token };
    } else {
      return { error: 'Invalid credentials' };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}
