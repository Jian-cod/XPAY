'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SurveysPage() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [activeProvider, setActiveProvider] = useState<'cpx' | 'theorem'>('cpx');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    setUserId(user.id);
    setUserEmail(user.email || '');

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, tier')
      .eq('id', user.id)
      .single();

    setUserName(profile?.full_name || 'User');
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading surveys...</p>
      </div>
    );
  }

  // CPX Research URL
  const cpxHash = generateCpxHash(userId);
  const cpxUrl = `https://offers.cpx-research.com/index.php?app_id=33004&ext_user_id=${encodeURIComponent(userId)}&secure_hash=${cpxHash}&username=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}&subid_1=&subid_2`;

  // TheoremReach URL
  const theoremUrl = `https://theoremreach.com/surveywall/${userId}?app_id=24959&user_id=${encodeURIComponent(userId)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">Paid Surveys</h1>
          <p className="text-sm text-gray-500">Complete surveys and earn real money</p>
        </div>
      </div>

      {/* Provider Tabs */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveProvider('cpx')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeProvider === 'cpx'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            CPX Research
          </button>
          <button
            onClick={() => setActiveProvider('theorem')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeProvider === 'theorem'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            TheoremReach
          </button>
        </div>

        {/* Info Banner */}
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800">
            💡 <strong>Tip:</strong> Survey amounts vary by your profile and location. If one provider shows no surveys, try the other. Complete your profile honestly for better matches.
          </p>
        </div>

        {/* Survey Iframe */}
        {activeProvider === 'cpx' ? (
          <iframe 
            width="100%" 
            frameBorder="0" 
            height="2000px" 
            src={cpxUrl}
            className="w-full rounded-xl border bg-white"
          />
        ) : (
          <iframe 
            width="100%" 
            frameBorder="0" 
            height="2000px" 
            src={theoremUrl}
            className="w-full rounded-xl border bg-white"
          />
        )}
      </div>
    </div>
  );
}

function generateCpxHash(userId: string): string {
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