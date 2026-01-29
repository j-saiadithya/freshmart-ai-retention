import React, { useEffect, useState } from "react";
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardMetrics, setDashboardMetrics] = useState({});
  const [revenueData, setRevenueData] = useState({
    labels: [],
    revenue: [],
    customers: [],
  });
  const [customerSegments, setCustomerSegments] = useState({
    loyalty_segments: {},
    age_segments: {},
    city_segments: {},
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [metricsRes, revenueRes, segmentsRes] = await Promise.all([
        fetch("http://localhost:8000/api/analytics/dashboard"),
        fetch("http://localhost:8000/api/analytics/revenue-trends"),
        fetch("http://localhost:8000/api/analytics/customer-segments"),
      ]);

      const metricsRaw = await metricsRes.json();
      const revenueRaw = await revenueRes.json();
      const segmentsRaw = await segmentsRes.json();

      setDashboardMetrics({
        total_customers: metricsRaw?.total_customers || 0,
        retention_rate: metricsRaw?.retention_rate || 0,
        churn_rate: metricsRaw?.churn_rate || 0,
        avg_basket_size: metricsRaw?.avg_basket_size || 0,
        high_risk_customers: metricsRaw?.high_risk_customers || 0,
        monthly_revenue: metricsRaw?.monthly_revenue || 0,
        campaigns_sent: metricsRaw?.campaigns_sent || 0,
        campaign_success_rate: metricsRaw?.campaign_success_rate || 0,
      });

      setRevenueData({
        labels: revenueRaw?.labels || [],
        revenue: revenueRaw?.revenue || [],
        customers: revenueRaw?.customers || [],
      });

      setCustomerSegments({
        loyalty_segments: segmentsRaw?.loyalty_segments || {},
        age_segments: segmentsRaw?.age_segments || {},
        city_segments: segmentsRaw?.city_segments || {},
      });
    } catch (err) {
      console.error("Analytics API error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- Chart Data -------------------- */

  const loyaltyPieData = {
    labels: Object.keys(customerSegments.loyalty_segments || {}),
    datasets: [
      {
        data: Object.values(customerSegments.loyalty_segments || {}),
        backgroundColor: [
          "#fbbf24",
          "#9ca3af",
          "#facc15",
          "#c084fc",
        ],
        borderWidth: 3,
        borderColor: '#fff',
      },
    ],
  };

  const ageBarData = {
    labels: Object.keys(customerSegments.age_segments || {}),
    datasets: [
      {
        label: "Customers",
        data: Object.values(customerSegments.age_segments || {}),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgb(16, 185, 129)',
      },
    ],
  };

  const revenueBarData = {
    labels: revenueData.labels,
    datasets: [
      {
        label: "Revenue ($)",
        data: revenueData.revenue,
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgb(16, 185, 129)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: 600,
          },
          usePointStyle: true,
          padding: 15,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(16, 185, 129, 0.1)',
        },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  /* -------------------- KPI Cards -------------------- */

  const kpis = [
    {
      title: "Retention Rate",
      value: `${dashboardMetrics.retention_rate?.toFixed(1)}%`,
      trend: "down",
      change: "-5%",
      icon: UsersIcon,
      color: "from-red-500 to-orange-500",
    },
    {
      title: "Avg Basket Size",
      value: `$${dashboardMetrics.avg_basket_size?.toFixed(2)}`,
      trend: "up",
      change: "+8%",
      icon: ShoppingCartIcon,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Monthly Revenue",
      value: `$${dashboardMetrics.monthly_revenue?.toLocaleString()}`,
      trend: "up",
      change: "+15%",
      icon: CurrencyDollarIcon,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Campaign Success",
      value: `${dashboardMetrics.campaign_success_rate?.toFixed(1)}%`,
      trend: "up",
      change: "+3%",
      icon: ChartBarIcon,
      color: "from-blue-500 to-cyan-500",
    },
  ];

  /* -------------------- UI -------------------- */

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-2 text-gray-500">Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center space-x-3">
          <ChartBarIcon className="h-8 w-8 text-white" />
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-emerald-100 text-lg mt-1">Deep insights into your retail performance</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">{kpi.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                <div className="flex items-center mt-2">
                  {kpi.trend === "up" ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-semibold ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </span>
                </div>
              </div>
              <div className={`rounded-xl p-3 bg-gradient-to-br ${kpi.color} shadow-lg`}>
                <kpi.icon className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trend</h2>
          <div className="h-80">
            <Bar data={revenueBarData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Loyalty Distribution</h2>
          <div className="h-80">
            <Pie data={loyaltyPieData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Age Distribution</h2>
          <div className="h-80">
            <Bar data={ageBarData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Cities</h2>
          <div className="space-y-3 mt-6">
            {Object.entries(customerSegments.city_segments || {}).map(
              ([city, count]) => (
                <div key={city} className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                  <span className="font-semibold text-gray-900">{city}</span>
                  <span className="font-bold text-emerald-700">
                    {count.toLocaleString()}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;