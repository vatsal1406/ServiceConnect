import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 sm:p-12 text-center"
        >
          <div className="flex justify-center mb-8">
            <Logo textSize="text-3xl" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h2>
          <p className="text-gray-500 mb-8">Manage your account details</p>

          {user ? (
            <div className="space-y-6 mb-10 text-left max-w-sm mx-auto">
              <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>

              <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>

              <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  <p className="font-medium text-gray-900">{user.role}</p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wide">
                  {user.role}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">No user data available.</p>
          )}

          <div className="max-w-sm mx-auto">
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center rounded-xl bg-white border border-red-200 px-5 py-3 text-red-600 font-semibold shadow-sm hover:shadow-md hover:bg-red-50 hover:border-red-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
