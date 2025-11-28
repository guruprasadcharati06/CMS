import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../AuthProvider.jsx';
import useRegister from '../api/useRegister.js';
import useRequestRegistrationOtp from '../api/useRequestRegistrationOtp.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    otp: '',
    college: '',
    phone: '',
  });
  const [otpSent, setOtpSent] = useState(false);

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

  const requestOtpMutation = useRequestRegistrationOtp({
    onSuccess: () => {
      setOtpSent(true);
      toast.success('OTP sent to your email');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send OTP');
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

  const handleRequestOtp = () => {
    if (!formState.email) {
      toast.error('Enter an email first');
      return;
    }

    requestOtpMutation.mutate({ email: formState.email });
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
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formState.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="Enter 10-digit phone"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="otp" className="text-sm font-medium text-slate-700">
              Email OTP
            </label>
            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={requestOtpMutation.isPending || !formState.email}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 disabled:opacity-60"
            >
              {requestOtpMutation.isPending ? 'Sending…' : otpSent ? 'Resend OTP' : 'Send OTP'}
            </button>
          </div>
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            required
            value={formState.otp}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="Enter 6-digit OTP"
          />
          <p className="text-xs text-slate-500">Check your inbox for the 6-digit code. OTP expires in 10 minutes.</p>
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
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="student">Student / Attendee</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin (demo)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="college" className="text-sm font-medium text-slate-700">
            College
          </label>
          <input
            id="college"
            name="college"
            type="text"
            required
            value={formState.college}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="e.g. Sunrise Institute of Technology"
          />
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
