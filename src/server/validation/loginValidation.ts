import * as yup from 'yup';

const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

export async function validateLogin(data: { email: string; password: string }) {
  try {
    await loginSchema.validate(data);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}
