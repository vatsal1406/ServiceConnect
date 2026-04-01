import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Briefcase, LogOut, Menu, X } from 'lucide-react';
import Logo from '../Logo';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/vendor/dashboard' },
    { name: 'Bookings', icon: CalendarDays, path: '/vendor/bookings' },
    { name: 'Services', icon: Briefcase, path: '/vendor/services' },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="w-full flex items-center origin-left scale-[0.95]">
          <Logo textSize="text-3xl" />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto w-full">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsMobileOpen(false)}
            end={item.path === '/vendor'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full font-medium ${isActive
                ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom Area (Logout) */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <NavContent />
      </aside>
    </>
  );
};

export default Sidebar;
