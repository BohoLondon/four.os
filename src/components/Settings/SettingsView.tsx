import React from 'react';
import { User, Bell, Shield, Palette, Globe, Database, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const SettingsView: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const settingSections = [
    {
      title: 'Profile',
      icon: User,
      items: [
        { label: 'Personal Information', value: 'Update name, email, avatar' },
        { label: 'Role & Permissions', value: user?.role || 'CEO' },
        { label: 'Two-Factor Authentication', value: 'Enabled' }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Email Notifications', value: 'Enabled' },
        { label: 'Push Notifications', value: 'Enabled' },
        { label: 'Project Updates', value: 'Immediate' }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { label: 'Session Timeout', value: '2 hours' },
        { label: 'Login History', value: 'View recent logins' },
        { label: 'API Keys', value: 'Manage integrations' }
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        { label: 'Theme', value: isDark ? 'Dark' : 'Light' },
        { label: 'Language', value: 'English' },
        { label: 'Timezone', value: 'UTC-5 (EST)' }
      ]
    },
    {
      title: 'System',
      icon: Database,
      items: [
        { label: 'Data Export', value: 'Export all data' },
        { label: 'Backup Settings', value: 'Configure backups' },
        { label: 'System Status', value: 'All systems operational' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and preferences</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* User Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                {user?.role}
              </span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h3>
              </div>
              
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</span>
                    {section.title === 'Appearance' && item.label === 'Theme' ? (
                      <button
                        onClick={toggleTheme}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.value}</span>
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* System Info */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Version</p>
            <p className="font-medium text-gray-900 dark:text-white">FOUR.OS v1.0.0</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Last Updated</p>
            <p className="font-medium text-gray-900 dark:text-white">January 15, 2024</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Server Status</p>
            <p className="font-medium text-green-600 dark:text-green-400">Operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;