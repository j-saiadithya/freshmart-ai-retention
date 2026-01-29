import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/customers?limit=100');
      const data = await response.json();
      setCustomers(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      const sampleCustomers = Array.from({ length: 50 }, (_, i) => ({
        customer_id: `CUST${100000 + i}`,
        first_name: ['John', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa'][i % 6],
        last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'][i % 6],
        email: `customer${i}@example.com`,
        phone: `+1${5550000000 + i}`,
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][i % 5],
        loyalty_tier: ['Bronze', 'Silver', 'Gold', 'Platinum'][i % 4],
        churn_risk: ['Low', 'Medium', 'High'][i % 3],
        avg_monthly_spend: 45 + (i % 5) * 10
      }));
      setCustomers(sampleCustomers);
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = searchTerm === '' || 
      customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = selectedRisk === 'all' || customer.churn_risk === selectedRisk;
    
    return matchesSearch && matchesRisk;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  const getRiskBadgeClass = (risk) => {
    switch (risk) {
      case 'High': return 'bg-gradient-to-r from-red-500 to-orange-500 text-white';
      case 'Medium': return 'bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900';
      case 'Low': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierBadgeClass = (tier) => {
    switch (tier) {
      case 'Platinum': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'Gold': return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900';
      case 'Silver': return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900';
      case 'Bronze': return 'bg-gradient-to-r from-orange-400 to-amber-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto pt-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="mt-2 text-sm text-gray-700">Loading customer data...</p>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-6">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <UsersIcon className="h-8 w-8 text-white" />
              <h1 className="text-3xl font-bold text-white">Customer Directory</h1>
            </div>
            <p className="text-emerald-100 text-lg">
              Managing {customers.length.toLocaleString()} valued customers
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30 shadow-lg">
              Export Data
            </button>
            <button className="bg-white text-emerald-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-lg">
              + Add Customer
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Search Customers</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-emerald-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border-2 border-emerald-100 rounded-xl leading-5 bg-emerald-50/30 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-sm font-medium transition-all"
                placeholder="Search by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Churn Risk</label>
            <select
              className="block w-full px-4 py-3 border-2 border-emerald-100 rounded-xl bg-emerald-50/30 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-sm font-medium transition-all"
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
            >
              <option value="all">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Loyalty Tier</label>
            <select className="block w-full px-4 py-3 border-2 border-emerald-100 rounded-xl bg-emerald-50/30 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white text-sm font-medium transition-all">
              <option value="all">All Tiers</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-100">
          <div className="text-sm text-gray-700 font-semibold">
            Showing <span className="text-emerald-600">{startIndex + 1}-{Math.min(endIndex, filteredCustomers.length)}</span> of <span className="text-emerald-600">{filteredCustomers.length}</span> customers
          </div>
          <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-semibold hover:bg-emerald-200 transition-all flex items-center shadow-md">
            <FunnelIcon className="h-4 w-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200">
            <thead className="bg-gradient-to-r from-emerald-50 to-teal-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Loyalty Tier
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Risk Level
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Avg Spend
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCustomers.map((customer, index) => (
                <tr key={customer.customer_id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-11 w-11">
                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-sm">
                            {customer.first_name[0]}{customer.last_name[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">
                          {customer.first_name} {customer.last_name}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          ID: {customer.customer_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <EnvelopeIcon className="h-4 w-4 text-emerald-500 mr-2" />
                        <span className="font-medium">{customer.email}</span>
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 text-emerald-500 mr-2" />
                        <span className="font-medium">{customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPinIcon className="h-4 w-4 text-emerald-500 mr-2" />
                      <span className="font-semibold">{customer.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${getTierBadgeClass(customer.loyalty_tier)}`}>
                      {customer.loyalty_tier === 'Platinum' && <SparklesIcon className="h-3 w-3 mr-1" />}
                      {customer.loyalty_tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${getRiskBadgeClass(customer.churn_risk)}`}>
                      {customer.churn_risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ${customer.avg_monthly_spend?.toFixed(2) || '45.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    <button className="text-emerald-600 hover:text-emerald-900 mr-4 transition-colors">
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 transition-colors">
                      Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-4 flex items-center justify-between border-t-2 border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border-2 border-emerald-300 text-sm font-semibold rounded-xl text-emerald-700 bg-white hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border-2 border-emerald-300 text-sm font-semibold rounded-xl text-emerald-700 bg-white hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 font-semibold">
                  Page <span className="font-bold text-emerald-600">{currentPage}</span> of{' '}
                  <span className="font-bold text-emerald-600">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-xl shadow-md -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 rounded-l-xl border-2 border-emerald-300 bg-white text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronRightIcon className="h-5 w-5 transform rotate-180" />
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border-2 text-sm font-semibold ${
                          currentPage === pageNum
                            ? 'z-10 bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-3 py-2 rounded-r-xl border-2 border-emerald-300 bg-white text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl hover:border-red-200 transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-xl p-4 bg-gradient-to-br from-red-100 to-orange-100 shadow-md">
              <UsersIcon className="h-7 w-7 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.churn_risk === 'High').length.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-xl p-4 bg-gradient-to-br from-purple-100 to-pink-100 shadow-md">
              <SparklesIcon className="h-7 w-7 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Platinum</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.loyalty_tier === 'Platinum').length.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-xl p-4 bg-gradient-to-br from-blue-100 to-cyan-100 shadow-md">
              <PhoneIcon className="h-7 w-7 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Phone #</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.phone).length.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl hover:border-amber-200 transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-xl p-4 bg-gradient-to-br from-amber-100 to-yellow-100 shadow-md">
              <EnvelopeIcon className="h-7 w-7 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">Email</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.email).length.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;