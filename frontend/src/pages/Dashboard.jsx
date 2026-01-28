import React, { useState, useEffect } from "react";
import MetricsCard from "../components/dashboard/MetricsCard";
import {
  UsersIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ArrowTrendingDownIcon,
  ChatBubbleLeftRightIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { api } from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [revenueData, setRevenueData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statusRes, churnRes] = await Promise.all([
        api.get("/api/campaigns/status"),
        api.get("/api/predictions/stats/distribution"),
      ]);

      const status = statusRes.data;
      const churnStats = churnRes.data.statistics;

      setMetrics({
        total_customers: status.total_customers,
        retention_rate: 100 - churnStats.high_risk_percentage,
        churn_rate: churnStats.high_risk_percentage,
        avg_basket_size: 45.0, // mocked (not available in backend)
        high_risk_customers: Math.round(
          (churnStats.high_risk_percentage / 100) * status.total_customers
        ),
        monthly_revenue: 50000, // mocked
        campaigns_sent: 1250, // mocked
        campaign_success_rate: 85.5, // mocked
      });

      // Revenue trends (mocked for demo)
      setRevenueData({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        revenue: [45000, 52000, 48000, 61000, 58000, 65000],
        customers: [45000, 46000, 45500, 47000, 46500, 47500],
      });

      setLoading(false);
    } catch (error) {
      console.error("Dashboard API failed, using fallback data", error);

      // Fallback data (safe demo mode)
      setMetrics({
        total_customers: 50000,
        retention_rate: 35.2,
        churn_rate: 35.0,
        avg_basket_size: 45.0,
        high_risk_customers: 17500,
        monthly_revenue: 50000,
        campaigns_sent: 1250,
        campaign_success_rate: 85.5,
      });

      setRevenueData({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        revenue: [45000, 52000, 48000, 61000, 58000, 65000],
        customers: [45000, 46000, 45500, 47000, 46500, 47500],
      });

      setLoading(false);
    }
  };

  const metricsData = [
    {
      title: "Total Customers",
      value: loading
        ? "..."
        : metrics?.total_customers?.toLocaleString(),
      change: "+12%",
      trend: "up",
      icon: UsersIcon,
      color: "primary",
    },
    {
      title: "Retention Rate",
      value: loading
        ? "..."
        : `${metrics?.retention_rate?.toFixed(1)}%`,
      change: "-5%",
      trend: "down",
      icon: UsersIcon,
      color: "red",
    },
    {
      title: "Avg Basket Size",
      value: loading ? "..." : `$${metrics?.avg_basket_size?.toFixed(2)}`,
      change: "+8%",
      trend: "up",
      icon: ShoppingCartIcon,
      color: "green",
    },
    {
      title: "Churn Risk",
      value: loading ? "..." : `${metrics?.churn_rate?.toFixed(1)}%`,
      change: "+2%",
      trend: "down",
      icon: ArrowTrendingDownIcon,
      color: "yellow",
    },
    {
      title: "Monthly Revenue",
      value: loading
        ? "..."
        : `$${metrics?.monthly_revenue?.toLocaleString()}`,
      change: "+15%",
      trend: "up",
      icon: CurrencyDollarIcon,
      color: "purple",
    },
    {
      title: "Campaign Success",
      value: loading
        ? "..."
        : `${metrics?.campaign_success_rate?.toFixed(1)}%`,
      change: "+3%",
      trend: "up",
      icon: ChatBubbleLeftRightIcon,
      color: "indigo",
    },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    interaction: { intersect: false },
    scales: {
      y: { beginAtZero: true },
      x: { grid: { display: false } },
    },
  };

  const chartData = revenueData && {
    labels: revenueData.labels,
    datasets: [
      {
        label: "Revenue ($)",
        data: revenueData.revenue,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Active Customers",
        data: revenueData.customers,
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
        {metricsData.map((metric, index) => (
          <MetricsCard key={index} {...metric} loading={loading} />
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Revenue Trends
        </h2>
        <div className="h-80">
          {chartData ? (
            <Line options={chartOptions} data={chartData} />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
