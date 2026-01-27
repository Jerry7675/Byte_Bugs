import * as yup from 'yup';
import { PrismaEnums } from '../../enumWrapper';

const signupSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  firstName: yup.string().required(),
  middleName: yup.string(),
  lastName: yup.string().required(),
  dob: yup.string().required(),
  phoneNumber: yup.string().required(),
  role: yup.string().oneOf(['ADMIN', 'STARTUP', 'INVESTOR']).required(),
});

export async function validateSignup(data: {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  phoneNumber: string;
  role: PrismaEnums.UserRole;
}) {
  try {
    await signupSchema.validate(data);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}
