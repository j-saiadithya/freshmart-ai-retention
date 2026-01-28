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
      },
    ],
  };

  const ageBarData = {
    labels: Object.keys(customerSegments.age_segments || {}),
    datasets: [
      {
        label: "Customers",
        data: Object.values(customerSegments.age_segments || {}),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const revenueBarData = {
    labels: revenueData.labels,
    datasets: [
      {
        label: "Revenue ($)",
        data: revenueData.revenue,
        backgroundColor: "#10b981",
      },
    ],
  };

  /* -------------------- KPI Cards -------------------- */

  const kpis = [
    {
      title: "Retention Rate",
      value: `${dashboardMetrics.retention_rate?.toFixed(1)}%`,
      trend: "down",
      change: "-5%",
      icon: UsersIcon,
    },
    {
      title: "Avg Basket Size",
      value: `$${dashboardMetrics.avg_basket_size?.toFixed(2)}`,
      trend: "up",
      change: "+8%",
      icon: ShoppingCartIcon,
    },
    {
      title: "Monthly Revenue",
      value: `$${dashboardMetrics.monthly_revenue?.toLocaleString()}`,
      trend: "up",
      change: "+15%",
      icon: CurrencyDollarIcon,
    },
    {
      title: "Campaign Success",
      value: `${dashboardMetrics.campaign_success_rate?.toFixed(1)}%`,
      trend: "up",
      change: "+3%",
      icon: ChartBarIcon,
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
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Analytics Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="card p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">{kpi.title}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <div className="flex items-center mt-1">
                  {kpi.trend === "up" ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className="text-sm">{kpi.change}</span>
                </div>
              </div>
              <kpi.icon className="h-8 w-8 text-primary-600" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Revenue Trend</h2>
          <Bar data={revenueBarData} />
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">Loyalty Distribution</h2>
          <Pie data={loyaltyPieData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Age Distribution</h2>
          <Bar data={ageBarData} />
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">Top Cities</h2>
          <div className="space-y-3">
            {Object.entries(customerSegments.city_segments || {}).map(
              ([city, count]) => (
                <div key={city} className="flex justify-between">
                  <span>{city}</span>
                  <span className="font-semibold">
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
