import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const password = formData.get('password') as string;
    const payout = formData.get('payout') as string;
    const offerId = formData.get('offer_id') as string;
    const trackingId = formData.get('tracking_id') as string;
    
    // Verify password
    if (password !== 'xpay_secret_2026') {
      return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
    }
    
    if (!trackingId || !payout) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }
    
    const userId = trackingId;
    const rewardAmount = parseFloat(payout);
    
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
      description: `CPAGrip offer #${offerId} completed`,
      status: 'completed',
    });
    
    // Record in user_tasks
    await supabase.from('user_tasks').insert({
      user_id: userId,
      task_id: `cpagrip_${offerId}`,
      status: 'completed',
      reward_paid: true,
    });
    
    return NextResponse.json({ success: true, message: 'Reward credited' });
    
  } catch (error: any) {
    console.error('Postback error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}