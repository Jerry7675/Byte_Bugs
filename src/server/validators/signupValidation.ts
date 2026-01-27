import * as yup from 'yup';

const signupSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  firstName: yup.string().required(),
  middleName: yup.string(),
  lastName: yup.string().required(),
  dob: yup.string().required(),
  phoneNumber: yup.string().required(),
});

export async function validateSignup(data: {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  phoneNumber: string;
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
