import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Calendar,
  MessageSquare,
  Star,
  CreditCard,
  Settings,
  UserCheck,
  BarChart3,
  FileText,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const getMenuItems = () => {
    switch (user.role) {
      case 'client':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          { icon: Search, label: 'Find Lawyers', path: '/find-lawyers' },
          { icon: Calendar, label: 'Appointments', path: '/appointments' },
          { icon: CreditCard, label: 'Payments', path: '/payments' },
          { icon: Star, label: 'Reviews', path: '/reviews' },
          { icon: Settings, label: 'Profile', path: '/profile' },
        ];
      case 'lawyer':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          { icon: Calendar, label: 'Appointments', path: '/appointments' },
          // { icon: Users, label: 'Clients', path: '/clients' },
          { icon: Star, label: 'Reviews', path: '/reviews' },
          // { icon: CreditCard, label: 'Earnings', path: '/earnings' },
          { icon: Settings, label: 'Profile', path: '/profile' },
        ];
      case 'admin':
        return [
          { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: Users, label: 'Users', path: '/admin/users' },
          { icon: UserCheck, label: 'Lawyer Verification', path: '/admin/verification' },
          // { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
          // { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
          // { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
          // { icon: FileText, label: 'Content', path: '/admin/content' },
          // { icon: Settings, label: 'Settings', path: '/admin/settings' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Title */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {user.role} Portal
          </h2>
        </div>

        {/* Navigation links */}
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
