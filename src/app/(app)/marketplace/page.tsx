"use client";

import { useState } from "react";
import { ShoppingBag, Lock, CheckCircle, Star, ExternalLink, Shield } from "lucide-react";

const categories = ["All", "Job Links", "Resume Reviews", "Courses", "Tools"];

const mockItems = [
  {
    id: 1,
    title: "Remote Data Entry Job — Verified",
    category: "Job Links",
    description: "Direct application link to a verified remote data entry position. Pays $400-600/month. Company vetted.",
    priceKSH: 500,
    priceUSD: 3.85,
    rating: 4.8,
    reviews: 124,
    tier: "free",
    sold: 89,
    featured: true,
  },
  {
    id: 2,
    title: "Professional Resume Review",
    category: "Resume Reviews",
    description: "Detailed feedback on your resume. ATS optimization tips. 48-hour turnaround.",
    priceKSH: 800,
    priceUSD: 6.15,
    rating: 4.9,
    reviews: 256,
    tier: "free",
    sold: 312,
    featured: false,
  },
  {
    id: 3,
    title: "Freelance Writing Masterclass",
    category: "Courses",
    description: "Learn to earn $500+/month as a freelance writer. 6 modules. Certificate included.",
    priceKSH: 1500,
    priceUSD: 11.54,
    rating: 4.7,
    reviews: 89,
    tier: "pro",
    sold: 156,
    featured: true,
  },
  {
    id: 4,
    title: "Remote Customer Support Job — Verified",
    category: "Job Links",
    description: "Work-from-home customer support role. $500-700/month. Equipment provided.",
    priceKSH: 750,
    priceUSD: 5.77,
    rating: 4.6,
    reviews: 67,
    tier: "pro",
    sold: 45,
    featured: false,
  },
  {
    id: 5,
    title: "AI Prompt Engineering Course",
    category: "Courses",
    description: "Master AI prompts for productivity and income. Includes 50+ proven templates.",
    priceKSH: 2000,
    priceUSD: 15.38,
    rating: 4.9,
    reviews: 178,
    tier: "elite",
    sold: 234,
    featured: true,
  },
  {
    id: 6,
    title: "LinkedIn Profile Optimization",
    category: "Tools",
    description: "Complete LinkedIn overhaul. Keyword optimization. Recruiter-ready profile.",
    priceKSH: 600,
    priceUSD: 4.62,
    rating: 4.5,
    reviews: 45,
    tier: "free",
    sold: 78,
    featured: false,
  },
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const userTier = "free";

  const filteredItems = mockItems.filter(item => 
    activeCategory === "All" || item.category === activeCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Marketplace</h2>
        <p className="text-gray-500">Curated items to accelerate your earning journey. All vetted by Xpay.</p>
      </div>

      {/* Trust Banner */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-center gap-3">
        <Shield className="w-5 h-5 text-primary-600 flex-shrink-0" />
        <p className="text-sm text-primary-700">
          <strong>Every item is manually verified.</strong> Job links are real, courses are tested, and reviews are from verified purchasers.
        </p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
              activeCategory === cat 
                ? "bg-primary-600 text-white" 
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <MarketplaceCard key={item.id} item={item} userTier={userTier} />
        ))}
      </div>
    </div>
  );
}

function MarketplaceCard({ item, userTier }: { item: any; userTier: string }) {
  const [purchased, setPurchased] = useState(false);
  const tierOrder = { free: 0, pro: 1, elite: 2 };
  const isLocked = tierOrder[userTier as keyof typeof tierOrder] < tierOrder[item.tier as keyof typeof tierOrder];

  if (isLocked) {
    return (
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 opacity-75">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            item.tier === "pro" ? "bg-blue-100 text-blue-700" : "bg-warning-100 text-warning-700"
          }`}>
            {item.tier.toUpperCase()} ONLY
          </span>
          <Lock className="w-4 h-4 text-gray-400" />
        </div>
        <h3 className="font-bold text-gray-500 mb-2">{item.title}</h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gray-400">KSH {item.priceKSH}</p>
          <button className="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed">
            Upgrade to Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
      {item.featured && (
        <div className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-700 mb-3">
          FEATURED
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          {item.category}
        </span>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-warning-400 fill-warning-400" />
          <span className="text-sm font-bold text-gray-700">{item.rating}</span>
          <span className="text-xs text-gray-400">({item.reviews})</span>
        </div>
      </div>

      <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <CheckCircle className="w-4 h-4 text-primary-500" />
        <span>{item.sold} sold</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-bold text-gray-900">KSH {item.priceKSH}</p>
          <p className="text-xs text-gray-500">~${item.priceUSD}</p>
        </div>
        <button 
          onClick={() => setPurchased(!purchased)}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
            purchased 
              ? "bg-primary-100 text-primary-700" 
              : "bg-primary-600 text-white hover:bg-primary-700"
          }`}
        >
          {purchased ? (
            <><CheckCircle className="w-4 h-4" /> Purchased</>
          ) : (
            <><ShoppingBag className="w-4 h-4" /> Buy Now</>
          )}
        </button>
      </div>
    </div>
  );
}
