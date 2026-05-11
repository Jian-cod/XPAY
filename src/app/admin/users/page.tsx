"use client";

import { useState } from "react";
import { Search, Filter, Shield, Ban, CheckCircle, AlertTriangle, Star, Flame } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  tier: string;
  points: number;
  tasksCompleted: number;
  approvalRate: number;
  streak: number;
  status: string;
  registrationPaid: boolean;
  testPassed: boolean;
  joined: string;
  lastActive: string;
}

const mockUsers: User[] = [
  { id: 1, name: "Grace M.", email: "grace@example.com", tier: "pro", points: 8450, tasksCompleted: 134, approvalRate: 88, streak: 24, status: "active", registrationPaid: true, testPassed: true, joined: "2026-03-15", lastActive: "2 hours ago" },
  { id: 2, name: "James O.", email: "james@example.com", tier: "free", points: 1250, tasksCompleted: 47, approvalRate: 82, streak: 12, status: "active", registrationPaid: true, testPassed: true, joined: "2026-04-10", lastActive: "5 hours ago" },
  { id: 3, name: "Amina H.", email: "amina@example.com", tier: "elite", points: 15200, tasksCompleted: 210, approvalRate: 94, streak: 45, status: "active", registrationPaid: true, testPassed: true, joined: "2026-02-01", lastActive: "1 hour ago" },
  { id: 4, name: "Peter K.", email: "peter@example.com", tier: "free", points: 320, tasksCompleted: 12, approvalRate: 65, streak: 3, status: "warning", registrationPaid: true, testPassed: true, joined: "2026-04-20", lastActive: "1 day ago" },
  { id: 5, name: "Sarah W.", email: "sarah@example.com", tier: "pro", points: 6200, tasksCompleted: 89, approvalRate: 91, streak: 18, status: "active", registrationPaid: true, testPassed: true, joined: "2026-03-22", lastActive: "3 hours ago" },
  { id: 6, name: "David N.", email: "david@example.com", tier: "free", points: 0, tasksCompleted: 0, approvalRate: 0, streak: 0, status: "banned", registrationPaid: false, testPassed: false, joined: "2026-04-25", lastActive: "Never" },
  { id: 7, name: "Mary J.", email: "mary@example.com", tier: "free", points: 890, tasksCompleted: 34, approvalRate: 78, streak: 8, status: "strike", registrationPaid: true, testPassed: true, joined: "2026-04-05", lastActive: "6 hours ago" },
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === "all" || user.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500">View, manage, and monitor all platform users.</p>
        </div>
        <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-xl">
          <span className="text-sm font-bold text-primary-700">{mockUsers.length} Total Users</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition"
          />
        </div>
        <select 
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
        >
          <option value="all">All Tiers</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="elite">Elite</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">User</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Tier</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Points</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Tasks</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Approval</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Streak</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      user.tier === "free" ? "bg-gray-100 text-gray-700" :
                      user.tier === "pro" ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {user.tier.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">{user.points.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{user.tasksCompleted}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${user.approvalRate >= 80 ? "text-primary-600" : user.approvalRate >= 60 ? "text-amber-600" : "text-danger-600"}`}>
                      {user.approvalRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-bold text-gray-900">{user.streak}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      user.status === "active" ? "bg-green-100 text-green-700" :
                      user.status === "warning" ? "bg-amber-100 text-amber-700" :
                      user.status === "strike" ? "bg-orange-100 text-orange-700" :
                      "bg-danger-100 text-danger-700"
                    }`}>
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xl font-bold text-primary-700">{selectedUser.name.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">{selectedUser.name}</h4>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  selectedUser.status === "active" ? "bg-green-100 text-green-700" :
                  selectedUser.status === "banned" ? "bg-danger-100 text-danger-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {selectedUser.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <DetailBox label="Tier" value={selectedUser.tier.toUpperCase()} />
              <DetailBox label="Points" value={selectedUser.points.toLocaleString()} />
              <DetailBox label="Tasks Done" value={selectedUser.tasksCompleted.toString()} />
              <DetailBox label="Approval Rate" value={`${selectedUser.approvalRate}%`} />
              <DetailBox label="Streak" value={`${selectedUser.streak} days`} />
              <DetailBox label="Joined" value={selectedUser.joined} />
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Registration Fee Paid</span>
                {selectedUser.registrationPaid ? (
                  <CheckCircle className="w-5 h-5 text-primary-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Intelligence Test Passed</span>
                {selectedUser.testPassed ? (
                  <CheckCircle className="w-5 h-5 text-primary-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-amber-50 text-amber-700 rounded-xl font-medium hover:bg-amber-100 transition">
                Issue Warning
              </button>
              <button className="flex-1 py-3 bg-danger-50 text-danger-700 rounded-xl font-medium hover:bg-danger-100 transition">
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  );
}
