import { type FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  selectIsAuthLoading,
  selectAuthError,
  loginThunk,
} from '../../store/slice/authSlice';
import type { AppDispatch } from '../../store/store';

const Login = () => {
  const dispatch  = useDispatch<AppDispatch>();
  const navigate  = useNavigate();
  const location  = useLocation();
  const isLoading = useSelector(selectIsAuthLoading);
  const authError = useSelector(selectAuthError);

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/admin/dashboard';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = await dispatch(loginThunk({ email, password }));

    if (loginThunk.fulfilled.match(result)) {
      toast.success('Welcome back');
      navigate(from, { replace: true });
    } else {
      toast.error(authError ?? 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.2em] text-[#8a7e6e] uppercase mb-1">
            Kitui · Makueni · Est. 2019
          </p>
          <h1 className="font-serif text-3xl text-[#1a2e1a]">
            Ken Mutua <span className="text-[#2d5a27]">Farms</span>
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white/70 backdrop-blur-sm border border-[#e0d8cc] rounded-sm px-8 py-10">
          <h2 className="font-serif text-xl text-[#1a2e1a] mb-1">Sign in</h2>
          <p className="text-sm text-[#8a7e6e] mb-8">Access your farm dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full bg-transparent border border-[#d0c8bc] rounded-sm px-4 py-3 text-sm text-[#1a2e1a] placeholder-[#b0a898] focus:outline-none focus:border-[#2d5a27] transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full bg-transparent border border-[#d0c8bc] rounded-sm px-4 py-3 text-sm text-[#1a2e1a] placeholder-[#b0a898] focus:outline-none focus:border-[#2d5a27] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {authError && (
              <p role="alert" className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2d5a27] hover:bg-[#1a3d16] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs tracking-widest uppercase py-3.5 rounded-sm transition-colors mt-2"
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p className="text-center mt-6 text-xs text-[#8a7e6e]">
          <a href="/" className="hover:text-[#2d5a27] transition-colors">
            ← Back to site
          </a>
        </p>

      </div>
    </div>
  );
};

export default Login;