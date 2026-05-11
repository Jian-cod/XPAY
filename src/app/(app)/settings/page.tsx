"use client";

import { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Moon, 
  Smartphone,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security" | "payments">("profile");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    taskAlerts: true,
    withdrawalUpdates: true,
    streakReminders: true,
    marketingEmails: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500">Manage your account, preferences, and security.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security", icon: Shield },
            { id: "payments", label: "Payments", icon: CreditCard },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.id 
                  ? "text-primary-600 border-b-2 border-primary-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6 max-w-lg">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-700">JD</span>
                </div>
                <div>
                  <button className="text-sm font-medium text-primary-600 hover:text-primary-700">Change Avatar</button>
                  <p className="text-xs text-gray-500">JPG, PNG. Max 2MB.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" defaultValue="John Doe" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" defaultValue="john@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" defaultValue="+254 700 000 000" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition">
                    <option>Kenya</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Nigeria</option>
                    <option>South Africa</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea 
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition resize-none"
                />
              </div>

              <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition">
                Save Changes
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4 max-w-lg">
              <ToggleRow 
                icon={<Bell className="w-5 h-5" />}
                title="Task Alerts"
                desc="Get notified when new tasks are available"
                enabled={notifications.taskAlerts}
                onToggle={() => setNotifications({...notifications, taskAlerts: !notifications.taskAlerts})}
              />
              <ToggleRow 
                icon={<CreditCard className="w-5 h-5" />}
                title="Withdrawal Updates"
                desc="Notifications about your withdrawal status"
                enabled={notifications.withdrawalUpdates}
                onToggle={() => setNotifications({...notifications, withdrawalUpdates: !notifications.withdrawalUpdates})}
              />
              <ToggleRow 
                icon={<AlertTriangle className="w-5 h-5" />}
                title="Streak Reminders"
                desc="Daily reminder to complete a task and maintain your streak"
                enabled={notifications.streakReminders}
                onToggle={() => setNotifications({...notifications, streakReminders: !notifications.streakReminders})}
              />
              <ToggleRow 
                icon={<Globe className="w-5 h-5" />}
                title="Marketing Emails"
                desc="Promotions, tips, and platform updates"
                enabled={notifications.marketingEmails}
                onToggle={() => setNotifications({...notifications, marketingEmails: !notifications.marketingEmails})}
              />
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 max-w-lg">
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-primary-700">Two-Factor Authentication</p>
                  <p className="text-xs text-primary-600">Enabled via SMS</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition" />
              </div>

              <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition">
                Update Password
              </button>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-bold text-danger-600 mb-2">Danger Zone</h4>
                <button className="px-4 py-2 border border-danger-200 text-danger-600 rounded-lg text-sm font-medium hover:bg-danger-50 transition">
                  Delete Account
                </button>
                <p className="text-xs text-gray-500 mt-2">This cannot be undone. Your points and history will be permanently deleted.</p>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="space-y-6 max-w-lg">
              <div>
                <h4 className="font-bold text-gray-900 mb-4">M-Pesa</h4>
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">+254 700 000 000</p>
                      <p className="text-xs text-gray-500">Default for Kenya withdrawals</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">Verified</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-4">PayPal</h4>
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">john@example.com</p>
                      <p className="text-xs text-gray-500">Default for international withdrawals</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">Verified</span>
                </div>
              </div>

              <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-primary-400 hover:text-primary-600 transition">
                + Add Payment Method
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ icon, title, desc, enabled, onToggle }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="text-gray-400">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition relative ${enabled ? "bg-primary-500" : "bg-gray-300"}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition ${enabled ? "left-6.5" : "left-0.5"}`} style={{ left: enabled ? "26px" : "2px" }} />
      </button>
    </div>
  );
}
