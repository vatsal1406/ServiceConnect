import { useState, useRef } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Store, Sparkles, Droplet, Zap, Fan, Brush, Hammer, Wrench, Bug } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import InputField from '../components/InputField';
import Button from '../components/Button';

const SERVICES_LIST = [
  { id: 'cleaning', name: 'Cleaning', icon: Sparkles },
  { id: 'plumbing', name: 'Plumbing', icon: Droplet },
  { id: 'electrician', name: 'Electrician', icon: Zap },
  { id: 'ac_repair', name: 'AC Repair', icon: Fan },
  { id: 'painting', name: 'Painting', icon: Brush },
  { id: 'carpentry', name: 'Carpentry', icon: Hammer },
  { id: 'appliance-repair', name: 'Appliance Repair', icon: Wrench },
  { id: 'pest-control', name: 'Pest Control', icon: Bug }
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup, login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: 'Customer', // Default to Customer (User)
  });

  const [selectedServices, setSelectedServices] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    if (error) setError('');
    // Clear services if switching away from Vendor
    if (role !== 'Vendor') {
      setSelectedServices([]);
    }
  };

  const toggleService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
    if (error) setError('');
  };

  const debounceRef = useRef(null);

  const handleSearch = (value) => {
    setQuery(value);

    // clear previous timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (value.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/users/search-location?q=${value}`
        );

        console.log("Response status:", res.status);

        const text = await res.text();
        console.log("Raw response:", text);

        let data = [];
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("JSON parse error:", e);
        }

        console.log("Parsed data:", data);

        setSuggestions(data);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 600); // 🔥 slightly increased delay
  };

  const handleSelect = (place) => {
    setLocation({
      address: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    });

    setQuery(place.display_name);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.mobile) {
      setError('Please fill in all basic fields.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.role === 'Vendor' && selectedServices.length === 0) {
      setError('Please select at least one service you provide.');
      return;
    }

    if (formData.role === 'Vendor' && !location) {
      setError('Please select your service location.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Send data format required by user
      const submissionData = {
        ...formData,
        services: formData.role === 'Vendor' ? selectedServices : [],
        location: formData.role === 'Vendor' ? location : undefined,
      };

      await signup(submissionData);

      // Auto-login after successful signup
      const res = await login({ email: formData.email, password: formData.password });
      if (res.user && res.user.role === 'Vendor') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] p-4 text-gray-900 py-12 relative overflow-hidden">
      <motion.div
        className="w-full max-w-lg bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-gray-100 p-8 sm:p-10 z-10"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="flex flex-col items-center mb-8">
          <Logo textSize="text-3xl" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Create an Account</h2>
          <p className="mt-2 text-sm text-gray-500">Join us as a User or Vendor to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Select Account Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange('Customer')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${formData.role === 'Customer'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200 hover:bg-gray-100'
                  }`}
              >
                <User className={`w-6 h-6 ${formData.role === 'Customer' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className="font-medium text-sm">User</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('Vendor')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${formData.role === 'Vendor'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200 hover:bg-gray-100'
                  }`}
              >
                <Store className={`w-6 h-6 ${formData.role === 'Vendor' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className="font-medium text-sm">Vendor</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <InputField
              label="Full Name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              autoFocus={true}
              required
            />
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Mobile Number"
              name="mobile"
              type="tel"
              placeholder="+1 234 567 8900"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Dynamic Vendor Section */}
          <AnimatePresence>
            {formData.role === 'Vendor' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-visible"
              >
                <div className="pt-2 space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Select Services You Provide
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {SERVICES_LIST.map((service) => {
                      const Icon = service.icon;
                      const isSelected = selectedServices.includes(service.id);
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${isSelected
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                            : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`} />
                          {service.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Location Selection */}
                  <div className="pt-4 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Service Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search your address"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />

                      {suggestions.length > 0 && (
                        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl mt-1 max-h-60 overflow-y-auto shadow-lg">
                          {suggestions.map((place, index) => (
                            <div
                              key={index}
                              onClick={() => handleSelect(place)}
                              className="px-4 py-2 text-sm hover:bg-indigo-50 cursor-pointer"
                            >
                              {place.display_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {location && (
                      <p className="text-sm font-medium text-emerald-600 mt-1">
                        Selected: {location.address}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm font-medium text-red-600 text-center bg-red-50 border border-red-100 rounded-xl p-3 shadow-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" isLoading={isLoading} className="w-full mt-2">
            Create Account
          </Button>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
