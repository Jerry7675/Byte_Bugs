import * as yup from 'yup';

export const forgotPasswordRequestSchema = yup.object().shape({
  email: yup.string().email().required(),
});

export const otpVerifySchema = yup.object().shape({
  email: yup.string().email().required(),
  otp: yup.string().min(4).max(8).required(),
});
export const emailSchema = yup.object().shape({
  email: yup.string().email().required(),
});
export const passwordResetSchema = yup.object().shape({
  password: yup.string().min(8).required(),
  token: yup.string().required(),
});
