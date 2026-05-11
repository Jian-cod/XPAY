"use client";

import Link from "next/link";
import { Wallet, TrendingUp, Shield, Clock, AlertTriangle, CheckCircle, Star, Users, Target, Zap } from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [showWarning, setShowWarning] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50 to-white pt-20 pb-32">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-100 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Now available in Kenya & Worldwide
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
            Real Effort.<br />
            <span className="text-green-600">Real Money.</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Complete surveys, AI training tasks, and micro-jobs. Earn points convertible to real cash via M-Pesa or PayPal.
          </p>

          <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 max-w-xl mx-auto mb-10">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">This is NOT easy money. Most users earn their first withdrawal in 1.5-2 weeks of daily effort.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 text-lg font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200">
              Start Earning — KSH 100 to Begin
            </Link>
            <button 
              onClick={() => setShowWarning(true)}
              className="px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition"
            >
              Read the Hard Truth
            </button>
          </div>

          {/* Secondary CTA for returning users */}
          <p className="mt-4 text-sm text-gray-500">
            Already grinding?{" "}
            <Link href="/login" className="font-semibold text-green-600 hover:text-green-700 underline">
              Sign In
            </Link>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
            <StatCard icon={<Users className="w-5 h-5" />} value="50K+" label="Active Users" />
            <StatCard icon={<Target className="w-5 h-5" />} value="KSH 12M+" label="Paid Out" />
            <StatCard icon={<CheckCircle className="w-5 h-5" />} value="150+" label="Task Types" />
            <StatCard icon={<Star className="w-5 h-5" />} value="4.2" label="App Rating" />
          </div>
        </div>
      </section>

      {/* Hard Truth Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-900">The Hard Truth</h2>
            </div>
            <div className="space-y-3 text-gray-600">
              <p>• <strong>KSH 100 registration fee</strong> required before you can earn anything. Non-refundable.</p>
              <p>• <strong>75-92% survey disqualification rate</strong> — most attempts fail.</p>
              <p>• <strong>Minimum 12-21 days</strong> account age + 150 tasks for first withdrawal (Free tier).</p>
              <p>• <strong>14-day streak</strong> required — miss one day, start over.</p>
              <p>• <strong>80% approval rate</strong> minimum on task submissions.</p>
              <p>• <strong>KSH 6,500 minimum</strong> withdrawal amount.</p>
              <p>• <strong>6-day cooldown</strong> between withdrawals.</p>
              <p>• <strong>~5.1% withdrawal fee</strong> </p>
            </div>
            <Link 
              href="/register"
              onClick={() => setShowWarning(false)}
              className="mt-6 block w-full py-3 font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition text-center"
            >
              I Understand — Let Me Try
            </Link>
          </div>
        </div>
      )}

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Xpay Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Four steps. Simple on paper. Brutal in practice.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <StepCard number="01" icon={<Wallet className="w-6 h-6" />} title="Pay KSH 100" desc="One-time registration fee. No refunds. This filters out time-wasters." />
            <StepCard number="02" icon={<Target className="w-6 h-6" />} title="Pass the Test" desc="Intelligence test after payment. AI detection active. Cheating = instant ban." />
            <StepCard number="03" icon={<Clock className="w-6 h-6" />} title="Grind Daily" desc="Complete tasks. Surveys disqualify 75-92% of the time. Streaks reset if you miss a day." />
            <StepCard number="04" icon={<TrendingUp className="w-6 h-6" />} title="Earn & Withdraw" desc="Hit the extreme requirements. Pay the fee. Wait 14 days. Get paid." />
          </div>
        </div>
      </section>

      {/* Difficulty Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Extreme Difficulty</h2>
            <p className="text-gray-600">We don't hide it. We celebrate it. Only the committed survive.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <DifficultyCard tier="Free" price="KSH 0" days="60" tasks="150" streak="30" approval="80%" min="KSH 6,500" daily="1 task/day" color="gray" />
            <DifficultyCard tier="Pro" price="KSH 650/mo" days="45" tasks="100" streak="21" approval="85%" min="KSH 4,500" daily="3 tasks/day" color="primary" featured />
            <DifficultyCard tier="Elite" price="KSH 1,300/mo" days="35" tasks="75" streak="14" approval="90%" min="KSH 3,250" daily="5 tasks/day" color="warning" />
          </div>
        </div>
      </section>

      {/* Revenue Share Transparency */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Transparent Revenue Share</h2>
            <p className="text-gray-600">Every task shows exactly what you earn and what Xpay keeps.</p>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-8 md:p-12 text-white max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center">
                <p className="text-green-100 text-sm font-medium mb-1">Provider Pays</p>
                <p className="text-4xl font-bold">150 pts</p>
                <p className="text-green-100 text-sm">(~KSH 195)</p>
              </div>
              <div className="text-4xl font-bold text-green-200">→</div>
              <div className="text-center">
                <p className="text-green-100 text-sm font-medium mb-1">You Earn</p>
                <p className="text-4xl font-bold">105 pts</p>
                <p className="text-green-100 text-sm">70%</p>
              </div>
              <div className="text-4xl font-bold text-green-200">+</div>
              <div className="text-center">
                <p className="text-green-100 text-sm font-medium mb-1">Xpay Keeps</p>
                <p className="text-4xl font-bold">45 pts</p>
                <p className="text-green-100 text-sm">30%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Survivor Stories</h2>
            <p className="text-gray-600">Real users who put in the work and got paid.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard name="Grace M." location="Nairobi, Kenya" quote="It took me 28 days of grinding every single day. I almost gave up at day 14 when my streak broke. But I started again and finally withdrew KSH 8,200. It was real." amount="KSH 8,200" days="28" />
            <TestimonialCard name="James O." location="Kisumu, Kenya" quote="The surveys disqualify you constantly. I learned to answer carefully. Upgraded to Pro after 2 weeks. My second withdrawal was faster — day 19." amount="KSH 12,500" days="19" />
            <TestimonialCard name="Amina H." location="Mombasa, Kenya" quote="I bought a curated remote job link from the marketplace for KSH 500. Landed a data entry gig paying KSH 30K/month. Best investment ever." amount="KSH 30K/mo job" days="—" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Grind?</h2>
          <p className="text-xl text-gray-400 mb-8">KSH 100 registration fee. No refunds. No guarantees. Just a chance to earn if you're willing to work.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-block px-10 py-5 text-lg font-bold text-gray-900 bg-white rounded-xl hover:bg-gray-100 transition shadow-xl">
              Create Account — KSH 100
            </Link>
            <Link href="/login" className="inline-block px-10 py-5 text-lg font-bold text-white border-2 border-white rounded-xl hover:bg-white/10 transition">
              Sign In (Returning User)
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">By signing up, you agree that this is hard work and that your earnings 100% depend on your toil and consistency.</p>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="text-green-600 mb-2">{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function StepCard({ number, icon, title, desc }: { number: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="text-4xl font-black text-green-100 mb-4">{number}</div>
      <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}

