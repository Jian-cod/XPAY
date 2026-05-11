"use client";

import { useState } from "react";
import { Search, Filter, Brain, AlertTriangle, CheckCircle, XCircle, Eye, Clock } from "lucide-react";

interface TestResult {
  id: number;
  user: string;
  email: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  cheatDetected: boolean;
  tabSwitches: number;
  timeSpent: number; // seconds
  submittedAt: string;
  status: string;
}

const mockTestResults: TestResult[] = [
  { id: 1, user: "Grace M.", email: "grace@example.com", score: 6, totalQuestions: 7, passed: true, cheatDetected: false, tabSwitches: 0, timeSpent: 420, submittedAt: "2026-05-06 10:30", status: "passed" },
  { id: 2, user: "James O.", email: "james@example.com", score: 5, totalQuestions: 7, passed: true, cheatDetected: false, tabSwitches: 1, timeSpent: 380, submittedAt: "2026-05-06 09:15", status: "passed" },
  { id: 3, user: "Amina H.", email: "amina@example.com", score: 7, totalQuestions: 7, passed: true, cheatDetected: false, tabSwitches: 0, timeSpent: 510, submittedAt: "2026-05-05 14:20", status: "passed" },
  { id: 4, user: "Peter K.", email: "peter@example.com", score: 3, totalQuestions: 7, passed: false, cheatDetected: false, tabSwitches: 0, timeSpent: 180, submittedAt: "2026-05-06 08:45", status: "failed" },
  { id: 5, user: "David N.", email: "david@example.com", score: 0, totalQuestions: 7, passed: false, cheatDetected: true, tabSwitches: 3, timeSpent: 45, submittedAt: "2026-05-05 16:30", status: "cheating_detected" },
  { id: 6, user: "Mary J.", email: "mary@example.com", score: 4, totalQuestions: 7, passed: false, cheatDetected: false, tabSwitches: 0, timeSpent: 290, submittedAt: "2026-05-04 11:00", status: "failed" },
  { id: 7, user: "John D.", email: "john@example.com", score: 2, totalQuestions: 7, passed: false, cheatDetected: true, tabSwitches: 2, timeSpent: 30, submittedAt: "2026-05-03 13:20", status: "cheating_detected" },
];

export default function AdminTestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredResults = mockTestResults.filter(r => {
    const matchesSearch = r.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockTestResults.length,
    passed: mockTestResults.filter(r => r.passed).length,
    failed: mockTestResults.filter(r => !r.passed && !r.cheatDetected).length,
    cheating: mockTestResults.filter(r => r.cheatDetected).length,
    passRate: Math.round((mockTestResults.filter(r => r.passed).length / mockTestResults.length) * 100),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Intelligence Test Results</h2>
          <p className="text-gray-500">Monitor test attempts, scores, and cheating detection.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Attempts" value={stats.total.toString()} color="blue" />
        <StatCard label="Passed" value={stats.passed.toString()} color="green" />
        <StatCard label="Failed" value={stats.failed.toString()} color="warning" />
        <StatCard label="Cheating Detected" value={stats.cheating.toString()} color="danger" />
      </div>

      {/* Pass Rate */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">Pass Rate</h3>
          <span className="text-2xl font-bold text-primary-600">{stats.passRate}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div 
            className="bg-primary-500 h-3 rounded-full transition-all"
            style={{ width: `${stats.passRate}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">{stats.passed} passed out of {stats.total} total attempts</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search test results..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition"
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none"
        >
          <option value="all">All Results</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
          <option value="cheating_detected">Cheating Detected</option>
        </select>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">User</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Score</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Time Spent</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Tab Switches</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResults.map(result => (
                <tr key={result.id} className={`hover:bg-gray-50 transition ${result.cheatDetected ? "bg-danger-50/50" : ""}`}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{result.user}</p>
                      <p className="text-xs text-gray-500">{result.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${result.passed ? "text-primary-600" : "text-danger-600"}`}>
                      {result.score}/{result.totalQuestions}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${result.tabSwitches > 0 ? "text-danger-600" : "text-gray-500"}`}>
                      {result.tabSwitches}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                      result.status === "passed" ? "bg-green-100 text-green-700" :
                      result.status === "failed" ? "bg-amber-100 text-amber-700" :
                      "bg-danger-100 text-danger-700"
                    }`}>
                      {result.status === "passed" && <CheckCircle className="w-3 h-3" />}
                      {result.status === "failed" && <XCircle className="w-3 h-3" />}
                      {result.status === "cheating_detected" && <AlertTriangle className="w-3 h-3" />}
                      {result.status.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{result.submittedAt}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cheating Alerts */}
      {mockTestResults.filter(r => r.cheatDetected).length > 0 && (
        <div className="bg-danger-50 border border-danger-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-danger-600" />
            <h3 className="text-lg font-bold text-danger-700">Cheating Alerts</h3>
          </div>
          <div className="space-y-3">
            {mockTestResults.filter(r => r.cheatDetected).map(result => (
              <div key={result.id} className="bg-white rounded-xl p-4 border border-danger-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-danger-700">{result.user} — {result.email}</p>
                    <p className="text-xs text-danger-600 mt-1">
                      Tab switches: {result.tabSwitches} • Time spent: {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s • Score: {result.score}/{result.totalQuestions}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-danger-100 text-danger-700 rounded-full text-xs font-bold">
                    BANNED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-danger-50 text-danger-600",
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
