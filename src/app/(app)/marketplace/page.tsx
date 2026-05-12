'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, DollarSign, Users, CheckCircle, MapPin, Briefcase, Search } from 'lucide-react';
import Link from 'next/link';

type Section = 'kenya' | 'international' | 'curated' | 'referrals';

interface KenyaJob {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  location: string;
  category: string;
  job_type: string;
  application_url: string;
  total_vacancies: number;
  filled_vacancies: number;
}

interface InternationalJob {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  location: string;
  category: string;
  job_type: string;
  application_url: string;
  is_referral: boolean;
  referral_bonus: number;
  total_vacancies: number;
  filled_vacancies: number;
}

interface CuratedJob {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  location: string;
  category: string;
  job_type: string;
  access_price: number;
  application_url: string;
  total_vacancies: number;
  filled_vacancies: number;
}

interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  category: string;
  payout_amount: number;
  payout_currency: string;
  signup_url: string;
  referral_url: string;
  user_requirements: string;
}

interface Purchase {
  job_id: string;
  job_type: string;
}

export default function MarketplacePage() {
  const [activeSection, setActiveSection] = useState<Section>('kenya');
  const [kenyaJobs, setKenyaJobs] = useState<KenyaJob[]>([]);
  const [internationalJobs, setInternationalJobs] = useState<InternationalJob[]>([]);
  const [curatedJobs, setCuratedJobs] = useState<CuratedJob[]>([]);
  const [referrals, setReferrals] = useState<ReferralProgram[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [userBalance, setUserBalance] = useState(0);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    setUserId(user.id);

    const { data: profile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single();

    setUserBalance(Number(profile?.balance || 0));

    const { data: purchaseData } = await supabase
      .from('job_purchases')
      .select('job_id, job_type')
      .eq('user_id', user.id);

    setPurchases(purchaseData || []);

    const [{ data: kj }, { data: ij }, { data: cj }, { data: ref }] = await Promise.all([
      supabase.from('kenya_jobs').select('*').eq('status', 'active').order('created_at', { ascending: false }),
      supabase.from('international_jobs').select('*').eq('status', 'active').order('created_at', { ascending: false }),
      supabase.from('curated_jobs').select('*').eq('status', 'active').order('created_at', { ascending: false }),
      supabase.from('referral_programs').select('*').eq('status', 'active').order('created_at', { ascending: false })
    ]);

    setKenyaJobs(kj || []);
    setInternationalJobs(ij || []);
    setCuratedJobs(cj || []);
    setReferrals(ref || []);
    setLoading(false);
  };

  const purchaseJob = async (job: CuratedJob) => {
    if (userBalance < job.access_price) {
      alert(`Insufficient balance. You need KES ${job.access_price}. Complete surveys or tasks to earn more.`);
      return;
    }

    const confirm = window.confirm(
      `Unlock "${job.title}" for KES ${job.access_price}?\n\nYou will see the full application link and instructions.`
    );

    if (!confirm) return;

    const newBalance = userBalance - job.access_price;
    
    const { error: balanceError } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', userId);

    if (balanceError) {
      alert(balanceError.message);
      return;
    }

    const { error: purchaseError } = await supabase
      .from('job_purchases')
      .insert({
        user_id: userId,
        job_id: job.id,
        job_type: 'curated',
        price_paid: job.access_price,
      });

    if (purchaseError) {
      alert(purchaseError.message);
      return;
    }

    await supabase.from('transactions').insert({
      user_id: userId,
      type: 'job_purchase',
      amount: -job.access_price,
      description: `Purchased access to ${job.title}`,
      status: 'completed',
    });

    await supabase
      .from('curated_jobs')
      .update({ filled_vacancies: job.filled_vacancies + 1 })
      .eq('id', job.id);

    setUserBalance(newBalance);
    setPurchases(prev => [...prev, { job_id: job.id, job_type: 'curated' }]);
    alert('Access unlocked! Scroll down to see the application link.');
    fetchData();
  };

  const isPurchased = (jobId: string, type: string) => {
    return purchases.some(p => p.job_id === jobId && p.job_type === type);
  };

  const getFilteredJobs = (jobs: any[]) => {
    return jobs.filter(job => {
      const matchesSearch = searchQuery === '' || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  const getCategories = (jobs: any[]) => {
    return ['all', ...Array.from(new Set(jobs.map(j => j.category).filter(Boolean)))];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading marketplace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Job Marketplace</h1>
              <p className="text-gray-500 mt-1">Real jobs. Real money. Verified listings.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Your Balance</p>
                <p className="text-2xl font-bold text-green-600">KES {userBalance}</p>
              </div>
              <Link 
                href="/surveys" 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 transition"
              >
                Earn More →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'kenya' as Section, label: '🇰🇪 Kenya Jobs', count: kenyaJobs.length },
            { id: 'international' as Section, label: '🌍 International', count: internationalJobs.length },
            { id: 'curated' as Section, label: '👑 Premium', count: curatedJobs.length },
            { id: 'referrals' as Section, label: '💰 Refer & Earn', count: referrals.length },
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-5 py-3 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${
                activeSection === section.id
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              {section.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeSection === section.id ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {section.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-black"
          >
            {getCategories(
              activeSection === 'kenya' ? kenyaJobs :
              activeSection === 'international' ? internationalJobs :
              activeSection === 'curated' ? curatedJobs : []
            ).map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6">
        {/* KENYA JOBS */}
        {activeSection === 'kenya' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredJobs(kenyaJobs).map(job => {
              const vacanciesLeft = job.total_vacancies - job.filled_vacancies;
              const isFull = vacanciesLeft <= 0;

              return (
                <div key={job.id} className={`rounded-2xl border bg-white p-6 shadow-sm ${isFull ? 'opacity-50 grayscale' : ''}`}>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">KENYA</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">{job.job_type}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{job.company}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-green-600">
                        KES {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}/mo
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4" />
                      <span className={vacanciesLeft <= 2 ? 'text-red-500 font-bold' : 'text-gray-500'}>
                        {vacanciesLeft} of {job.total_vacancies} spots left
                      </span>
                    </div>
                  </div>

                  {isFull ? (
                    <div className="p-3 bg-gray-100 rounded-xl text-center">
                      <p className="font-bold text-gray-500">POSITIONS FILLED</p>
                    </div>
                  ) : (
                    <a
                      href={job.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
                    >
                      Apply Now →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* INTERNATIONAL JOBS */}
        {activeSection === 'international' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredJobs(internationalJobs).map(job => {
              const vacanciesLeft = job.total_vacancies - job.filled_vacancies;
              const isFull = vacanciesLeft <= 0;

              return (
                <div key={job.id} className={`rounded-2xl border bg-white p-6 shadow-sm ${isFull ? 'opacity-50 grayscale' : ''}`}>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">GLOBAL</span>
                    {job.is_referral && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                        XPAY EARNS ${job.referral_bonus}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{job.company}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-green-600">
                        ${job.salary_min} - ${job.salary_max}/mo
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4" />
                      <span className={vacanciesLeft <= 5 ? 'text-red-500 font-bold' : 'text-gray-500'}>
                        {vacanciesLeft} spots left
                      </span>
                    </div>
                  </div>

                  {isFull ? (
                    <div className="p-3 bg-gray-100 rounded-xl text-center">
                      <p className="font-bold text-gray-500">POSITIONS FILLED</p>
                    </div>
                  ) : (
                    <a
                      href={job.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition"
                    >
                      {job.is_referral ? 'Sign Up & Earn →' : 'Apply Now →'}
                    </a>
                  )}

                  {job.is_referral && (
                    <p className="text-xs text-gray-400 text-center mt-2">
                      XPAY earns ${job.referral_bonus} when you sign up
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CURATED PREMIUM */}
        {activeSection === 'curated' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredJobs(curatedJobs).map(job => {
              const isPurchasedJob = isPurchased(job.id, 'curated');
              const vacanciesLeft = job.total_vacancies - job.filled_vacancies;
              const isFull = vacanciesLeft <= 0;

              return (
                <div key={job.id} className={`rounded-2xl border bg-white p-6 shadow-sm relative ${isFull ? 'opacity-50 grayscale' : ''}`}>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded">PREMIUM</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">{job.job_type}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{job.company}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-green-600">
                        ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}/mo
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4" />
                      <span className={vacanciesLeft <= 1 ? 'text-red-500 font-bold' : 'text-gray-500'}>
                        {vacanciesLeft} of {job.total_vacancies} left
                      </span>
                    </div>
                  </div>

                  {isFull ? (
                    <div className="p-3 bg-gray-100 rounded-xl text-center">
                      <p className="font-bold text-gray-500">ALL POSITIONS FILLED</p>
                    </div>
                  ) : isPurchasedJob ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-bold text-green-700">Access Unlocked</span>
                        </div>
                      </div>
                      <a
                        href={job.application_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
                      >
                        Apply Now →
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Lock className="w-5 h-5 text-amber-600" />
                          <span className="text-sm text-amber-800">Unlock Required</span>
                        </div>
                        <span className="font-bold text-amber-700">KES {job.access_price}</span>
                      </div>
                      <button
                        onClick={() => purchaseJob(job)}
                        disabled={userBalance < job.access_price}
                        className={`w-full py-3 rounded-xl font-bold transition ${
                          userBalance < job.access_price
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800'
                        }`}
                      >
                        {userBalance < job.access_price 
                          ? `Need KES ${job.access_price}` 
                          : `Unlock for KES ${job.access_price}`
                        }
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* REFERRAL PROGRAMS */}
        {activeSection === 'referrals' && (
          <div>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>How it works:</strong> Sign up on these platforms using the links below. When you complete tasks, <strong>XPAY earns a referral bonus</strong>. You earn directly from the platform, we earn from your signup. Win-win!
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {referrals.map(program => (
                <div key={program.id} className="rounded-2xl border bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {program.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold">{program.name}</h3>
                      <p className="text-xs text-gray-500">{program.category}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{program.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-green-600">
                        XPAY earns ${program.payout_amount} per signup
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4" />
                      <span>You need: {program.user_requirements}</span>
                    </div>
                  </div>

                  <a
                    href={program.referral_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
                  >
                    Sign Up & Start Earning →
                  </a>

                  <p className="text-xs text-gray-400 text-center mt-2">
                    Works in Kenya ✅
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(activeSection === 'kenya' && getFilteredJobs(kenyaJobs).length === 0) ||
         (activeSection === 'international' && getFilteredJobs(internationalJobs).length === 0) ||
         (activeSection === 'curated' && getFilteredJobs(curatedJobs).length === 0) ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs match your search.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}