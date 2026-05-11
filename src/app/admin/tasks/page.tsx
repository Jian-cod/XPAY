'use client'

import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'
import AdminGuard from '@/components/AdminGuard'

interface Task {
  id: string
  title: string
  description: string
  reward: number
  category: string
  provider: string
  status: string
  external_url: string
}

function AdminTasksContent() {
  const [tasks, setTasks] = useState<Task[]>([])

  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [description, setDescription] =
    useState('')

  const [reward, setReward] = useState('')

  const [category, setCategory] =
    useState('General')

  const [provider, setProvider] =
    useState('XPAY')

  const [externalUrl, setExternalUrl] =
    useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

    if (error) {
      console.error(error.message)
    } else {
      setTasks(data || [])
    }

    setLoading(false)
  }

  const createTask = async () => {
    if (
      !title ||
      !description ||
      !reward
    ) {
      alert('Fill all required fields.')
      return
    }

    const { error } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          description,
          reward: Number(reward),
          category,
          provider,
          external_url: externalUrl,
          status: 'active',
        },
      ])

    if (error) {
      alert(error.message)
      return
    }

    alert('Task created successfully.')

    setTitle('')
    setDescription('')
    setReward('')
    setCategory('General')
    setProvider('XPAY')
    setExternalUrl('')

    fetchTasks()
  }

  const toggleTaskStatus = async (
    task: Task
  ) => {
    const newStatus =
      task.status === 'active'
        ? 'inactive'
        : 'active'

    const { error } = await supabase
      .from('tasks')
      .update({
        status: newStatus,
      })
      .eq('id', task.id)

    if (error) {
      alert(error.message)
    } else {
      fetchTasks()
    }
  }

  const deleteTask = async (
    taskId: string
  ) => {
    const confirmed = confirm(
      'Delete this task?'
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      alert(error.message)
    } else {
      fetchTasks()
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading tasks...
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          Manage Tasks
        </h1>

        <p className="mt-2 text-gray-500">
          Create and manage XPAY tasks.
        </p>
      </div>

      {/* CREATE TASK */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-bold">
          Create Task
        </h2>

        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="rounded-lg border p-3"
          />

          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="rounded-lg border p-3"
          />

          <input
            type="number"
            placeholder="Reward Amount"
            value={reward}
            onChange={(e) =>
              setReward(e.target.value)
            }
            className="rounded-lg border p-3"
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="rounded-lg border p-3"
          />

          <input
            type="text"
            placeholder="Provider"
            value={provider}
            onChange={(e) =>
              setProvider(e.target.value)
            }
            className="rounded-lg border p-3"
          />

          <input
            type="text"
            placeholder="External URL"
            value={externalUrl}
            onChange={(e) =>
              setExternalUrl(
                e.target.value
              )
            }
            className="rounded-lg border p-3"
          />

          <button
            onClick={createTask}
            className="rounded-lg bg-black px-6 py-3 text-white"
          >
            Create Task
          </button>
        </div>
      </div>

      {/* TASK LIST */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-bold">
          Existing Tasks
        </h2>

        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {task.title}
                    </h3>

                    <p className="mt-1 text-gray-600">
                      {task.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                      <span>
                        Reward: KES{' '}
                        {task.reward}
                      </span>

                      <span>
                        Category:{' '}
                        {task.category}
                      </span>

                      <span>
                        Provider:{' '}
                        {task.provider}
                      </span>

                      <span>
                        Status:{' '}
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        toggleTaskStatus(
                          task
                        )
                      }
                      className="rounded-lg bg-amber-500 px-4 py-2 text-white"
                    >
                      {task.status ===
                      'active'
                        ? 'Deactivate'
                        : 'Activate'}
                    </button>

                    <button
                      onClick={() =>
                        deleteTask(task.id)
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminTasksPage() {
  return (
    <AdminGuard>
      <AdminTasksContent />
    </AdminGuard>
  )
}