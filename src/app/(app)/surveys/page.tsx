'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SurveysPage() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
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

    // Get user profile for name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
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

  // Generate secure hash: md5(userId + '-' + secure_hash)
  const secureHash = generateHash(userId);

  const iframeUrl = `https://offers.cpx-research.com/index.php?app_id=33004&ext_user_id=${encodeURIComponent(userId)}&secure_hash=${secureHash}&username=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}&subid_1=&subid_2`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 bg-white border-b">
        <h1 className="text-xl font-bold">Paid Surveys</h1>
        <p className="text-sm text-gray-500">Complete surveys and earn real money</p>
      </div>
      
      <iframe 
        width="100%" 
        frameBorder="0" 
        height="2000px" 
        src={iframeUrl}
        className="w-full"
      />
    </div>
  );
}

function generateHash(userId: string): string {
  // Simple hash generation - in production use crypto library
  const secureHash = 'h4iGGazI93ILiS3oHdAB8RyT6pJMz4e3';
  const hashInput = `${userId}-${secureHash}`;
  
  // For client-side, we'll use a basic approach
  // In production, this should be generated server-side
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(16);
}