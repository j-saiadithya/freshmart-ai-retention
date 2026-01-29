import React, { useState } from 'react';
import { 
  CogIcon, 
  KeyIcon, 
  BellIcon, 
  ChartBarIcon,
  ShieldCheckIcon,
  CloudIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [apiKeys, setApiKeys] = useState({
    twilioSid: 'AC****************************',
    twilioToken: '****************************',
    huggingfaceToken: 'hf_****************************',
  });
  const [showKeys, setShowKeys] = useState({
    twilioToken: false,
    huggingfaceToken: false,
  });
  const [settings, setSettings] = useState({
    enableNotifications: true,
    autoCampaigns: false,
    dailyReports: true,
    weeklySummaries: true,
    campaignRateLimit: 2,
    aiModel: 'microsoft/DialoGPT-small',
  });

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'api', name: 'API Keys', icon: KeyIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'integrations', name: 'Integrations', icon: CloudIcon },
  ];

  const toggleShowKey = (key) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleApiKeyChange = (key, value) => {
    setApiKeys(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    alert('Settings saved successfully!');
  };

  const testApiConnections = async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
      if (response.ok) {
        alert('Backend connection successful!');
      } else {
        alert('Backend connection failed.');
      }
    } catch (error) {
      alert('Backend connection failed. Make sure backend is running.');
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Application Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              AI Model
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl bg-emerald-50/30 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white font-medium transition-all"
              value={settings.aiModel}
              onChange={(e) => handleSettingChange('aiModel', e.target.value)}
            >
              <option value="microsoft/DialoGPT-small">Microsoft DialoGPT Small (Fast)</option>
              <option value="microsoft/DialoGPT-medium">Microsoft DialoGPT Medium (Balanced)</option>
              <option value="gpt2">GPT-2 (High Quality)</option>
              <option value="distilgpt2">DistilGPT-2 (Efficient)</option>
            </select>
            <p className="mt-2 text-sm text-gray-600 font-medium">
              Choose the AI model for generating retention messages
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Campaign Rate Limit (seconds)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl bg-emerald-50/30 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white font-medium transition-all"
              value={settings.campaignRateLimit}
              onChange={(e) => handleSettingChange('campaignRateLimit', e.target.value)}
            />
            <p className="mt-2 text-sm text-gray-600 font-medium">
              Time between SMS messages to avoid rate limiting
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-3">
          <button className="w-full bg-emerald-100 text-emerald-700 px-5 py-3 rounded-xl font-semibold hover:bg-emerald-200 transition-all flex items-center justify-start shadow-md">
            <DocumentTextIcon className="h-5 w-5 mr-3" />
            Export All Data
          </button>
          <button className="w-full bg-emerald-100 text-emerald-700 px-5 py-3 rounded-xl font-semibold hover:bg-emerald-200 transition-all flex items-center justify-start shadow-md">
            <DocumentTextIcon className="h-5 w-5 mr-3" />
            Backup Database
          </button>
          <button className="w-full bg-red-100 text-red-700 px-5 py-3 rounded-xl font-semibold hover:bg-red-200 transition-all flex items-center justify-start shadow-md">
            <DocumentTextIcon className="h-5 w-5 mr-3" />
            Clear Campaign History
          </button>
        </div>
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
        <div className="flex">
          <div className="flex-shrink-0">
            <ShieldCheckIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-bold text-blue-900">Security Notice</h3>
            <div className="mt-2 text-sm text-blue-700 font-medium">
              <p>API keys are stored locally and never transmitted to our servers. Keep them secure and never share them publicly.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Twilio Account SID
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl bg-emerald-50/30 font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white font-medium transition-all"
            value={apiKeys.twilioSid}
            onChange={(e) => handleApiKeyChange('twilioSid', e.target.value)}
          />
          <p className="mt-2 text-sm text-gray-600 font-medium">
            Found in your Twilio Console dashboard
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Twilio Auth Token
          </label>
          <div className="relative">
            <input
              type={showKeys.twilioToken ? "text" : "password"}
              className="w-full px-4 py-3 pr-16 border-2 border-emerald-100 rounded-xl bg-emerald-50/30 font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white font-medium transition-all"
              value={apiKeys.twilioToken}
              onChange={(e) => handleApiKeyChange('twilioToken', e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => toggleShowKey('twilioToken')}
            >
              <span className="text-sm font-bold text-emerald-600 hover:text-emerald-800">
                {showKeys.twilioToken ? 'Hide' : 'Show'}
              </span>
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600 font-medium">
            Keep this secret! Used to authenticate with Twilio API
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Hugging Face Token
          </label>
          <div className="relative">
            <input
              type={showKeys.huggingfaceToken ? "text" : "password"}
              className="w-full px-4 py-3 pr-16 border-2 border-emerald-100 rounded-xl bg-emerald-50/30 font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white font-medium transition-all"
              value={apiKeys.huggingfaceToken}
              onChange={(e) => handleApiKeyChange('huggingfaceToken', e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => toggleShowKey('huggingfaceToken')}
            >
              <span className="text-sm font-bold text-emerald-600 hover:text-emerald-800">
                {showKeys.huggingfaceToken ? 'Hide' : 'Show'}
              </span>
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600 font-medium">
            Required for AI message generation
          </p>
        </div>

        <button
          onClick={testApiConnections}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg mt-6"
        >
          Test API Connections
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Notification Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <div>
            <p className="text-sm font-bold text-gray-900">Enable Notifications</p>
            <p className="text-sm text-gray-600 font-medium">Receive system notifications</p>
          </div>
          <button
            onClick={() => handleSettingChange('enableNotifications', !settings.enableNotifications)}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
              settings.enableNotifications ? 'bg-emerald-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.enableNotifications ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <div>
            <p className="text-sm font-bold text-gray-900">Auto Campaigns</p>
            <p className="text-sm text-gray-600 font-medium">Automatically launch campaigns</p>
          </div>
          <button
            onClick={() => handleSettingChange('autoCampaigns', !settings.autoCampaigns)}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
              settings.autoCampaigns ? 'bg-emerald-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.autoCampaigns ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <div>
            <p className="text-sm font-bold text-gray-900">Daily Reports</p>
            <p className="text-sm text-gray-600 font-medium">Receive daily performance reports</p>
          </div>
          <button
            onClick={() => handleSettingChange('dailyReports', !settings.dailyReports)}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
              settings.dailyReports ? 'bg-emerald-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.dailyReports ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <div>
            <p className="text-sm font-bold text-gray-900">Weekly Summaries</p>
            <p className="text-sm text-gray-600 font-medium">Receive weekly analytics summaries</p>
          </div>
          <button
            onClick={() => handleSettingChange('weeklySummaries', !settings.weeklySummaries)}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
              settings.weeklySummaries ? 'bg-emerald-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.weeklySummaries ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'api':
        return renderApiSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'analytics':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Analytics Settings</h3>
            <p className="text-sm text-gray-600 font-medium">Configure analytics and reporting preferences.</p>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Security Settings</h3>
            <p className="text-sm text-gray-600 font-medium">Manage security and access controls.</p>
          </div>
        );
      case 'integrations':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Integrations</h3>
            <p className="text-sm text-gray-600 font-medium">Connect with other services and platforms.</p>
          </div>
        );
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-6">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CogIcon className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-emerald-100 text-lg mt-1">Configure your FreshMart AI Retention system</p>
            </div>
          </div>
          <button
            onClick={saveSettings}
            className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border-2 border-gray-100'
                }`}
              >
                <tab.icon className={`mr-3 h-5 w-5 ${
                  activeTab === tab.id ? 'text-white' : 'text-gray-400'
                }`} />
                {tab.name}
              </button>
            ))}
          </nav>

          {/* System Info */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">System Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">Version</span>
                <span className="font-bold text-gray-900">1.0.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">Backend</span>
                <span className="font-bold text-green-600 flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Running
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">Database</span>
                <span className="font-bold text-gray-900">SQLite</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">AI Service</span>
                <span className="font-bold text-green-600 flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">SMS Service</span>
                <span className="font-bold text-green-600 flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
            {renderContent()}
            
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <div className="flex justify-between">
                <button className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-all shadow-md">
                  Reset to Defaults
                </button>
                <div className="space-x-3">
                  <button className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-all shadow-md">
                    Cancel
                  </button>
                  <button
                    onClick={saveSettings}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
                  >
                    Save All Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-2xl shadow-lg p-6 mt-6 border-2 border-red-200">
            <h3 className="text-lg font-bold text-red-900 mb-4">Danger Zone</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-red-900">Clear All Data</p>
                  <p className="text-sm text-red-700 font-medium">Permanently delete all customer and campaign data</p>
                </div>
                <button className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-5 py-2.5 rounded-xl font-bold hover:from-red-700 hover:to-orange-700 transition-all shadow-lg">
                  Clear Data
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-red-900">Reset System</p>
                  <p className="text-sm text-red-700 font-medium">Reset all settings to factory defaults</p>
                </div>
                <button className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-5 py-2.5 rounded-xl font-bold hover:from-red-700 hover:to-orange-700 transition-all shadow-lg">
                  Reset System
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;