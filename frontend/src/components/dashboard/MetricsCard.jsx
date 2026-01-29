import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';


const MetricsCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color = 'primary',
  loading = false 
}) => {
  const colorClasses = {
    primary: 'text-emerald-700 bg-gradient-to-br from-emerald-100 to-teal-100',
    green: 'text-green-700 bg-gradient-to-br from-green-100 to-emerald-100',
    red: 'text-red-700 bg-gradient-to-br from-red-100 to-orange-100',
    yellow: 'text-amber-700 bg-gradient-to-br from-amber-100 to-yellow-100',
    purple: 'text-purple-700 bg-gradient-to-br from-purple-100 to-pink-100',
    indigo: 'text-indigo-700 bg-gradient-to-br from-indigo-100 to-blue-100',
  };

  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow-lg rounded-2xl border-2 border-gray-100">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-2xl p-4 bg-gray-200 animate-pulse">
              <div className="h-7 w-7 bg-gray-300 rounded"></div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate bg-gray-200 h-4 w-24 rounded animate-pulse"></dt>
                <dd className="flex items-baseline mt-2">
                  <div className="text-2xl font-semibold text-gray-900 bg-gray-200 h-8 w-32 rounded animate-pulse"></div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-2xl border-2 border-gray-100 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-2xl p-4 shadow-md ${colorClasses[color]}`}>
            <Icon className="h-7 w-7" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-semibold text-gray-600 truncate uppercase tracking-wide">{title}</dt>
              <dd className="flex items-baseline mt-1">
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                {change && (
                  <div
                    className={`ml-2 flex items-baseline text-sm font-bold ${
                      trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {trend === 'up' ? (
                      <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                    )}
                    <span className="ml-1">{change}</span>
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-3 border-t border-gray-100">
        <div className="text-sm">
          <a href="#" className="font-semibold text-emerald-700 hover:text-emerald-900 transition-colors inline-flex items-center group">
            View details 
            <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;