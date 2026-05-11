export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  country: string;
  tier: "free" | "pro" | "elite";
  points_balance: number;
  ksh_balance: number;
  usd_balance: number;
  streak_days: number;
  longest_streak: number;
  tasks_completed: number;
  approval_rate: number;
  registration_paid: boolean;
  has_marketplace_purchase: boolean;
  kyc_verified: boolean;
  test_passed: boolean;
  is_admin: boolean;
  is_banned: boolean;
  quality_strikes: number;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: "survey" | "ai_training" | "micro_task" | "data_entry";
  provider_payout: number;
  user_points_calculated: number;
  xpay_commission: number;
  estimated_minutes: number;
  disqualification_rate: number;
  tier_required: "free" | "pro" | "elite";
  status: "active" | "paused" | "archived";
  max_completions: number;
  current_completions: number;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  currency: "ksh" | "usd";
  fee_amount: number;
  net_amount: number;
  status: "pending_fee" | "fee_paid" | "processing" | "completed" | "cancelled" | "failed";
  created_at: string;
}

export interface TestResult {
  id: string;
  user_id: string;
  score: number;
  total_questions: number;
  passed: boolean;
  cheat_detected: boolean;
  tab_switches: number;
  time_spent_seconds: number;
  status: string;
  created_at: string;
}
