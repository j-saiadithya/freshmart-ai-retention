import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  MegaphoneIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Customers', href: '/customers', icon: UsersIcon },
  { name: 'Campaigns', href: '/campaigns', icon: MegaphoneIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-16 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center px-4 py-6 border-b border-emerald-700">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg transform rotate-3">
            <svg
              className="h-7 w-7 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-lg font-bold text-white tracking-tight">
              FreshMart
            </p>
            <p className="text-xs text-emerald-300 font-medium">
              Retention Hub
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-grow flex flex-col pt-6 px-3">
          <nav className="flex-1 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? 'bg-white text-emerald-900 shadow-lg transform scale-105'
                        : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white hover:translate-x-1'
                    }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform
                      ${
                        isActive
                          ? 'text-emerald-600'
                          : 'text-emerald-300 group-hover:text-white group-hover:scale-110'
                      }`}
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-emerald-700 p-4 bg-emerald-900/50">
          <div className="flex items-center w-full">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
              <svg
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-white">
                AI Assistant
              </p>
              <p className="text-xs text-emerald-300">
                Powered by Hugging Face
              </p>
            </div>
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-400 text-green-900 shadow-md">
              Live
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
