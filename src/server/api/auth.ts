import { validateLogin } from '../service/authService';
import { prismaService } from '../../lib/prisma.service';

export async function loginUser(params: { email: string; password: string }) {
  const { email, password } = params;
  // Validate input
  const valid = await validateLogin({ email, password });
  if (!valid.success) {
    return { error: valid.error };
  }
  // Write to DB: create user (for test/demo only)
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
