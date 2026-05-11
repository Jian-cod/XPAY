"use client";

import { useState } from "react";
import { Users, Copy, CheckCircle, Share2, Facebook, Twitter, MessageCircle, TrendingUp, Star } from "lucide-react";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "XPAY-JOHN-2026";
  const referralLink = `https://xpay.com/ref/${referralCode}`;

  const stats = {
    totalReferrals: 12,
    activeReferrals: 8,
    earningsFromReferrals: 450,
    tier: "free",
    multiplier: 1,
  };

  const referrals = [
    { name: "Grace M.", joined: "2 days ago", earnings: 120, status: "active" },
    { name: "James O.", joined: "5 days ago", earnings: 85, status: "active" },
    { name: "Amina H.", joined: "1 week ago", earnings: 200, status: "active" },
    { name: "Peter K.", joined: "2 weeks ago", earnings: 45, status: "inactive" },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Referrals</h2>
        <p className="text-gray-500">Invite friends. Earn when they earn. Simple.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} label="Total Referrals" value={stats.totalReferrals.toString()} color="primary" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Active" value={stats.activeReferrals.toString()} color="green" />
        <StatCard icon={<Star className="w-5 h-5" />} label="Your Earnings" value={`${stats.earningsFromReferrals} pts`} color="purple" />
        <StatCard icon={<Share2 className="w-5 h-5" />} label="Multiplier" value={`${stats.multiplier}x`} color="blue" />
      </div>

      {/* Referral Link */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Your Referral Link</h3>
        <div className="flex gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 font-mono truncate">
            {referralLink}
          </div>
          <button 
            onClick={copyToClipboard}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition flex items-center gap-2"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Share via</p>
          <div className="flex gap-3">
            <button className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition">
              <Facebook className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100 transition">
              <Twitter className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">How Referrals Work</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <StepBox number="1" title="Share Your Link" desc="Send your unique referral link to friends, family, or social media." />
          <StepBox number="2" title="They Sign Up" desc="Your friend registers and pays the KSH 100 fee. You earn a bonus." />
          <StepBox number="3" title="You Earn Forever" desc="Get 10% of their task earnings for life. Passive income." />
        </div>
      </div>

      {/* Tier Multipliers */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tier Multipliers</h3>
        <div className="space-y-3">
          <MultiplierRow tier="Free" multiplier="1x" desc="10% of referral earnings" current={stats.tier === "free"} />
          <MultiplierRow tier="Pro" multiplier="1.5x" desc="15% of referral earnings" current={stats.tier === "pro"} />
          <MultiplierRow tier="Elite" multiplier="2x" desc="20% of referral earnings" current={stats.tier === "elite"} />
        </div>
      </div>

      {/* Referral List */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Your Referrals</h3>
        <div className="space-y-3">
          {referrals.map((ref, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-700">{ref.name.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{ref.name}</p>
                  <p className="text-xs text-gray-500">Joined {ref.joined}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary-600">+{ref.earnings} pts</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  ref.status === "active" ? "bg-primary-100 text-primary-700" : "bg-gray-200 text-gray-500"
                }`}>
                  {ref.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  const colorMap: any = {
    primary: "bg-primary-50 text-primary-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function StepBox({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="text-2xl font-black text-primary-200 mb-2">{number}</div>
      <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function MultiplierRow({ tier, multiplier, desc, current }: { tier: string; multiplier: string; desc: string; current: boolean }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl ${current ? "bg-primary-50 border border-primary-200" : "bg-gray-50"}`}>
      <div className="flex items-center gap-3">
        <span className={`text-sm font-bold ${current ? "text-primary-700" : "text-gray-500"}`}>{tier}</span>
        <span className="text-xs text-gray-400">{desc}</span>
      </div>
      <span className={`text-sm font-bold ${current ? "text-primary-700" : "text-gray-500"}`}>{multiplier}</span>
    </div>
  );
}
