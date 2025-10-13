import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../AuthProvider.jsx';
import useRegister from '../api/useRegister.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const mutation = useRegister({
    onSuccess: (data) => {
      toast.success('Welcome on board!');
      login({
        token: data.token,
        user: data.user,
        expiresInMinutes: data.expiresInMinutes,
      });
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || 'Registration failed');
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(formState);
  };

  return (
    <section className="mx-auto max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
        <p className="text-sm text-slate-500">Choose your role and start organizing or attending events instantly.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="name"
            name="name"
            required
            value={formState.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="Jane Doe"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formState.email}
            onChange={handleChange}
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
            name="password"
            type="password"
            required
            value={formState.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium text-slate-700">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formState.role}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="student">Student / Attendee</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin (demo)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-500 disabled:opacity-70"
        >
          {mutation.isPending ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Sign in instead
        </Link>
      </p>
    </section>
  );
};

export default RegisterPage;
