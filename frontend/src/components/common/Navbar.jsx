import React, { useState } from 'react';
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';   // ✅ ADDED

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();                // ✅ ADDED

  return (
    <nav className="bg-white shadow-md border-b-4 border-emerald-500 fixed w-full z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Search */}
          <div className="flex-1 flex items-center">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-emerald-400" />
                </div>

                <input
                  id="search"
                  name="search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customers, campaigns..."
                  className="block w-full pl-10 pr-3 py-2 border-2 border-emerald-100 rounded-xl leading-5 bg-emerald-50/30 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <button className="relative p-2 rounded-xl text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-orange-400 to-red-500 ring-2 ring-white shadow-lg animate-pulse"></span>
            </button>

            {/* ✅ SETTINGS NAVIGATION FIX */}
            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-xl text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
            >
              <span className="sr-only">Settings</span>
              <Cog6ToothIcon className="h-6 w-6" />
            </button>

            <div className="flex items-center border-l-2 border-emerald-200 pl-4 ml-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-semibold text-gray-800">
                  Admin User
                </p>
                <p className="text-xs text-emerald-600 font-medium">
                  admin@freshmart.com
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;