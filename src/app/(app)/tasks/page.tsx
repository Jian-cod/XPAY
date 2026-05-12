'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Lock, Crown, Star } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  reward: number
  category: string
  provider: string
  external_url: string
  proof_required: boolean
  is_premium: boolean
}

interface UserTask {
  task_id: string
}

interface TierLimit {
  tier: string
  daily_tasks: number
  task_multiplier: number
  max_reward: number
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string>('')
  const [userTier, setUserTier] = useState('free')
  const [tierLimit, setTierLimit] = useState<TierLimit | null>(null)
  const [tasksToday, setTasksToday] = useState(0)

  const router = useRouter()

  useEffect(() => {
    fetchUserData()
    fetchCompletedTasks()
  }, [])

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setLoading(false)
      return
    }
    
    setUserId(user.id)

    // Get user tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', user.id)
      .single()

    const tier = profile?.tier || 'free'
    setUserTier(tier)

    // Get tier limits
    const { data: tierData } = await supabase
      .from('tier_limits')
      .select('*')
      .eq('tier', tier)
      .single()

    setTierLimit(tierData)

    // Get today's task count
    const today = new Date().toISOString().split('T')[0]
    const { data: dailyCount } = await supabase
      .from('daily_task_counts')
      .select('task_count')
      .eq('user_id', user.id)
      .eq('task_date', today)
      .single()

    setTasksToday(dailyCount?.task_count || 0)

    // Fetch tasks
    await fetchTasks(tierData?.max_reward || 50)
  }

  const fetchTasks = async (maxReward: number) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'active')
      .order('reward', { ascending: false })

    if (error) {
      console.error(error.message)
    } else {
      // Mark tasks as premium if above tier limit
      const processedTasks = (data || []).map(task => ({
        ...task,
        is_premium: task.reward > maxReward
      }))
      setTasks(processedTasks)
    }

    setLoading(false)
  }

  const fetchCompletedTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('user_tasks')
      .select('task_id')
      .eq('user_id', user.id)

    if (!error && data) {
      setCompletedTasks(data.map((item: UserTask) => item.task_id))
    }
  }

  const completeTask = async (task: Task) => {
    if (task.is_premium && userTier === 'free') {
      return // Shouldn't happen due to UI, but safety check
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    if (completedTasks.includes(task.id)) {
      alert('Task already completed.')
      return
    }

    // Check daily limit
    const today = new Date().toISOString().split('T')[0]
    const { data: dailyCount } = await supabase
      .from('daily_task_counts')
      .select('task_count')
      .eq('user_id', user.id)
      .eq('task_date', today)
      .single()

    const currentCount = dailyCount?.task_count || 0
    const maxTasks = tierLimit?.daily_tasks || 3

    if (currentCount >= maxTasks) {
      alert('Daily task limit reached. Upgrade your tier!')
      return
    }

    const { error: taskError } = await supabase
      .from('user_tasks')
      .insert([
        {
          user_id: user.id,
          task_id: task.id,
          status: 'completed',
          reward_paid: true,
        },
      ])

    if (taskError) {
      alert(taskError.message)
      return
    }

    // Update daily count
    if (dailyCount) {
      await supabase
        .from('daily_task_counts')
        .update({ task_count: currentCount + 1 })
        .eq('user_id', user.id)
        .eq('task_date', today)
    } else {
      await supabase
        .from('daily_task_counts')
        .insert({ user_id: user.id, task_date: today, task_count: 1 })
    }

    // Calculate reward with multiplier
    const multiplier = tierLimit?.task_multiplier || 1
    const finalReward = task.reward * multiplier

    // Update balance
    const { data: profile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    const currentBalance = Number(profile?.balance || 0)
    const newBalance = currentBalance + finalReward

    await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', user.id)

    // Record transaction
    await supabase.from('transactions').insert([
      {
        user_id: user.id,
        type: 'task_reward',
        amount: finalReward,
        description: `Reward from ${task.title} (${userTier} tier, ${multiplier}x)`,
        status: 'completed',
      },
    ])

    alert(`Task completed. KES ${finalReward} added to wallet.`)

    setCompletedTasks((prev) => [...prev, task.id])
    setTasksToday(prev => prev + 1)
  }

  const getTierBadge = () => {
    switch(userTier) {
      case 'pro': return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold flex items-center gap-1"><Crown className="w-4 h-4"/> PRO</span>
      case 'elite': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold flex items-center gap-1"><Star className="w-4 h-4"/> ELITE</span>
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-bold">FREE</span>
    }
  }

  if (loading) {
    return <div className="p-6">Loading tasks...</div>
  }

  const tasksRemaining = (tierLimit?.daily_tasks || 3) - tasksToday
  const freeTasks = tasks.filter(t => !t.is_premium)
  const premiumTasks = tasks.filter(t => t.is_premium)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Available Tasks</h1>
        {getTierBadge()}
      </div>

      {/* Daily Limit Banner */}
      <div className="mb-6 p-4 bg-white rounded-xl border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Daily Tasks</p>
            <p className="text-xl font-bold">
              {tasksToday} / {tierLimit?.daily_tasks === 999 ? '∞' : tierLimit?.daily_tasks}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Remaining</p>
            <p className={`text-xl font-bold ${tasksRemaining <= 0 ? 'text-red-500' : 'text-green-600'}`}>
              {tasksRemaining <= 0 ? 0 : tasksRemaining}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Max Reward</p>
            <p className="text-xl font-bold">KES {tierLimit?.max_reward || 50}</p>
          </div>
        </div>
        
        {tasksRemaining <= 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              Daily limit reached! <Link href="/pricing" className="underline">Upgrade your tier</Link> for more tasks.
            </p>
          </div>
        )}
      </div>

      {/* Free Tasks Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          Available Tasks 
          <span className="text-sm font-normal text-gray-500">(KES {tierLimit?.max_reward || 50} and below)</span>
        </h2>

        {freeTasks.length === 0 ? (
          <p className="text-gray-500 p-4 bg-gray-50 rounded-xl">No tasks available right now.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {freeTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                completed={completedTasks.includes(task.id)}
                onComplete={() => completeTask(task)}
                disabled={tasksRemaining <= 0}
              />
            ))}
          </div>
        )}
      </div>

      {/* Premium Tasks Section - Locked for Free Users */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-500"/>
            Premium Tasks
            <span className="text-sm font-normal text-gray-500">(KES {(tierLimit?.max_reward || 50) + 1} and above)</span>
          </h2>
          
          {userTier === 'free' && (
            <Link 
              href="/pricing"
              className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition"
            >
              Unlock →
            </Link>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {premiumTasks.map((task) => (
            <div 
              key={task.id} 
              className={`rounded-xl border p-5 shadow-sm relative ${
                userTier === 'free' ? 'opacity-60 grayscale' : ''
              }`}
            >
              {userTier === 'free' && (
                <div className="absolute inset-0 bg-gray-900/10 rounded-xl flex items-center justify-center z-10">
                  <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                    <Lock className="w-8 h-8 text-amber-500 mx-auto mb-2"/>
                    <p className="font-bold text-gray-900">Premium Task</p>
                    <p className="text-sm text-gray-500 mb-3">Upgrade to Elite or Pro</p>
                    <Link 
                      href="/pricing"
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition"
                    >
                      Upgrade
                    </Link>
                  </div>
                </div>
              )}

              <h3 className="text-xl font-semibold">{task.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{task.description}</p>

              <div className="mt-4 space-y-1 text-sm">
                <p className="text-lg">
                  Reward: <strong className="text-green-600">KES {task.reward}</strong>
                  {userTier !== 'free' && (
                    <span className="text-purple-600 ml-2">
                      (KES {Math.round(task.reward * (tierLimit?.task_multiplier || 1))} with {tierLimit?.task_multiplier}x)
                    </span>
                  )}
                </p>
                <p>Category: {task.category}</p>
                <p>Provider: {task.provider}</p>
              </div>

              {userTier !== 'free' && (
                <button
                  onClick={() => completeTask(task)}
                  disabled={completedTasks.includes(task.id) || tasksRemaining <= 0}
                  className="mt-4 w-full rounded-lg bg-black px-4 py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {completedTasks.includes(task.id) ? 'Completed' : tasksRemaining <= 0 ? 'Daily Limit Reached' : 'Complete Task'}
                </button>
              )}
            </div>
          ))}
        </div>

        {premiumTasks.length === 0 && (
          <p className="text-gray-500 p-4 bg-gray-50 rounded-xl">No premium tasks available right now.</p>
        )}
      </div>

      {/* Surveys Banner */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Want More Earnings?</h2>
        <p className="mb-4">Paid surveys available! Complete them and earn guaranteed rewards.</p>
        <Link 
          href="/surveys"
          className="inline-block px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition"
        >
          Go to Surveys →
        </Link>
      </div>
    </div>
  )
}

function TaskCard({ task, completed, onComplete, disabled }: { 
  task: Task; 
  completed: boolean; 
  onComplete: () => void;
  disabled: boolean;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="text-xl font-semibold">{task.title}</h3>
      <p className="mt-2 text-sm text-gray-600">{task.description}</p>

      <div className="mt-4 space-y-1 text-sm">
        <p className="text-lg">
          Reward: <strong className="text-green-600">KES {task.reward}</strong>
        </p>
        <p>Category: {task.category}</p>
        <p>Provider: {task.provider}</p>
      </div>

      <div className="mt-5 space-y-3">
        <button
          onClick={() => window.open(task.external_url, '_blank')}
          className="w-full rounded-lg border px-4 py-3 transition hover:bg-gray-100"
        >
          Open Task
        </button>

        <button
          onClick={onComplete}
          disabled={completed || disabled}
          className="w-full rounded-lg bg-black px-4 py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {completed ? 'Completed' : disabled ? 'Daily Limit Reached' : 'Complete Task'}
        </button>
      </div>
    </div>
  )
}