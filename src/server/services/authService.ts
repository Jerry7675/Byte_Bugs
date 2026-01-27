import { validateLogout } from '../validators/logoutValidation';
import { prismaService } from '../../lib/prisma.service';
import { validateLogin } from '../validators/loginValidation';
import { JwtService } from '../lib/jwt.service';
import { addMinutes } from 'date-fns';
import { generateSalt, hashString } from '../lib/hash.service';
import { validateSignup } from '../validators/signupValidation';

export async function signupUserService(params: {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  phoneNumber: string;
}) {
  const { email, password, firstName, middleName, lastName, dob, phoneNumber } = params;
  const valid = await validateSignup({
    email,
    password,
    firstName,
    middleName,
    lastName,
    dob,
    phoneNumber,
  });
  if (!valid.success) {
    return { error: valid.error };
  }
  const prisma = prismaService.getClient();
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'User already exists' };
    }
    const salt = process.env.APP_SALT || generateSalt();
    const hashedPassword = hashString(password, salt);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        middleName,
        lastName,
        role: 'user',
        dob: new Date(dob),
        phoneNumber,
      },
    });
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        dob: user.dob,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}

export async function loginUserService(params: {
  email: string;
  password: string;
  userAgent?: string;
}) {
  const { email, password, userAgent } = params;
  const valid = await validateLogin({ email, password, userAgent });
  if (!valid.success) {
    return { error: valid.error };
  }
  const prisma = prismaService.getClient();
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    const salt = process.env.APP_SALT || '';
    if (!user || user.password !== hashString(password, salt)) {
      return { error: 'Invalid credentials' };
    }

    const AccessTokenExpiryMinutes = 60; // 1 hour

    // Generate access token only
    const accessToken = JwtService.sign({ userId: user.id, role: user.role });
    const accessTokenExpiresAt = addMinutes(new Date(), AccessTokenExpiryMinutes); // 1 hour for access token

    // Store session (no refresh token)
    await prisma.session.create({
      data: {
        userId: user.id,
        accessToken,
        expiresAt: accessTokenExpiresAt,
        userAgent,
      },
    });

    return {
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}
export async function logoutUserService(params: { userId: string; sessionId: string }) {
  const { userId, sessionId } = params;
  const valid = await validateLogout({ userId, sessionId });
  if (!valid.success) {
    return { error: valid.error };
  }
  const prisma = prismaService.getClient();
  try {
    // Destroy the session
    await prisma.session.delete({
      where: {
        id: sessionId,
        userId: userId,
      },
    });
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}
