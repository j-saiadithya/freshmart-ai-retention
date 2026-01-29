import React, { useState, useEffect } from "react";
import {
  MegaphoneIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

import {
  getCampaignStatus,
  getCampaignHistory,
  launchRetentionCampaign,
  testSmsCampaign,
} from "../services/campaignService";

const Campaigns = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [customerLimit, setCustomerLimit] = useState(5);
  const [churnRisk, setChurnRisk] = useState("High");
  const [campaignHistory, setCampaignHistory] = useState([]);
  const [campaignStatus, setCampaignStatus] = useState(null);

  useEffect(() => {
    loadStatus();
    loadHistory();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await getCampaignStatus();
      setCampaignStatus(data);
    } catch (e) {
      console.error("Status error", e);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await getCampaignHistory();
      setCampaignHistory(data.campaigns || []);
    } catch (e) {
      console.error("History error", e);
    }
  };

  const launchCampaign = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await launchRetentionCampaign(customerLimit, churnRisk);
      setResult(data);
      loadHistory();
    } catch (e) {
      setResult({ error: "Campaign launch failed" });
    }
    setLoading(false);
  };

  const testCampaign = async () => {
    setLoading(true);
    try {
      const data = await testSmsCampaign();
      setResult(data);
    } catch (e) {
      setResult({ error: "Test SMS failed" });
    }
    setLoading(false);
  };

  const riskColor = (risk) => {
    if (risk === "High") return "bg-gradient-to-r from-red-500 to-orange-500 text-white";
    if (risk === "Medium") return "bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900";
    return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
  };

  return (
    <div className="max-w-7xl mx-auto pt-6">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center space-x-3">
          <MegaphoneIcon className="h-8 w-8 text-white" />
          <div>
            <h1 className="text-3xl font-bold text-white">AI Retention Campaigns</h1>
            <p className="text-purple-100 text-lg mt-1">Engage customers with intelligent, personalized messaging</p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Campaign Status</h2>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse mr-2"></div>
                <span className="text-sm font-semibold text-gray-700">
                  SMS Service: <span className="text-emerald-600">{campaignStatus?.sms_service || 'Active'}</span>
                </span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse mr-2"></div>
                <span className="text-sm font-semibold text-gray-700">
                  AI Service: <span className="text-emerald-600">{campaignStatus?.ai_service || 'Active'}</span>
                </span>
              </div>
            </div>
          </div>
          <SparklesIcon className="h-12 w-12 text-emerald-500" />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Campaign Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Target Customers
            </label>
            <select
              value={customerLimit}
              onChange={(e) => setCustomerLimit(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl bg-emerald-50/30 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white font-medium transition-all"
            >
              {[1, 5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n} customers
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Risk Level
            </label>
            <select
              value={churnRisk}
              onChange={(e) => setChurnRisk(e.target.value)}
              className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl bg-emerald-50/30 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white font-medium transition-all"
            >
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button 
            onClick={testCampaign} 
            className="flex-1 bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg border-2 border-emerald-200 flex items-center justify-center"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
            Test SMS
          </button>
          <button
            onClick={launchCampaign}
            disabled={loading || !campaignStatus?.ready_for_campaign}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                Launching...
              </>
            ) : (
              <>
                <MegaphoneIcon className="h-5 w-5 mr-2" />
                Launch Campaign
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className={`rounded-2xl shadow-lg p-6 mb-6 border-2 ${result.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          {result.error ? (
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-6 w-6 text-red-600 mr-3" />
              <p className="text-red-800 font-semibold">{result.error}</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg font-bold text-green-900">Campaign Launched Successfully!</h3>
              </div>
              <div className="bg-white rounded-xl p-4 border border-green-200">
                <p className="text-gray-900 font-semibold">
                  Success Rate: {result.campaign_results?.successful} / {result.campaign_results?.total} messages delivered
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Recent Campaigns</h3>
          <ClockIcon className="h-6 w-6 text-gray-400" />
        </div>
        {campaignHistory.length === 0 ? (
          <div className="text-center py-8">
            <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No campaigns launched yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {campaignHistory.map((c) => (
              <div key={c.campaign_id} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 hover:shadow-md transition-all">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mr-4 shadow-md">
                    <MegaphoneIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Campaign #{c.campaign_id}</p>
                    <p className="text-sm text-gray-600">Success Rate: {c.success_rate.toFixed(1)}%</p>
                  </div>
                </div>
                <ChartBarIcon className="h-5 w-5 text-emerald-600" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;