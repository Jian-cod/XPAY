'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Task {
  id: string
  title: string
  description: string
  reward: number
  category: string
  type: string
  provider: string
  external_url: string
  proof_required: boolean
}

interface UserTask {
  task_id: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    fetchTasks()
    fetchCompletedTasks()
  }, [])

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'active')

    if (error) {
      console.error(error.message)
    } else {
      setTasks(data || [])
    }

    setLoading(false)
  }

  const fetchCompletedTasks = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('user_tasks')
      .select('task_id')
      .eq('user_id', user.id)

    if (error) {
      console.error(error.message)
      return
    }

    if (data) {
      setCompletedTasks(
        data.map((item: UserTask) => item.task_id)
      )
    }
  }

  const completeTask = async (task: Task) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    if (completedTasks.includes(task.id)) {
      alert('Task already completed.')
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    const currentBalance =
      Number(profile?.balance || 0)

    const newBalance =
      currentBalance + Number(task.reward)

    const { error: balanceError } = await supabase
      .from('profiles')
      .update({
        balance: newBalance,
      })
      .eq('id', user.id)

    if (balanceError) {
      alert(balanceError.message)
      return
    }

    const { error: transactionError } =
      await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            type: 'task_reward',
            amount: task.reward,
            description: `Reward from ${task.title}`,
            status: 'completed',
          },
        ])

    if (transactionError) {
      console.error(transactionError.message)
    }

    alert(
      `Task completed. KES ${task.reward} added to wallet.`
    )

    setCompletedTasks((prev) => [
      ...prev,
      task.id,
    ])
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading tasks...
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Available Tasks
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold">
              {task.title}
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {task.description}
            </p>

            <div className="mt-4 space-y-1 text-sm">
              <p>
                Reward:{' '}
                <strong>
                  KES {task.reward}
                </strong>
              </p>

              <p>
                Category: {task.category}
              </p>

              <p>
                Provider: {task.provider}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <button
                onClick={() =>
                  window.open(
                    task.external_url,
                    '_blank'
                  )
                }
                className="w-full rounded-lg border px-4 py-3 transition hover:bg-gray-100"
              >
                Open Task
              </button>

              <button
                onClick={() =>
                  completeTask(task)
                }
                disabled={completedTasks.includes(task.id)}
                className="w-full rounded-lg bg-black px-4 py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {completedTasks.includes(task.id)
                  ? 'Completed'
                  : 'Complete Task'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}