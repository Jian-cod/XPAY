"use client";

import { Check, X, AlertTriangle, Zap, Crown, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const tiers = [
    {
      name: "Free",
      icon: <Star className="w-5 h-5" />,
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "For the patient grinder",
      features: [
        { text: "1 task per day", included: true },
        { text: "Basic surveys only", included: true },
        { text: "KSH 6,500 min withdrawal", included: true },
        { text: "60 days minimum account age", included: true },
        { text: "150 tasks to unlock withdrawal", included: true },
        { text: "30-day streak required", included: true },
        { text: "14-day cooldown", included: true },
        { text: "Standard support", included: true },
        { text: "3-5 day payout processing", included: true },
        { text: "Premium surveys", included: false },
        { text: "AI training tasks", included: false },
        { text: "Early marketplace access", included: false },
      ],
      cta: "Start Free",
      color: "gray"
    },
    {
      name: "Pro",
      icon: <Zap className="w-5 h-5" />,
      monthlyPrice: 650,
      yearlyPrice: 6500,
      description: "Less brutal, still hard",
      features: [
        { text: "3 tasks per day", included: true },
        { text: "Basic + Premium surveys", included: true },
        { text: "KSH 4,500 min withdrawal", included: true },
        { text: "45 days minimum account age", included: true },
        { text: "100 tasks to unlock withdrawal", included: true },
        { text: "21-day streak required", included: true },
        { text: "14-day cooldown", included: true },
        { text: "Priority support", included: true },
        { text: "1-2 day payout processing", included: true },
        { text: "AI training tasks", included: true },
        { text: "Early marketplace access", included: true },
        { text: "Referral bonus boost", included: false },
      ],
      cta: "Upgrade to Pro",
      color: "primary",
      featured: true
    },
    {
      name: "Elite",
      icon: <Crown className="w-5 h-5" />,
      monthlyPrice: 1300,
      yearlyPrice: 13000,
      description: "Hard but fair",
      features: [
        { text: "5 tasks per day", included: true },
        { text: "All survey types", included: true },
        { text: "KSH 3,250 min withdrawal", included: true },
        { text: "35 days minimum account age", included: true },
        { text: "75 tasks to unlock withdrawal", included: true },
        { text: "14-day streak required", included: true },
        { text: "14-day cooldown", included: true },
        { text: "Instant support", included: true },
        { text: "Instant payout processing", included: true },
        { text: "AI training tasks", included: true },
        { text: "Exclusive marketplace items", included: true },
        { text: "2x referral bonus", included: true },
      ],
      cta: "Go Elite",
      color: "warning"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Choose Your Grind Level</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Higher tiers don't make it easy. They just make it possible.
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button 
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 rounded-lg font-medium transition ${billing === "monthly" ? "bg-primary-600 text-white" : "bg-white text-gray-600 border border-gray-200"}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBilling("yearly")}
              className={`px-4 py-2 rounded-lg font-medium transition ${billing === "yearly" ? "bg-primary-600 text-white" : "bg-white text-gray-600 border border-gray-200"}`}
            >
              Yearly <span className="text-xs ml-1">Save 17%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`bg-white rounded-2xl p-8 border ${tier.featured ? "border-primary-500 ring-2 ring-primary-500 shadow-xl" : "border-gray-200 shadow-sm"}`}
            >
              {tier.featured && (
                <div className="inline-block px-3 py-1 text-xs font-bold text-white bg-primary-600 rounded-full mb-4">
                  MOST POPULAR
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tier.color === "primary" ? "bg-primary-100 text-primary-600" : tier.color === "warning" ? "bg-warning-100 text-warning-600" : "bg-gray-100 text-gray-600"}`}>
                  {tier.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
              </div>

              <p className="text-gray-500 text-sm mb-4">{tier.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  KSH {billing === "monthly" ? tier.monthlyPrice : tier.yearlyPrice}
                </span>
                <span className="text-gray-500">/{billing === "monthly" ? "mo" : "yr"}</span>
              </div>

              <Link 
                href="/app"
                className={`block w-full text-center py-3 rounded-xl font-semibold transition mb-8 ${
                  tier.featured 
                    ? "gradient-primary text-white hover:opacity-90" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tier.cta}
              </Link>

              <div className="space-y-3">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? "text-gray-700" : "text-gray-400"}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FAQItem 
              q="Can I cancel my subscription anytime?"
              a="Yes. Cancel anytime. You'll keep your earned points but lose premium task access at the end of your billing period."
            />
            <FAQItem 
              q="What happens if I miss a day?"
              a="Your streak resets to zero. No exceptions. This is by design — consistency is the only path to withdrawal."
            />
            <FAQItem 
              q="Why is the withdrawal minimum so high?"
              a="It filters out exploiters and ensures only committed users cash out. It also protects our cash flow."
            />
            <FAQItem 
              q="Do I get a refund on the KSH 100 registration fee?"
              a="No. The registration fee is non-refundable. It covers your account setup and test administration."
            />
            <FAQItem 
              q="Can I use AI to complete tasks or pass the test?"
              a="No. We use AI detection on the intelligence test. If caught, instant fail and permanent ban. Task submissions are also monitored."
            />
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-6 py-4 max-w-2xl mx-auto">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">All tiers require the KSH 100 registration fee. Subscriptions are in addition to this fee.</p>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-semibold text-gray-900">{q}</span>
        <span className="text-gray-400 text-xl">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-gray-600 text-sm">{a}</div>
      )}
    </div>
  );
}
