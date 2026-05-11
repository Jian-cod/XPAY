"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardList, 
  ShoppingBag, 
  Wallet, 
  TrendingUp, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tasks", icon: ClipboardList, label: "Tasks" },
  { href: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/advance", icon: TrendingUp, label: "Xpay Advance" },
  { href: "/referrals", icon: Users, label: "Referrals" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-30">
          <div className="p-6 border-b border-gray-100">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Xpay</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive 
                      ? "bg-green-50 text-green-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-green-600" : "text-gray-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-700">{user?.tier || "Free"} Tier</span>
              </div>
              <p className="text-xs text-amber-600">1 task/day • KSH 6,500 min</p>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              <LogOut className="w-5 h-5 text-gray-400" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">Xpay</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <item.icon className="w-5 h-5 text-gray-400" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Mobile Header */}
          <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <span className="font-bold text-gray-900">Xpay</span>
            <div className="w-6" />
          </header>

          {/* Top Bar (Desktop) */}
          <div className="hidden lg:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-20">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {navItems.find(i => pathname === i.href || pathname.startsWith(i.href + "/"))?.label || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-bold text-green-700">1,250 pts</span>
                <span className="text-xs text-green-500">~KSH 1,625</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-sm font-bold text-green-700">{user?.name?.slice(0,2).toUpperCase() || "JD"}</span>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="p-4 lg:p-8">
            {/* KYC Warning Banner */}
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">KYC Verification Required</p>
                <p className="text-xs text-amber-600">Complete identity verification to unlock withdrawals. Required by law.</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200 transition">
                Verify Now
              </button>
            </div>

            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
