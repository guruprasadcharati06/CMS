import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../AuthProvider.jsx';
import useLogin from '../api/useLogin.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formState, setFormState] = useState({ email: '', password: '' });

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

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(formState);
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
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={formState.password}
            onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
    </section>
  );
};

export default LoginPage;
