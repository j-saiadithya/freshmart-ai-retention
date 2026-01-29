import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { 
  UsersIcon, 
  ShoppingCartIcon, 
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const MetricDetailsModal = ({ isOpen, onClose, metricType, metricValue }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchInsights();
    }
  }, [isOpen, metricType]);

  const fetchInsights = async () => {
    setLoading(true);
    
    // Simulate API call - In production, fetch from your backend
    setTimeout(() => {
      const mockInsights = generateInsights(metricType);
      setInsights(mockInsights);
      setLoading(false);
    }, 500);
  };

  const generateInsights = (type) => {
    switch (type) {
      case 'high_risk':
        return {
          title: 'High Risk Customers Analysis',
          summary: 'Customers with churn probability > 50%',
          stats: [
            { label: 'Total High Risk', value: '17,500', change: '+8%', trend: 'up', color: 'red' },
            { label: 'Avg Days Since Purchase', value: '89 days', change: '+15 days', trend: 'up', color: 'red' },
            { label: 'Avg Purchase Frequency', value: '2.3/month', change: '-0.8', trend: 'down', color: 'red' },
            { label: 'Potential Revenue Loss', value: '$875K', change: '+12%', trend: 'up', color: 'red' },
          ],
          breakdown: {
            title: 'Risk Distribution by City',
            data: [
              { city: 'NYC', count: 4200, percentage: 24, color: 'bg-blue-500' },
              { city: 'LA', count: 3850, percentage: 22, color: 'bg-purple-500' },
              { city: 'Chicago', count: 3500, percentage: 20, color: 'bg-green-500' },
              { city: 'Miami', count: 3150, percentage: 18, color: 'bg-orange-500' },
              { city: 'Houston', count: 2800, percentage: 16, color: 'bg-pink-500' },
            ]
          },
          recommendations: [
            {
              icon: ChatBubbleLeftRightIcon,
              title: 'Launch Targeted Campaign',
              description: 'Send personalized retention offers to high-risk customers within the next 7 days.'
            },
            {
              icon: CurrencyDollarIcon,
              title: 'Offer Loyalty Incentives',
              description: 'Provide 15-20% discount vouchers or exclusive member benefits to re-engage.'
            },
            {
              icon: CalendarIcon,
              title: 'Schedule Follow-ups',
              description: 'Set up automated SMS reminders for customers inactive for 60+ days.'
            }
          ]
        };

      case 'retention_rate':
        return {
          title: 'Customer Retention Analysis',
          summary: 'Measuring customer loyalty and repeat purchase behavior',
          stats: [
            { label: 'Current Retention Rate', value: '70.0%', change: '-5%', trend: 'down', color: 'yellow' },
            { label: 'Repeat Customers', value: '35,000', change: '-2,500', trend: 'down', color: 'yellow' },
            { label: 'Avg Customer Lifetime', value: '18 months', change: '-2 months', trend: 'down', color: 'yellow' },
            { label: 'Loyalty Program Members', value: '28,500', change: '+5%', trend: 'up', color: 'green' },
          ],
          breakdown: {
            title: 'Retention by Loyalty Tier',
            data: [
              { city: 'Platinum', count: 12500, percentage: 95, color: 'bg-purple-500' },
              { city: 'Gold', count: 10200, percentage: 82, color: 'bg-yellow-500' },
              { city: 'Silver', count: 8500, percentage: 68, color: 'bg-gray-400' },
              { city: 'Bronze', count: 3800, percentage: 45, color: 'bg-orange-400' },
            ]
          },
          recommendations: [
            {
              icon: UsersIcon,
              title: 'Enhance Loyalty Program',
              description: 'Upgrade benefits for Silver and Bronze tiers to improve retention rates.'
            },
            {
              icon: ChartBarIcon,
              title: 'Analyze Churn Patterns',
              description: 'Identify common traits among churned customers to prevent future losses.'
            },
            {
              icon: ArrowTrendingUpIcon,
              title: 'Re-engagement Campaign',
              description: 'Create win-back campaigns targeting customers who haven\'t purchased in 45+ days.'
            }
          ]
        };

      case 'avg_basket':
        return {
          title: 'Average Basket Size Analysis',
          summary: 'Understanding customer purchasing patterns and transaction values',
          stats: [
            { label: 'Current Avg Basket', value: '$45.00', change: '+8%', trend: 'up', color: 'green' },
            { label: 'Top 20% Customers', value: '$128.50', change: '+12%', trend: 'up', color: 'green' },
            { label: 'Items per Transaction', value: '3.2', change: '+0.4', trend: 'up', color: 'green' },
            { label: 'Basket Growth Rate', value: '2.1%/month', change: '+0.5%', trend: 'up', color: 'green' },
          ],
          breakdown: {
            title: 'Basket Size Distribution',
            data: [
              { city: '$0-$25', count: 12000, percentage: 24, color: 'bg-red-400' },
              { city: '$25-$50', count: 18500, percentage: 37, color: 'bg-yellow-400' },
              { city: '$50-$100', count: 13500, percentage: 27, color: 'bg-green-400' },
              { city: '$100-$200', count: 4500, percentage: 9, color: 'bg-blue-400' },
              { city: '$200+', count: 1500, percentage: 3, color: 'bg-purple-500' },
            ]
          },
          recommendations: [
            {
              icon: ShoppingCartIcon,
              title: 'Cross-sell Strategy',
              description: 'Implement "Frequently Bought Together" recommendations at checkout.'
            },
            {
              icon: CurrencyDollarIcon,
              title: 'Bundle Offers',
              description: 'Create product bundles with 10-15% discount to increase basket size.'
            },
            {
              icon: ArrowTrendingUpIcon,
              title: 'Minimum Purchase Incentive',
              description: 'Offer free delivery or gift for purchases above $60 to boost basket value.'
            }
          ]
        };

      case 'churn_risk':
        return {
          title: 'Overall Churn Risk Assessment',
          summary: 'Percentage of customer base at risk of churning',
          stats: [
            { label: 'Churn Risk Rate', value: '29.9%', change: '+2%', trend: 'up', color: 'yellow' },
            { label: 'Customers at Risk', value: '14,950', change: '+1,000', trend: 'up', color: 'yellow' },
            { label: 'Monthly Churn', value: '1,250', change: '+150', trend: 'up', color: 'red' },
            { label: 'Prevented Churns', value: '2,850', change: '+450', trend: 'up', color: 'green' },
          ],
          breakdown: {
            title: 'Risk Level Distribution',
            data: [
              { city: 'High Risk (>60%)', count: 8500, percentage: 17, color: 'bg-red-500' },
              { city: 'Medium Risk (30-60%)', count: 15200, percentage: 30, color: 'bg-yellow-500' },
              { city: 'Low Risk (<30%)', count: 26300, percentage: 53, color: 'bg-green-500' },
            ]
          },
          recommendations: [
            {
              icon: ExclamationTriangleIcon,
              title: 'Early Warning System',
              description: 'Set up automated alerts when customer behavior indicates increased churn risk.'
            },
            {
              icon: UsersIcon,
              title: 'Customer Success Team',
              description: 'Assign dedicated representatives to personally reach out to high-risk customers.'
            },
            {
              icon: ChartBarIcon,
              title: 'Predictive Analytics',
              description: 'Use ML models to identify at-risk customers earlier with 85%+ accuracy.'
            }
          ]
        };

      case 'monthly_revenue':
        return {
          title: 'Monthly Revenue Analysis',
          summary: 'Revenue performance and growth trends',
          stats: [
            { label: 'Current Month', value: '$50,000', change: '+15%', trend: 'up', color: 'green' },
            { label: 'Avg per Customer', value: '$35.71', change: '+$3.20', trend: 'up', color: 'green' },
            { label: 'Revenue Growth', value: '12.5%', change: '+2.1%', trend: 'up', color: 'green' },
            { label: 'Projected Next Month', value: '$57,500', change: '+15%', trend: 'up', color: 'green' },
          ],
          breakdown: {
            title: 'Revenue by Store Location',
            data: [
              { city: 'NYC Store', count: 12500, percentage: 25, color: 'bg-blue-500' },
              { city: 'LA Store', count: 11000, percentage: 22, color: 'bg-purple-500' },
              { city: 'Chicago Store', count: 10000, percentage: 20, color: 'bg-green-500' },
              { city: 'Miami Store', count: 9500, percentage: 19, color: 'bg-orange-500' },
              { city: 'Houston Store', count: 7000, percentage: 14, color: 'bg-pink-500' },
            ]
          },
          recommendations: [
            {
              icon: CurrencyDollarIcon,
              title: 'Seasonal Promotions',
              description: 'Launch targeted seasonal campaigns to capitalize on peak shopping periods.'
            },
            {
              icon: ArrowTrendingUpIcon,
              title: 'Upsell High-Value Items',
              description: 'Train staff to recommend premium products to increase transaction value.'
            },
            {
              icon: MapPinIcon,
              title: 'Expand Top Performers',
              description: 'Consider opening additional locations in high-performing markets.'
            }
          ]
        };

      case 'campaign_success':
        return {
          title: 'Campaign Success Metrics',
          summary: 'Effectiveness of retention and engagement campaigns',
          stats: [
            { label: 'Success Rate', value: '85.5%', change: '+3%', trend: 'up', color: 'green' },
            { label: 'Campaigns Sent', value: '1,250', change: '+150', trend: 'up', color: 'green' },
            { label: 'Response Rate', value: '42.3%', change: '+5%', trend: 'up', color: 'green' },
            { label: 'Revenue from Campaigns', value: '$85K', change: '+18%', trend: 'up', color: 'green' },
          ],
          breakdown: {
            title: 'Campaign Performance by Type',
            data: [
              { city: 'SMS Retention', count: 450, percentage: 92, color: 'bg-green-500' },
              { city: 'Email Offers', count: 380, percentage: 84, color: 'bg-blue-500' },
              { city: 'Push Notifications', count: 280, percentage: 78, color: 'bg-purple-500' },
              { city: 'In-App Messages', count: 140, percentage: 71, color: 'bg-orange-500' },
            ]
          },
          recommendations: [
            {
              icon: ChatBubbleLeftRightIcon,
              title: 'Optimize Send Times',
              description: 'Test different times of day to maximize open and response rates.'
            },
            {
              icon: UsersIcon,
              title: 'Personalization',
              description: 'Use AI to create hyper-personalized messages based on purchase history.'
            },
            {
              icon: ChartBarIcon,
              title: 'A/B Testing',
              description: 'Run continuous tests on messaging, offers, and CTAs to improve performance.'
            }
          ]
        };

      default:
        return null;
    }
  };

  const ChatBubbleLeftRightIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );

  if (!insights) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={insights.title}>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-100">
            <p className="text-gray-700 font-semibold">{insights.summary}</p>
          </div>

          {/* Key Stats */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Key Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.stats.map((stat, idx) => (
                <div key={idx} className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-emerald-200 transition-colors">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</p>
                  <div className="flex items-baseline mt-2">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <span className={`ml-2 text-sm font-semibold flex items-center ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                      )}
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{insights.breakdown.title}</h3>
            <div className="space-y-3">
              {insights.breakdown.data.map((item, idx) => (
                <div key={idx} className="bg-white border-2 border-gray-100 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900">{item.city}</span>
                    <span className="font-bold text-emerald-700">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                      <div 
                        className={`${item.color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-600 text-sm">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Actions</h3>
            <div className="space-y-3">
              {insights.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-emerald-600 rounded-lg p-2 mr-4">
                      <rec.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{rec.title}</h4>
                      <p className="text-gray-700 text-sm">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default MetricDetailsModal;