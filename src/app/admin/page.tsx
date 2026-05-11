"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  CreditCard,
  ClipboardList,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import AdminGuard from "@/components/AdminGuard";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    pendingWithdrawals: 0,
    totalTasks: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { count: usersCount } = await supabase
      .from("profiles")
      .select("*", {
        count: "exact",
        head: true,
      });

    const { count: tasksCount } = await supabase
      .from("tasks")
      .select("*", {
        count: "exact",
        head: true,
      });

    const { count: withdrawalsCount } =
      await supabase
        .from("withdrawals")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("status", "pending");

    const { data: transactions } =
      await supabase
        .from("transactions")
        .select("amount");

    const totalRevenue =
      transactions?.reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      ) || 0;

    setStats({
      totalUsers: usersCount || 0,
      totalTasks: tasksCount || 0,
      pendingWithdrawals:
        withdrawalsCount || 0,
      totalRevenue,
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading dashboard...
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h2>

          <p className="text-gray-500">
            Overview of your Xpay platform
            performance.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            icon={<Users className="w-5 h-5" />}
            label="Total Users"
            value={stats.totalUsers.toString()}
            sub="Registered users"
            color="blue"
          />

          <AdminStatCard
            icon={
              <TrendingUp className="w-5 h-5" />
            }
            label="Revenue"
            value={`KSH ${stats.totalRevenue}`}
            sub="Platform earnings"
            color="green"
          />

          <AdminStatCard
            icon={
              <CreditCard className="w-5 h-5" />
            }
            label="Pending Withdrawals"
            value={stats.pendingWithdrawals.toString()}
            sub="Awaiting approval"
            color="warning"
          />

          <AdminStatCard
            icon={
              <ClipboardList className="w-5 h-5" />
            }
            label="Tasks"
            value={stats.totalTasks.toString()}
            sub="Available tasks"
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <QuickActionCard
            icon={
              <ClipboardList className="w-6 h-6" />
            }
            title="Manage Tasks"
            desc="Edit and manage earning tasks"
            href="/admin/tasks"
          />

          <QuickActionCard
            icon={
              <CreditCard className="w-6 h-6" />
            }
            title="Process Withdrawals"
            desc="Approve payout requests"
            href="/admin/withdrawals"
          />

          <QuickActionCard
            icon={<Users className="w-6 h-6" />}
            title="User Management"
            desc="View platform users"
            href="/admin/users"
          />
        </div>
      </div>
    </AdminGuard>
  );
}

function AdminStatCard({
  icon,
  label,
  value,
  sub,
  color,
}: any) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    warning: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <div
        className={`w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center mb-3`}
      >
        {icon}
      </div>

      <p className="text-2xl font-bold text-gray-900">
        {value}
      </p>

      <p className="text-sm font-medium text-gray-700">
        {label}
      </p>

      <p className="text-xs text-gray-500">
        {sub}
      </p>
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  desc,
  href,
}: any) {
  return (
    <a
      href={href}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition group"
    >
      <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white mb-4">
        {icon}
      </div>

      <h4 className="font-bold text-gray-900">
        {title}
      </h4>

      <p className="text-sm text-gray-500 mt-1">
        {desc}
      </p>
    </a>
  );
}