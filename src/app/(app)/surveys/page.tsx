'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface TierLimit {
  tier: string;
  daily_tasks: number;
  task_multiplier: number;
  description: string;
}

export default function SurveysPage() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userTier, setUserTier] = useState('free');
  const [tierLimit, setTierLimit] = useState<TierLimit | null>(null);
  const [tasksToday, setTasksToday] = useState(0);
  const [tasksRemaining, setTasksRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSurvey, setShowSurvey] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    setUserId(user.id);
    setUserEmail(user.email || '');

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, tier, balance')
      .eq('id', user.id)
      .single();

    const tier = profile?.tier || 'free';
    setUserName(profile?.full_name || 'User');
    setUserTier(tier);

    // Get tier limits
    const { data: tierData } = await supabase
      .from('tier_limits')
      .select('*')
      .eq('tier', tier)
      .single();

    setTierLimit(tierData);

    // Get today's task count
    const today = new Date().toISOString().split('T')[0];
    const { data: dailyCount } = await supabase
      .from('daily_task_counts')
      .select('task_count')
      .eq('user_id', user.id)
      .eq('task_date', today)
      .single();

    const count = dailyCount?.task_count || 0;
    setTasksToday(count);
    setTasksRemaining((tierData?.daily_tasks || 3) - count);

    setLoading(false);
  };

  const startSurvey = () => {
    if (tasksRemaining <= 0) {
      alert('Daily task limit reached. Upgrade your tier for more tasks!');
      return;
    }
    setShowSurvey(true);
  };

  const handleSurveyComplete = async () => {
    // Increment daily task count
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existing } = await supabase
      .from('daily_task_counts')
      .select('task_count')
      .eq('user_id', userId)
      .eq('task_date', today)
      .single();

    if (existing) {
      await supabase
        .from('daily_task_counts')
        .update({ task_count: existing.task_count + 1 })
        .eq('user_id', userId)
        .eq('task_date', today);
    } else {
      await supabase
        .from('daily_task_counts')
        .insert({ user_id: userId, task_date: today, task_count: 1 });
    }

    setTasksToday(prev => prev + 1);
    setTasksRemaining(prev => prev - 1);
    setShowSurvey(false);
    
    // Refresh to show updated count
    fetchUserData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const secureHash = generateHash(userId);
  const iframeUrl = `https://offers.cpx-research.com/index.php?app_id=33004&ext_user_id=${encodeURIComponent(userId)}&secure_hash=${secureHash}&username=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}&subid_1=${userTier}&subid_2=`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Paid Surveys</h1>
            <p className="text-sm text-gray-500">Complete surveys and earn real money</p>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              userTier === 'pro' ? 'bg-purple-100 text-purple-700' :
              userTier === 'elite' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {userTier.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Task Limit Banner */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl border p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Daily Tasks</p>
              <p className="text-2xl font-bold">
                {tasksToday} / {tierLimit?.daily_tasks === 999 ? '∞' : tierLimit?.daily_tasks}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Remaining Today</p>
              <p className={`text-2xl font-bold ${tasksRemaining <= 0 ? 'text-red-500' : 'text-green-600'}`}>
                {tasksRemaining <= 0 ? 0 : tasksRemaining}
              </p>
            </div>
          </div>
          
          {tasksRemaining <= 0 && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                Daily limit reached! <a href="/pricing" className="font-bold underline">Upgrade to Elite or Pro</a> for more daily tasks.
              </p>
            </div>
          )}

          {userTier === 'free' && tasksRemaining > 0 && (
            <p className="mt-2 text-xs text-gray-400">
              Free users get {tierLimit?.daily_tasks} tasks/day. 
              <a href="/pricing" className="text-green-600 font-medium ml-1">Upgrade for more</a>
            </p>
          )}
        </div>

        {/* Start Survey Button or Survey Wall */}
        {!showSurvey ? (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Surveys Available!</h2>
            <p className="mb-6">New surveys added daily. Complete them and earn KES rewards.</p>
            
            <button
              onClick={startSurvey}
              disabled={tasksRemaining <= 0}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition ${
                tasksRemaining <= 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-white text-purple-600 hover:bg-gray-100'
              }`}
            >
              {tasksRemaining <= 0 ? 'Daily Limit Reached' : 'Start Survey →'}
            </button>
            
            <p className="mt-4 text-sm opacity-80">
              Reward multiplier: {tierLimit?.task_multiplier}x
            </p>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setShowSurvey(false)}
              className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to Survey Menu
            </button>
            
            <iframe 
              width="100%" 
              frameBorder="0" 
              height="2000px" 
              src={iframeUrl}
              className="w-full rounded-xl border"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function generateHash(userId: string): string {
  const secureHash = 'h4iGGazI93ILiS3oHdAB8RyT6pJMz4e3';
  const hashInput = `${userId}-${secureHash}`;
  
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(16);
}