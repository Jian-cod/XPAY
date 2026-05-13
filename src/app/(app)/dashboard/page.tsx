'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
  Flame,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    balance: 0,
    totalEarned: 0,
    tasksCompleted: 0,
    streakDays: 0,
    accountAge: 0,
    approvalRate: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);

    // Get profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    // Get transactions
    const { data: txData } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    setTransactions(txData || []);

    // Calculate stats
    const allTx = txData || [];
    const completedTasks = allTx.filter((t: any) => t.status === 'completed' && t.amount > 0).length;
    const totalEarned = allTx.reduce((sum: number, t: any) => sum + (t.amount > 0 ? t.amount : 0), 0);
    const balance = profileData?.balance || 0;
    
    // Account age in days
    const createdAt = new Date(user.created_at);
    const now = new Date();
    const accountAge = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    // Streak (placeholder - you can implement real streak logic)
    const streakDays = profileData?.streak_days || 0;

    // Approval rate (completed / total * 100)
    const totalTasks = allTx.filter((t: any) => t.type === 'task').length;
    const approvedTasks = allTx.filter((t: any) => t.type === 'task' && t.status === 'completed').length;
    const approvalRate = totalTasks > 0 ? Math.round((approvedTasks / totalTasks) * 100) : 0;

    setStats({
      balance,
      totalEarned,
      tasksCompleted: completedTasks,
      streakDays,
      accountAge,
      approvalRate
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const withdrawalProgress = Math.min((stats.balance / 6500) * 100, 100);

  const requirements = [
    { label: "Account Age", current: stats.accountAge, target: 60, unit: "days", met: stats.accountAge >= 60 },
    { label: "Tasks Completed", current: stats.tasksCompleted, target: 150, unit: "tasks", met: stats.tasksCompleted >= 150 },
    { label: "Streak Maintained", current: stats.streakDays, target: 30, unit: "days", met: stats.streakDays >= 30 },
    { label: "Approval Rate", current: stats.approvalRate, target: 80, unit: "%", met: stats.approvalRate >= 80 },
    { label: "Minimum Balance", current: stats.balance, target: 6500, unit: "pts", met: stats.balance >= 6500 },
    { label: "Marketplace Purchase", current: profile?.marketplace_purchases || 0, target: 1, unit: "item", met: (profile?.marketplace_purchases || 0) >= 1 },
    { label: "Registration Fee", current: 1, target: 1, unit: "paid", met: true },
  ];

  const metCount = requirements.filter(r => r.met).length;
  const totalCount = requirements.length;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {userName}</h2>
            <p className="text-gray-500 mt-1">Day {stats.accountAge} of your grind. Keep pushing.</p>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-xl">
            <Flame className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm font-bold text-orange-700">{stats.streakDays} Day Streak</p>
              <p className="text-xs text-orange-500">Miss 1 day = reset to 0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Total Earnings" value={`${stats.totalEarned.toLocaleString()} pts`} sub={`~KSH ${Math.round(stats.totalEarned * 1.3).toLocaleString()}`} color="primary" />
        <StatCard icon={<Target className="w-5 h-5" />} label="Tasks Done" value={stats.tasksCompleted.toString()} sub="completed" color="blue" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Time Invested" value={`${stats.accountAge}d`} sub="since joined" color="purple" />
        <StatCard icon={<Shield className="w-5 h-5" />} label="Approval Rate" value={`${stats.approvalRate}%`} sub="quality score" color="green" />
      </div>

      {/* Withdrawal Progress */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Withdrawal Progress</h3>
            <p className="text-sm text-gray-500">{profile?.tier || 'Free'} Tier — KSH 6,500 minimum</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{metCount}/{totalCount}</p>
            <p className="text-xs text-gray-500">requirements met</p>
          </div>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3 mb-6">
          <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${(metCount / totalCount) * 100}%` }} />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {requirements.map((req, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${req.met ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-100"}`}>
              {req.met ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> : <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />}
              <div className="flex-1">
                <p className={`text-sm font-medium ${req.met ? "text-green-700" : "text-gray-700"}`}>{req.label}</p>
                <p className="text-xs text-gray-500">{req.current} / {req.target} {req.unit}</p>
              </div>
              {req.met && <span className="text-xs font-bold text-green-600">DONE</span>}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Current Balance</p>
              <p className="text-xs text-gray-500">Available for tasks & marketplace</p>
            </div>
            <p className="text-lg font-bold text-gray-900">{stats.balance.toLocaleString()} pts</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <QuickActionCard icon={<Zap className="w-6 h-6" />} title="Daily Tasks" desc="Complete surveys & offers" href="/surveys" color="primary" />
        <QuickActionCard icon={<Target className="w-6 h-6" />} title="Marketplace" desc="Jobs & premium listings" href="/marketplace" color="blue" />
        <QuickActionCard icon={<Wallet className="w-6 h-6" />} title="Settings" desc="Update your profile" href="/settings" color="purple" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No activity yet. Start completing tasks!</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx: any, i: number) => (
              <ActivityRow 
                key={i}
                type={tx.type}
                title={tx.description || 'Task completed'}
                time={new Date(tx.created_at).toLocaleDateString()}
                amount={tx.amount > 0 ? `+${tx.amount} pts` : `${tx.amount} pts`}
                status={tx.status}
              />
            ))}
          </div>
        )}
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
    completed: "text-green-600 bg-green-50",
    pending: "text-amber-600 bg-amber-50",
    failed: "text-red-600 bg-red-50",
  };
  
  const typeIcons: any = {
    task: <Target className="w-5 h-5" />,
    survey: <Zap className="w-5 h-5" />,
    withdrawal: <Wallet className="w-5 h-5" />,
    streak: <Flame className="w-5 h-5" />,
    default: <CheckCircle className="w-5 h-5" />
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusColors[status] || statusColors.completed}`}>
          {typeIcons[type] || typeIcons.default}
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