import type { Metadata } from 'next';
import ForgotPasswordClient from './ForgotPasswordClient';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your EzyCV account password. Enter your email and we will send you a reset link.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ForgotPasswordClient />;
}
