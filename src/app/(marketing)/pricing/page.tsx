'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Check, Crown, Zap, Star } from 'lucide-react';

interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  tier: string;
}

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [currentTier, setCurrentTier] = useState('free');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', user.id)
        .single();

      setCurrentTier(profile?.tier || 'free');
    }

    setLoading(false);
  };

  const tiers: PricingTier[] = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Get started with basic earning',
      icon: <Star className="w-6 h-6" />,
      color: 'gray',
      tier: 'free',
      features: [
        '3 tasks per day',
        'Max KES 50 reward per task',
        '1x reward multiplier',
        'Basic surveys access',
        'Standard withdrawal (KES 500 min)',
      ],
    },
    {
      name: 'Pro',
      price: 200,
      period: 'month',
      description: 'Earn more with better tasks',
      icon: <Zap className="w-6 h-6" />,
      color: 'blue',
      tier: 'pro',
      features: [
        '10 tasks per day',
        'Max KES 120 reward per task',
        '1.5x reward multiplier',
        'Priority survey access',
        'Lower withdrawal (KES 300 min)',
        'Premium support',
      ],
    },
    {
      name: 'Elite',
      price: 500,
      period: 'month',
      description: 'Unlimited earning potential',
      icon: <Crown className="w-6 h-6" />,
      color: 'purple',
      tier: 'elite',
      features: [
        'Unlimited tasks per day',
        'Any reward amount (no max)',
        '2x reward multiplier',
        'First access to new offers',
        'Lowest withdrawal (KES 100 min)',
        'Priority support',
        'Exclusive high-paying tasks',
      ],
    },
  ];

  const handleUpgrade = async (tier: string) => {
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }

    if (tier === currentTier) {
      alert('You are already on this tier!');
      return;
    }

    if (tier === 'free') {
      // Downgrade
      const { error } = await supabase
        .from('profiles')
        .update({ tier: 'free' })
        .eq('id', user.id);

      if (error) {
        alert(error.message);
      } else {
        alert('Downgraded to Free tier.');
        setCurrentTier('free');
      }
      return;
    }

    // For paid tiers, redirect to payment
    // For now, we'll simulate payment with M-Pesa
    const confirmPayment = confirm(
      `Upgrade to ${tier.toUpperCase()} for KES ${tier === 'pro' ? 200 : 500}/month?\n\nClick OK to simulate payment (M-Pesa integration coming soon).`
    );

    if (confirmPayment) {
      // In production, this would open M-Pesa payment popup
      // For now, we update tier directly
      const { error } = await supabase
        .from('profiles')
        .update({ tier: tier })
        .eq('id', user.id);

      if (error) {
        alert(error.message);
      } else {
        alert(`Successfully upgraded to ${tier.toUpperCase()}!`);
        setCurrentTier(tier);
        router.push('/tasks');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade Your Earnings
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the tier that fits your earning goals. Higher tiers unlock more tasks, bigger rewards, and exclusive opportunities.
          </p>
        </div>

        {/* Tiers */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => {
            const isCurrent = currentTier === tier.tier;
            const isLocked = user && getTierLevel(currentTier) > getTierLevel(tier.tier);

            return (
              <div
                key={tier.tier}
                className={`rounded-2xl border bg-white p-8 shadow-sm relative ${
                  isCurrent ? 'ring-2 ring-green-500' : ''
                } ${tier.color === 'purple' ? 'border-purple-200' : ''} ${
                  tier.color === 'blue' ? 'border-blue-200' : ''
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                    CURRENT PLAN
                  </div>
                )}

                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                      tier.color === 'purple'
                        ? 'bg-purple-100 text-purple-600'
                        : tier.color === 'blue'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tier.icon}
                  </div>
                  <h2 className="text-2xl font-bold">{tier.name}</h2>
                  <p className="text-gray-500 mt-1">{tier.description}</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">KES {tier.price}</span>
                  <span className="text-gray-500">/{tier.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(tier.tier)}
                  disabled={isCurrent || isLocked}
                  className={`w-full py-3.5 rounded-xl font-bold transition ${
                    isCurrent
                      ? 'bg-gray-100 text-gray-400 cursor-default'
                      : isLocked
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : tier.color === 'purple'
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : tier.color === 'blue'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  {isCurrent
                    ? 'Current Plan'
                    : isLocked
                    ? 'Downgrade'
                    : tier.price === 0
                    ? 'Get Started Free'
                    : `Upgrade to ${tier.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold mb-2">How do I pay for Pro or Elite?</h3>
              <p className="text-gray-600 text-sm">
                Payment via M-Pesa coming soon. For now, upgrades are processed manually. Contact support for assistance.
              </p>
            </div>
            
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold mb-2">Can I downgrade anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you can downgrade to Free anytime. Your current tier benefits remain until the end of your billing period.
              </p>
            </div>
            
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold mb-2">What's the refund policy?</h3>
              <p className="text-gray-600 text-sm">
                7-day money-back guarantee. If you're not satisfied, contact us for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTierLevel(tier: string): number {
  const levels: { [key: string]: number } = {
    free: 1,
    pro: 2,
    elite: 3,
  };
  return levels[tier] || 1;
}