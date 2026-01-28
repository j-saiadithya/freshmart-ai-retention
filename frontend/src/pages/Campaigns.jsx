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
    if (risk === "High") return "bg-red-100 text-red-800";
    if (risk === "Medium") return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">AI Retention Campaigns</h1>

      {/* Status */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-4">Campaign Status</h2>
        <p>
          SMS: <b>{campaignStatus?.sms_service}</b> | AI:{" "}
          <b>{campaignStatus?.ai_service}</b>
        </p>
      </div>

      {/* Controls */}
      <div className="card p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <select
            value={customerLimit}
            onChange={(e) => setCustomerLimit(Number(e.target.value))}
            className="input-field"
          >
            {[1, 5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n} customers
              </option>
            ))}
          </select>

          <select
            value={churnRisk}
            onChange={(e) => setChurnRisk(e.target.value)}
            className="input-field"
          >
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>

        <div className="flex gap-4 mt-6">
          <button onClick={testCampaign} className="btn-secondary flex-1">
            Test SMS
          </button>
          <button
            onClick={launchCampaign}
            disabled={loading || !campaignStatus?.ready_for_campaign}
            className="btn-primary flex-1"
          >
            {loading ? "Launching..." : "Launch Campaign"}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="card p-6">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <>
              <h3 className="font-semibold mb-3">Campaign Result</h3>
              <p>
                Success: {result.campaign_results?.successful} /{" "}
                {result.campaign_results?.total}
              </p>
            </>
          )}
        </div>
      )}

      {/* History */}
      <div className="card p-6 mt-6">
        <h3 className="font-semibold mb-4">Recent Campaigns</h3>
        {campaignHistory.length === 0 ? (
          <p className="text-gray-500">No campaigns yet</p>
        ) : (
          campaignHistory.map((c) => (
            <div key={c.campaign_id} className="border-b py-2">
              Campaign #{c.campaign_id} — {c.success_rate.toFixed(1)}%
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Campaigns;
