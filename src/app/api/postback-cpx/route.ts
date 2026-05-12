import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const transId = searchParams.get('trans_id');
    const userId = searchParams.get('user_id');
    const amountLocal = searchParams.get('amount_local');
    const amountUsd = searchParams.get('amount_usd');
    const offerId = searchParams.get('offer_id');
    
    // CPX Research sends status=1 for complete, status=2 for canceled
    if (status !== '1') {
      // Status 2 = reversed/canceled, don't credit
      return NextResponse.json({ success: true, message: 'Transaction not completed, no credit' });
    }
    
    if (!userId || !amountLocal) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }
    
    const rewardAmount = parseFloat(amountLocal);
    
    if (isNaN(rewardAmount) || rewardAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
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
      description: `CPX Research survey #${offerId || transId} completed`,
      status: 'completed',
    });
    
    // Record in user_tasks
    await supabase.from('user_tasks').insert({
      user_id: userId,
      task_id: `cpx_${offerId || transId}`,
      status: 'completed',
      reward_paid: true,
    });
    
    return NextResponse.json({ success: true, message: 'Reward credited', amount: rewardAmount });
    
  } catch (error: any) {
    console.error('CPX postback error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}