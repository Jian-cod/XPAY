"use client";

import { Target, Shield, Heart, Globe, Users, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Mission</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Xpay was built on one simple belief: <strong>real money should require real effort.</strong> 
            In a world of scams and get-rich-quick schemes, we choose transparency. We tell you upfront: 
            this is hard, this takes time, and most people won't make it. But for those who do — 
            the money is real.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Stand For</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Shield className="w-8 h-8" />}
              title="Transparency"
              desc="We show you exactly what you earn, what we keep, and why withdrawals are hard. No hidden fees. No surprises."
            />
            <ValueCard 
              icon={<Target className="w-8 h-8" />}
              title="Meritocracy"
              desc="Your earnings depend on your effort, consistency, and quality. Not luck. Not connections. Just work."
            />
            <ValueCard 
              icon={<Heart className="w-8 h-8" />}
              title="Fairness"
              desc="The same rules apply to everyone. Same disqualification rates. Same requirements. Same grind."
            />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Xpay Story</h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-4">
              Xpay started with a frustration. Every "earn money online" app promised easy cash but delivered pennies, 
              scams, or impossible withdrawal thresholds hidden in fine print. Users felt cheated. Platforms got rich. 
              Something was wrong.
            </p>
            <p className="mb-4">
              We decided to do the opposite. Instead of hiding the difficulty, we put it front and center. 
              Instead of pretending it's easy, we tell you it's brutally hard. Instead of tiny withdrawals, 
              we set high bars that only the committed can clear.
            </p>
            <p className="mb-4">
              The result? A platform where users who stick around actually get paid. Where the KSH 100 registration fee 
              filters out time-wasters. Where the intelligence test ensures only capable users access surveys. 
              Where AI detection catches cheaters instantly.
            </p>
            <p>
              We're not for everyone. We're for the grinders. The persistent. The ones who understand that 
              in this economy, nothing comes easy — but with effort, something always comes.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatBox icon={<Users className="w-6 h-6" />} value="50,000+" label="Registered Users" />
            <StatBox icon={<TrendingUp className="w-6 h-6" />} value="KSH 12M+" label="Total Paid Out" />
            <StatBox icon={<Globe className="w-6 h-6" />} value="2" label="Countries (Kenya & Global)" />
            <StatBox icon={<Target className="w-6 h-6" />} value="8.5%" label="Withdrawal Success Rate" />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-gray-400 mb-8">Questions? Concerns? Just want to say hi? We're here.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <ContactCard title="Email" value="support@xpay.com" />
            <ContactCard title="Phone" value="+254 700 000 000" />
            <ContactCard title="Location" value="Nairobi, Kenya" />
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-primary-600 flex justify-center mb-2">{icon}</div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function ContactCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}
