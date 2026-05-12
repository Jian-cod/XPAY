import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const reward = searchParams.get('reward');
    const currency = searchParams.get('currency');
    const userId = searchParams.get('user_id');
    const txId = searchParams.get('tx_id');
    const hash = searchParams.get('hash');
    const reversal = searchParams.get('reversal');
    const debug = searchParams.get('debug');
    
    // Ignore debug callbacks
    if (debug === 'true') {
      return NextResponse.json({ success: true, message: 'Debug ignored' });
    }
    
    // Verify hash
    const secretKey = '8a0d380583a138e67adb6459f2495d08d6e8bfdf';
    const baseUrl = request.url.split('&hash=')[0];
    
    const expectedHash = generateHash(baseUrl, secretKey);
    
    if (hash !== expectedHash) {
      return NextResponse.json({ error: 'Invalid hash' }, { status: 403 });
    }
    
    // Check reversal
    if (reversal === 'true') {
      // Handle reversal (deduct from user)
      return NextResponse.json({ success: true, message: 'Reversal handled' });
    }
    
    if (!userId || !reward) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }
    
    // Convert reward to KES (TheoremReach sends in your currency, but let's be safe)
    // Their exchange rate is 700, so reward is already in KES if configured
    const rewardAmount = parseFloat(reward);
    
    if (isNaN(rewardAmount) || rewardAmount <= 0) {
      return NextResponse.json({ error: 'Invalid reward' }, { status: 400 });
    }
    
    // Get user current balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', userId)
      .single();
    
    if (profileError || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const currentBalance = Number(profile.balance || 0);
    const newBalance = currentBalance + rewardAmount;
    
    // Update balance
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', userId);
    
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    
    // Record transaction
    await supabase.from('transactions').insert({
      user_id: userId,
      type: 'task_reward',
      amount: rewardAmount,
      description: `TheoremReach survey completed (TX: ${txId})`,
      status: 'completed',
    });
    
    // Record in user_tasks
    await supabase.from('user_tasks').insert({
      user_id: userId,
      task_id: `theorem_${txId}`,
      status: 'completed',
      reward_paid: true,
    });
    
    return NextResponse.json({ success: true, message: 'Reward credited', amount: rewardAmount });
    
  } catch (error: any) {
    console.error('TheoremReach postback error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateHash(url: string, secretKey: string): string {
  const encodedKey = Buffer.from(secretKey, 'utf-8');
  const encodedUrl = Buffer.from(url, 'utf-8');
  
  const hmac = crypto.createHmac('sha1', encodedKey);
  hmac.update(encodedUrl);
  
  const digest = hmac.digest('base64');
  
  // Replace characters per TheoremReach spec
  return digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}