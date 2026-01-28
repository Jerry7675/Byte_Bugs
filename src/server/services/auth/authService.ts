import { validateLogout } from '../../validators/logoutValidation';
import { validateLogin } from '../../validators/loginValidation';
import { JwtService } from '../../lib/jwt.service';
import { addMinutes } from 'date-fns';
import { hashString } from '../../lib/hash.service';
import { validateSignup } from '../../validators/signupValidation';
import { PrismaEnums } from '../../../enumWrapper';
import { logger } from '../../lib/logger';
import { getContext } from '@/context/context-store';
import { MessagingService } from '../messaging/messaging.service';

export async function signupUserService(params: {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  phoneNumber: string;
  role: PrismaEnums.UserRole;
}) {
  const { email, password, firstName, middleName, lastName, dob, phoneNumber, role } = params;
  const valid = await validateSignup({
    email,
    password,
    firstName,
    middleName,
    lastName,
    dob,
    phoneNumber,
    role,
  });
  if (!valid.success) {
    logger.warn('Signup validation failed', { error: valid.error });
    return { error: valid.error };
  }
  const { prisma } = getContext();
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      logger.warn('Attempt to signup with existing user', { email });
      return { error: 'User already exists' };
    }
    const salt = process.env.APP_SALT;
    if (!salt) {
      logger.error('APP_SALT is not defined in environment variables');
      throw new Error('APP_SALT is not defined in environment variables');
    }
    const hashedPassword = hashString(password, salt);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        middleName,
        lastName,
        role: PrismaEnums.UserRole[role],
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
    logger.error('Signup error', { error });
    if (error instanceof Error) {
      return { error: error.message, success: false };
    }
    return { error: 'Unknown error' };
  }
}

// Modified to set the access token in an HTTP-only cookie
export async function loginUserService(params: {
  email: string;
  password: string;
  userAgent?: string;
  setCookie?: (name: string, value: string, options?: any) => void;
}) {
  const { email, password, userAgent, setCookie } = params;
  const valid = await validateLogin({ email, password, userAgent });
  if (!valid.success) {
    logger.warn('Login validation failed', { error: valid.error });
    return { error: valid.error };
  }
  const { prisma } = getContext();
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      logger.warn('Login attempt for non-existent user', { email });
      return { error: 'User not found' };
    }
    const salt = process.env.APP_SALT;
    if (!salt) {
      logger.error('APP_SALT is not defined in environment variables');
      throw new Error('APP_SALT is not defined in environment variables');
    }
    if (user.password !== hashString(password, salt)) {
      logger.warn('Invalid login credentials', { email });
      return { error: 'Invalid credentials' };
    }

    const existingSession = await prisma.session.findFirst({
      where: { userId: user.id },
    });

    if (existingSession) {
      await prisma.session.delete({
        where: { id: existingSession.id },
      });
    }
    const AccessTokenExpiryMinutes = 60;

    // Generate access token only
    const accessToken = JwtService.sign({ id: user.id, email: user.email, role: user.role });
    const accessTokenExpiresAt = addMinutes(new Date(), AccessTokenExpiryMinutes); // 1 hour for access token

    // Store session
    await prisma.session.create({
      data: {
        userId: user.id,
        accessToken,
        expiresAt: accessTokenExpiresAt,
        userAgent,
      },
    });

    // Set the access token in an HTTP-only cookie if setCookie is provided
    if (typeof setCookie === 'function') {
      setCookie('accessToken', accessToken, {
        httpOnly: false,
        secure: false, // fasle as we are using in dev , i.e http
        sameSite: 'lax',
        path: '/',
        maxAge: AccessTokenExpiryMinutes * 60 * 2, // 2 hours for now hai
      });
    }

    // Cleanup expired messages on login
    try {
      const messagingService = new MessagingService();
      await messagingService.cleanupExpiredMessages(user.id);
      logger.info('Cleaned up expired messages on login', { userId: user.id });
    } catch (cleanupError) {
      // Don't fail login if cleanup fails
      logger.error('Failed to cleanup expired messages on login', {
        userId: user.id,
        error: cleanupError,
      });
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    logger.error('Login error', { error });
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
    logger.warn('Logout validation failed', { error: valid.error });
    return { error: valid.error };
  }
  const { prisma } = getContext();
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
    logger.error('Logout error', { error });
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}
