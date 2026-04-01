import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const res = await login(formData);

      const role = res.user.role;

      // ✅ If user came from protected page → go back there
      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
        return;
      }

      // 🔥 Otherwise role-based redirect
      if (role === "Admin") {
        navigate("/admin", { replace: true });
      } else if (role === "Vendor") {
        navigate("/vendor/dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 text-gray-900 relative overflow-hidden">
      <motion.div
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 p-8 sm:p-10 z-10"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center mb-8">
          <Logo textSize="text-3xl" />
          <p className="mt-2 text-sm text-gray-500">Welcome back! Please login to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            autoFocus={true}
            required
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 text-sm font-medium text-red-600 text-center bg-red-50 border border-red-100 rounded-lg p-3 overflow-hidden shadow-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" isLoading={isLoading} className="mt-2">
            Login
          </Button>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Signup
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
