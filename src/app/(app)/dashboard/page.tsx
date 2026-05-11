"use client";

import { 
  TrendingUp, 
  Target, 
  Clock, 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Zap,
  ChevronRight,
  Flame
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const withdrawalProgress = 19.2;
  const streakDays = 12;
  const tasksCompleted = 47;
  const approvalRate = 82;
  const accountAge = 18;

  const requirements = [
    { label: "Account Age", current: accountAge, target: 60, unit: "days", met: false },
    { label: "Tasks Completed", current: tasksCompleted, target: 150, unit: "tasks", met: false },
    { label: "Streak Maintained", current: streakDays, target: 30, unit: "days", met: false },
    { label: "Approval Rate", current: approvalRate, target: 80, unit: "%", met: true },
    { label: "Minimum Balance", current: 1250, target: 6500, unit: "pts", met: false },
    { label: "Marketplace Purchase", current: 0, target: 1, unit: "item", met: false },
    { label: "Registration Fee", current: 1, target: 1, unit: "paid", met: true },
  ];

  const metCount = requirements.filter(r => r.met).length;
  const totalCount = requirements.length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, John</h2>
            <p className="text-gray-500 mt-1">Day {accountAge} of your grind. Keep pushing.</p>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-xl">
            <Flame className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm font-bold text-orange-700">{streakDays} Day Streak</p>
              <p className="text-xs text-orange-500">Miss 1 day = reset to 0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Total Earnings" value="1,250 pts" sub="~KSH 1,625" color="primary" />
        <StatCard icon={<Target className="w-5 h-5" />} label="Tasks Done" value="47" sub="of 150 required" color="blue" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Time Invested" value="18d" sub="of 60 required" color="purple" />
        <StatCard icon={<Shield className="w-5 h-5" />} label="Approval Rate" value="82%" sub="Target: 80%" color="green" />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Withdrawal Progress</h3>
            <p className="text-sm text-gray-500">Free Tier — KSH 6,500 minimum</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{metCount}/{totalCount}</p>
            <p className="text-xs text-gray-500">requirements met</p>
          </div>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3 mb-6">
          <div className="bg-primary-500 h-3 rounded-full transition-all duration-500" style={{ width: `${(metCount / totalCount) * 100}%` }} />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {requirements.map((req, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${req.met ? "bg-primary-50 border border-primary-200" : "bg-gray-50 border border-gray-100"}`}>
              {req.met ? <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" /> : <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />}
              <div className="flex-1">
                <p className={`text-sm font-medium ${req.met ? "text-primary-700" : "text-gray-700"}`}>{req.label}</p>
                <p className="text-xs text-gray-500">{req.current} / {req.target} {req.unit}</p>
              </div>
              {req.met && <span className="text-xs font-bold text-primary-600">DONE</span>}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Estimated first withdrawal</p>
              <p className="text-xs text-gray-500">Based on your current pace</p>
            </div>
            <p className="text-lg font-bold text-gray-900">~Day 42</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <QuickActionCard icon={<Zap className="w-6 h-6" />} title="Daily Tasks" desc="1 task available today" href="/tasks" color="primary" />
        <QuickActionCard icon={<Target className="w-6 h-6" />} title="Marketplace" desc="3 new items added" href="/marketplace" color="blue" />
        <QuickActionCard icon={<TrendingUp className="w-6 h-6" />} title="Xpay Advance" desc="Access KSH 422 early" href="/advance" color="purple" />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <ActivityRow type="task" title="Survey: Consumer Preferences" time="2 hours ago" amount="+15 pts" status="approved" />
          <ActivityRow type="task" title="AI Training: Image Label" time="5 hours ago" amount="+25 pts" status="pending" />
          <ActivityRow type="disqualification" title="Survey: Tech Usage (Disqualified at 95%)" time="Yesterday" amount="0 pts" status="rejected" />
          <ActivityRow type="streak" title="11-Day Streak Bonus" time="Yesterday" amount="+50 pts" status="approved" />
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-700">Quality Strikes: 1 of 3</h4>
            <p className="text-sm text-red-600 mt-1">You have 1 strike for low-quality AI training submissions. 3 strikes = 7-day task ban.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: any) {
  const colorMap: any = {
    primary: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-emerald-50 text-emerald-600",
  };
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  );
}

function QuickActionCard({ icon, title, desc, href, color }: any) {
  const colorMap: any = {
    primary: "from-green-500 to-green-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
  };
  return (
    <Link href={href} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white mb-4`}>{icon}</div>
      <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition">{title}</h4>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
      <div className="flex items-center gap-1 mt-3 text-green-600 text-sm font-medium">Go <ChevronRight className="w-4 h-4" /></div>
    </Link>
  );
}

function ActivityRow({ type, title, time, amount, status }: any) {
  const statusColors: any = {
    approved: "text-green-600 bg-green-50",
    pending: "text-amber-600 bg-amber-50",
    rejected: "text-red-600 bg-red-50",
  };
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusColors[status]}`}>
          {type === "task" && <Target className="w-5 h-5" />}
          {type === "disqualification" && <AlertCircle className="w-5 h-5" />}
          {type === "streak" && <Flame className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
      <span className={`text-sm font-bold ${amount.startsWith("+") ? "text-green-600" : "text-gray-400"}`}>{amount}</span>
    </div>
  );
}
