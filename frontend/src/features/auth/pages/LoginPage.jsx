import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../AuthProvider.jsx';
import useLogin from '../api/useLogin.js';
import useRequestPasswordOtp from '../api/useRequestPasswordOtp.js';
import useResetPasswordWithOtp from '../api/useResetPasswordWithOtp.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetStep, setResetStep] = useState('request');
  const [resetState, setResetState] = useState({ email: '', otp: '', password: '', confirmPassword: '' });

  const mutation = useLogin({
    onSuccess: (data) => {
      login({
        token: data.token,
        user: data.user,
        expiresInMinutes: data.expiresInMinutes,
      });
      toast.success('Welcome back!');
      const next = location.state?.from?.pathname || '/dashboard';
      navigate(next, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to login');
    },
  });

  const requestOtpMutation = useRequestPasswordOtp({
    onSuccess: () => {
      toast.success('OTP sent to your email');
      setResetStep('verify');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send OTP');
    },
  });

  const resetPasswordMutation = useResetPasswordWithOtp({
    onSuccess: () => {
      toast.success('Password updated. You can sign in now.');
      setIsResetOpen(false);
      setResetStep('request');
      setResetState({ email: '', otp: '', password: '', confirmPassword: '' });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(formState);
  };

  const handleRequestOtp = (event) => {
    event.preventDefault();
    if (!resetState.email) {
      toast.error('Enter your email');
      return;
    }
    requestOtpMutation.mutate({ email: resetState.email });
  };

  const handleResetPassword = (event) => {
    event.preventDefault();
    if (resetState.password !== resetState.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    resetPasswordMutation.mutate({
      email: resetState.email,
      otp: resetState.otp,
      password: resetState.password,
    });
  };

  const closeResetModal = () => {
    setIsResetOpen(false);
    setResetStep('request');
    setResetState({ email: '', otp: '', password: '', confirmPassword: '' });
    requestOtpMutation.reset();
    resetPasswordMutation.reset();
  };

  return (
    <section className="mx-auto max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
        <p className="text-sm text-slate-500">Access your dashboard to manage events and registrations.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={formState.email}
            onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <button
              type="button"
              onClick={() => setIsResetOpen(true)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </button>
          </div>
          <input
            id="password"
            type="password"
            required
            value={formState.password}
            onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-500 disabled:opacity-70"
        >
          {mutation.isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Need an account?{' '}
        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Register now
        </Link>
      </p>

      {isResetOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
          <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-6 shadow-lg">
            <header>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  {resetStep === 'request' ? 'Reset password' : 'Set new password'}
                </h2>
                <button
                  type="button"
                  onClick={closeResetModal}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Close
                </button>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {resetStep === 'request'
                  ? 'Enter your account email and we will send you a verification code.'
                  : 'Enter the OTP you received and choose a new password.'}
              </p>
            </header>

            {resetStep === 'request' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="reset-email" className="text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetState.email}
                    onChange={(event) =>
                      setResetState((prev) => ({ ...prev, email: event.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={requestOtpMutation.isPending}
                  className="w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-500 disabled:opacity-70"
                >
                  {requestOtpMutation.isPending ? 'Sending code…' : 'Send reset code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="reset-otp" className="text-sm font-medium text-slate-700">
                    OTP code
                  </label>
                  <input
                    id="reset-otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    required
                    value={resetState.otp}
                    onChange={(event) =>
                      setResetState((prev) => ({ ...prev, otp: event.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="6-digit OTP"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="reset-password" className="text-sm font-medium text-slate-700">
                    New password
                  </label>
                  <input
                    id="reset-password"
                    type="password"
                    required
                    value={resetState.password}
                    onChange={(event) =>
                      setResetState((prev) => ({ ...prev, password: event.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="reset-confirm" className="text-sm font-medium text-slate-700">
                    Confirm password
                  </label>
                  <input
                    id="reset-confirm"
                    type="password"
                    required
                    value={resetState.confirmPassword}
                    onChange={(event) =>
                      setResetState((prev) => ({ ...prev, confirmPassword: event.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="Repeat password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-500 disabled:opacity-70"
                >
                  {resetPasswordMutation.isPending ? 'Updating…' : 'Update password'}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default LoginPage;
