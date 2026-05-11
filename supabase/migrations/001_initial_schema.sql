-- 001_initial_schema.sql
-- Core Xpay database schema

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    country TEXT DEFAULT 'Kenya',
    avatar_url TEXT,
    tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'elite')),
    points_balance INTEGER DEFAULT 0,
    ksh_balance INTEGER DEFAULT 0,
    usd_balance DECIMAL(10,2) DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    approval_rate DECIMAL(5,2) DEFAULT 100.00,
    registration_paid BOOLEAN DEFAULT FALSE,
    has_marketplace_purchase BOOLEAN DEFAULT FALSE,
    kyc_verified BOOLEAN DEFAULT FALSE,
    kyc_document_url TEXT,
    test_passed BOOLEAN DEFAULT FALSE,
    test_attempts INTEGER DEFAULT 0,
    last_test_date TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    ban_reason TEXT,
    quality_strikes INTEGER DEFAULT 0,
    last_withdrawal_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('survey', 'ai_training', 'micro_task', 'data_entry')),
    provider_payout INTEGER NOT NULL,
    user_points_calculated INTEGER NOT NULL,
    xpay_commission INTEGER NOT NULL,
    estimated_minutes INTEGER,
    disqualification_rate INTEGER DEFAULT 75,
    tier_required TEXT DEFAULT 'free' CHECK (tier_required IN ('free', 'pro', 'elite')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    max_completions INTEGER DEFAULT 50,
    current_completions INTEGER DEFAULT 0,
    instructions TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Task submissions
CREATE TABLE task_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    answers_data JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
    points_awarded INTEGER DEFAULT 0,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    rejection_reason TEXT,
    submitted_at TIMESTAMP DEFAULT NOW()
);

-- Daily limits tracking
CREATE TABLE daily_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    tasks_completed_today INTEGER DEFAULT 0,
    max_tasks INTEGER DEFAULT 1,
    reset_at TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Transactions ledger
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('task_earn', 'marketplace_spend', 'withdrawal', 'deposit', 'subscription', 'referral_bonus', 'streak_bonus', 'advance_fee', 'registration_fee')),
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'points' CHECK (currency IN ('points', 'ksh', 'usd')),
    description TEXT,
    xpay_revenue INTEGER DEFAULT 0,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Marketplace items
CREATE TABLE marketplace_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price_ksh INTEGER NOT NULL,
    price_usd DECIMAL(10,2),
    type TEXT NOT NULL CHECK (type IN ('job_link', 'resume_review', 'course', 'tool')),
    content TEXT,
    tier_required TEXT DEFAULT 'free' CHECK (tier_required IN ('free', 'pro', 'elite')),
    is_active BOOLEAN DEFAULT TRUE,
    sales_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 5.00,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES marketplace_items(id),
    buyer_id UUID REFERENCES users(id),
    amount_paid INTEGER NOT NULL,
    currency TEXT DEFAULT 'ksh',
    status TEXT DEFAULT 'paid' CHECK (status IN ('paid', 'delivered', 'refunded')),
    delivered_content TEXT,
    purchased_at TIMESTAMP DEFAULT NOW()
);

-- Withdrawal requests
CREATE TABLE withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'ksh' CHECK (currency IN ('ksh', 'usd')),
    fee_amount INTEGER NOT NULL,
    net_amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending_fee' CHECK (status IN ('pending_fee', 'fee_paid', 'processing', 'completed', 'cancelled', 'failed')),
    fee_payment_provider TEXT,
    fee_payment_transaction_id TEXT,
    fee_paid_at TIMESTAMP,
    payout_provider TEXT,
    payout_transaction_id TEXT,
    payout_recipient TEXT,
    payout_sent_at TIMESTAMP,
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Advance requests
CREATE TABLE advance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    amount INTEGER NOT NULL,
    fee_amount INTEGER NOT NULL,
    total_repayment INTEGER NOT NULL,
    due_date DATE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'disbursed', 'repaying', 'repaid', 'defaulted')),
    repaid_amount INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    disbursed_at TIMESTAMP,
    repaid_at TIMESTAMP
);

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    tier TEXT NOT NULL CHECK (tier IN ('pro', 'elite')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'expired')),
    stripe_subscription_id TEXT,
    started_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    auto_renew BOOLEAN DEFAULT TRUE
);

-- Referrals
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES users(id),
    referred_id UUID REFERENCES users(id),
    bonus_points INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Registration payments
CREATE TABLE registration_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    amount INTEGER DEFAULT 100,
    currency TEXT DEFAULT 'ksh',
    provider TEXT NOT NULL CHECK (provider IN ('mpesa', 'paypal', 'stripe')),
    transaction_id TEXT,
    status TEXT DEFAULT 'completed',
    paid_at TIMESTAMP DEFAULT NOW()
);

-- Activity log
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Intelligence test results
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    cheat_detected BOOLEAN DEFAULT FALSE,
    tab_switches INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    answers JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed', 'cheating_detected')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_tier ON tasks(tier_required);
CREATE INDEX idx_submissions_user ON task_submissions(user_id);
CREATE INDEX idx_submissions_status ON task_submissions(status);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_withdrawals_user ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawal_requests(status);
CREATE INDEX idx_test_results_user ON test_results(user_id);

-- RLS Policies (basic)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Function to update streak
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users 
    SET streak_days = streak_days + 1,
        longest_streak = GREATEST(longest_streak, streak_days + 1)
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to reset streak on missed day (called by cron job)
CREATE OR REPLACE FUNCTION reset_missed_streaks()
RETURNS void AS $$
BEGIN
    UPDATE users 
    SET streak_days = 0
    WHERE id NOT IN (
        SELECT DISTINCT user_id FROM activity_log 
        WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'
    ) AND streak_days > 0;
END;
$$ LANGUAGE plpgsql;