function DifficultyCard({ tier, price, days, tasks, streak, approval, min, daily, color, featured }: any) {
  const colorClasses: any = {
    gray: "border-gray-200",
    primary: "border-green-200 ring-2 ring-green-500",
    warning: "border-amber-200"
  };

  return (
    <div className={`bg-white rounded-2xl p-6 border ${colorClasses[color]} ${featured ? "shadow-xl" : "shadow-sm"}`}>
      {featured && <div className="inline-block px-3 py-1 text-xs font-bold text-white bg-green-600 rounded-full mb-4">MOST POPULAR</div>}
      <h3 className="text-2xl font-bold text-gray-900">{tier}</h3>
      <p className="text-3xl font-bold text-green-600 mt-2">{price}</p>
      <div className="mt-6 space-y-3">
        <RequirementRow label="Min Account Age" value={`${days} days`} />
        <RequirementRow label="Tasks Completed" value={tasks} />
        <RequirementRow label="Streak Required" value={`${streak} days`} />
        <RequirementRow label="Approval Rate" value={approval} />
        <RequirementRow label="Min Withdrawal" value={min} />
        <RequirementRow label="Daily Tasks" value={daily} />
        <RequirementRow label="Cooldown" value="14 days" />
      </div>
    </div>
  );
}

function RequirementRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function TestimonialCard({ name, location, quote, amount, days }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-1 mb-4">
        {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
      </div>
      <p className="text-gray-700 mb-6 text-sm leading-relaxed">"{quote}"</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-green-600">{amount}</p>
          {days !== "—" && <p className="text-xs text-gray-400">{days} days</p>}
        </div>
      </div>
    </div>
  );
}
