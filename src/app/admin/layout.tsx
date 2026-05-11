"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  CreditCard, 
  Brain,
  LogOut,
  Menu,
  X,
  Shield,
  Wallet
} from "lucide-react";
import { useState } from "react";

const adminNavItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/tasks", icon: ClipboardList, label: "Task Management" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/withdrawals", icon: CreditCard, label: "Withdrawals" },
  { href: "/admin/tests", icon: Brain, label: "Test Results" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // In production, check admin role here
  const isAdmin = true;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="w-16 h-16 text-danger-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500">You don't have permission to access the admin panel.</p>
          <Link href="/app" className="mt-4 inline-block px-6 py-2 bg-primary-600 text-white rounded-lg font-medium">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-dark-900 text-white fixed h-full z-30">
        <div className="p-6 border-b border-dark-700">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">Xpay</span>
              <span className="text-xs text-gray-400 block">Admin Panel</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive 
                    ? "bg-primary-600 text-white" 
                    : "text-gray-400 hover:bg-dark-800 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dark-700">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-sm font-bold">AD</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-500">admin@xpay.com</p>
            </div>
          </div>
          <Link href="/app" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white transition mt-2">
            <Wallet className="w-5 h-5" />
            Back to App
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-gray-400 hover:text-white transition">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-dark-900 shadow-xl">
            <div className="p-4 border-b border-dark-700 flex items-center justify-between">
              <span className="text-xl font-bold text-white">Admin Panel</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-dark-800 hover:text-white transition"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        {/* Mobile Header */}
        <header className="lg:hidden bg-dark-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold">Xpay Admin</span>
          <div className="w-6" />
        </header>

        {/* Top Bar (Desktop) */}
        <div className="hidden lg:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {adminNavItems.find(i => pathname === i.href || pathname.startsWith(i.href + "/"))?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-lg">
              <span className="text-sm font-bold text-primary-700">Admin</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
