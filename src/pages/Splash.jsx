import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/Logo';

export default function Splash() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show splash animation
    setIsVisible(true);

    // Trigger exit after 1.8 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => navigate('/login', { replace: true })}
    >
      {isVisible && (
        <motion.div
          className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 p-4"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Logo textSize="text-5xl sm:text-6xl" />
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="mt-6 text-sm text-gray-500 sm:text-base font-medium tracking-wide text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Connecting you with trusted services
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}