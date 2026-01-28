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
    // In a real app, this would save to backend
    alert('Settings saved successfully!');
  };

  const testApiConnections = async () => {
    try {
      // Test backend connection
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">Application Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Model
            </label>
            <select
              className="input-field"
              value={settings.aiModel}
              onChange={(e) => handleSettingChange('aiModel', e.target.value)}
            >
              <option value="microsoft/DialoGPT-small">Microsoft DialoGPT Small (Fast)</option>
              <option value="microsoft/DialoGPT-medium">Microsoft DialoGPT Medium (Balanced)</option>
              <option value="gpt2">GPT-2 (High Quality)</option>
              <option value="distilgpt2">DistilGPT-2 (Efficient)</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Choose the AI model for generating retention messages
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Rate Limit (seconds)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              className="input-field"
              value={settings.campaignRateLimit}
              onChange={(e) => handleSettingChange('campaignRateLimit', e.target.value)}
            />
            <p className="mt-1 text-sm text-gray-500">
              Time between SMS messages to avoid rate limiting
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-3">
          <button className="w-full btn-secondary justify-start">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Export All Data
          </button>
          <button className="w-full btn-secondary justify-start">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Backup Database
          </button>
          <button className="w-full btn-secondary justify-start text-red-600 hover:text-red-700">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Clear Campaign History
          </button>
        </div>
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ShieldCheckIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Security Notice</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>API keys are stored locally and never transmitted to our servers. Keep them secure and never share them publicly.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Twilio Account SID
          </label>
          <input
            type="text"
            className="input-field font-mono"
            value={apiKeys.twilioSid}
            onChange={(e) => handleApiKeyChange('twilioSid', e.target.value)}
          />
          <p className="mt-1 text-sm text-gray-500">
            Found in your Twilio Console dashboard
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Twilio Auth Token
          </label>
          <div className="relative">
            <input
              type={showKeys.twilioToken ? "text" : "password"}
              className="input-field font-mono pr-10"
              value={apiKeys.twilioToken}
              onChange={(e) => handleApiKeyChange('twilioToken', e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => toggleShowKey('twilioToken')}
            >
              {showKeys.twilioToken ? (
                <span className="text-sm text-gray-500">Hide</span>
              ) : (
                <span className="text-sm text-gray-500">Show</span>
              )}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Keep this secret! Used to authenticate with Twilio API
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hugging Face Token
          </label>
          <div className="relative">
            <input
              type={showKeys.huggingfaceToken ? "text" : "password"}
              className="input-field font-mono pr-10"
              value={apiKeys.huggingfaceToken}
              onChange={(e) => handleApiKeyChange('huggingfaceToken', e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => toggleShowKey('huggingfaceToken')}
            >
              {showKeys.huggingfaceToken ? (
                <span className="text-sm text-gray-500">Hide</span>
              ) : (
                <span className="text-sm text-gray-500">Show</span>
              )}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Get from huggingface.co/settings/tokens
          </p>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={testApiConnections}
          className="btn-secondary"
        >
          Test Connections
        </button>
        <button
          onClick={() => {
            // In real app, this would validate and save to backend
            alert('API keys updated! Make sure to update your .env file in backend too.');
          }}
          className="btn-primary"
        >
          Save API Keys
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive email alerts for important events</p>
            </div>
            <button
              onClick={() => handleSettingChange('enableNotifications', !settings.enableNotifications)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                settings.enableNotifications ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.enableNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Auto Campaigns</p>
              <p className="text-sm text-gray-500">Automatically run campaigns for high-risk customers</p>
            </div>
            <button
              onClick={() => handleSettingChange('autoCampaigns', !settings.autoCampaigns)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                settings.autoCampaigns ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.autoCampaigns ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Daily Reports</p>
              <p className="text-sm text-gray-500">Receive daily performance reports</p>
            </div>
            <button
              onClick={() => handleSettingChange('dailyReports', !settings.dailyReports)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                settings.dailyReports ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.dailyReports ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Weekly Summaries</p>
              <p className="text-sm text-gray-500">Receive weekly analytics summaries</p>
            </div>
            <button
              onClick={() => handleSettingChange('weeklySummaries', !settings.weeklySummaries)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                settings.weeklySummaries ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.weeklySummaries ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
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
            <h3 className="text-lg font-medium text-gray-900">Analytics Settings</h3>
            <p className="text-sm text-gray-600">Configure analytics and reporting preferences.</p>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
            <p className="text-sm text-gray-600">Manage security and access controls.</p>
          </div>
        );
      case 'integrations':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Integrations</h3>
            <p className="text-sm text-gray-600">Connect with other services and platforms.</p>
          </div>
        );
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-sm text-gray-700">
              Configure your FreshMart AI Retention system
            </p>
          </div>
          <button
            onClick={saveSettings}
            className="btn-primary"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                }`}
              >
                <tab.icon className={`mr-3 h-5 w-5 ${
                  activeTab === tab.id ? 'text-primary-500' : 'text-gray-400'
                }`} />
                {tab.name}
              </button>
            ))}
          </nav>

          {/* System Info */}
          <div className="mt-8 card p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">System Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Version</span>
                <span className="font-medium text-gray-900">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Backend Status</span>
                <span className="font-medium text-green-600">Running</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database</span>
                <span className="font-medium text-gray-900">SQLite</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">AI Service</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SMS Service</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            {renderContent()}
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex justify-between">
                <button className="btn-secondary">
                  Reset to Defaults
                </button>
                <div className="space-x-3">
                  <button className="btn-secondary">
                    Cancel
                  </button>
                  <button
                    onClick={saveSettings}
                    className="btn-primary"
                  >
                    Save All Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card p-6 mt-6 border-red-200 bg-red-50">
            <h3 className="text-lg font-medium text-red-800 mb-4">Danger Zone</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Clear All Data</p>
                  <p className="text-sm text-red-600">Permanently delete all customer and campaign data</p>
                </div>
                <button className="btn-danger">
                  Clear Data
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Reset System</p>
                  <p className="text-sm text-red-600">Reset all settings to factory defaults</p>
                </div>
                <button className="btn-danger">
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