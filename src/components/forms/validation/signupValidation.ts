import * as yup from 'yup';

export const signupSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  middleName: yup.string(),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  dob: yup.string().required('Date of birth is required'),
  phoneNumber: yup.string().required('Phone number is required'),
});
