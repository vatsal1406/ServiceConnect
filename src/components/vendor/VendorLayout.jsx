import { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

const VendorLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth(); // Assuming useAuth exposes the `user` object

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Component */}
      <Sidebar isMobileOpen={isSidebarOpen} setIsMobileOpen={setIsSidebarOpen} />

      {/* Main Content Wrapper */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">

        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
              Vendor Dashboard
            </h1>
          </div>

          {/* User Profile / Top Nav Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">
                  {user?.name || 'Service Provider'}
                </span>
                <span className="text-xs text-gray-500">
                  Vendor Account
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold border border-indigo-200 shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'V'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;
