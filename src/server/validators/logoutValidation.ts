import * as yup from 'yup';

const logoutSchema = yup.object({
  userId: yup.string().required(),
  sessionId: yup.string().required(),
});

export async function validateLogout(data: { userId: string; sessionId: string }) {
  try {
    await logoutSchema.validate(data);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Unknown error' };
  }
}
