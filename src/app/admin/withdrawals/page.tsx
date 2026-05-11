'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminGuard from '@/components/AdminGuard'

interface Withdrawal {
  id: string
  user_id: string
  amount: number
  mpesa_number: string
  status: string
  created_at: string
}

function WithdrawalsContent() {
  const [withdrawals, setWithdrawals] =
    useState<Withdrawal[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const fetchWithdrawals = async () => {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

    if (error) {
      console.error(error.message)
    } else {
      setWithdrawals(data || [])
    }

    setLoading(false)
  }

  const approveWithdrawal = async (
    withdrawal: Withdrawal
  ) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', withdrawal.user_id)
      .single()

    const currentBalance = Number(
      profile?.balance || 0
    )

    if (currentBalance < withdrawal.amount) {
      alert('User balance insufficient.')
      return
    }

    const newBalance =
      currentBalance - withdrawal.amount

    const { error: balanceError } = await supabase
      .from('profiles')
      .update({
        balance: newBalance,
      })
      .eq('id', withdrawal.user_id)

    if (balanceError) {
      alert(balanceError.message)
      return
    }

    const { error: withdrawalError } =
      await supabase
        .from('withdrawals')
        .update({
          status: 'approved',
        })
        .eq('id', withdrawal.id)

    if (withdrawalError) {
      alert(withdrawalError.message)
      return
    }

    await supabase
      .from('transactions')
      .insert([
        {
          user_id: withdrawal.user_id,
          type: 'withdrawal',
          amount: -withdrawal.amount,
          description: 'Withdrawal approved',
          status: 'completed',
        },
      ])

    alert('Withdrawal approved.')

    fetchWithdrawals()
  }

  const rejectWithdrawal = async (
    withdrawalId: string
  ) => {
    const { error } = await supabase
      .from('withdrawals')
      .update({
        status: 'rejected',
      })
      .eq('id', withdrawalId)

    if (error) {
      alert(error.message)
    } else {
      alert('Withdrawal rejected.')
      fetchWithdrawals()
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading withdrawals...
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="mb-8 text-3xl font-bold">
        Withdrawal Requests
      </h1>

      {withdrawals.length === 0 ? (
        <p>No withdrawal requests found.</p>
      ) : (
        <div className="space-y-6">
          {withdrawals.map((withdrawal) => (
            <div
              key={withdrawal.id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="space-y-2">
                <p>
                  <strong>User ID:</strong>{' '}
                  {withdrawal.user_id}
                </p>

                <p>
                  <strong>Amount:</strong> KES{' '}
                  {withdrawal.amount}
                </p>

                <p>
                  <strong>M-Pesa:</strong>{' '}
                  {withdrawal.mpesa_number}
                </p>

                <p>
                  <strong>Status:</strong>{' '}
                  {withdrawal.status}
                </p>

                <p>
                  <strong>Requested:</strong>{' '}
                  {new Date(
                    withdrawal.created_at
                  ).toLocaleString()}
                </p>
              </div>

              {withdrawal.status ===
                'pending' && (
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() =>
                      approveWithdrawal(
                        withdrawal
                      )
                    }
                    className="rounded-lg bg-green-600 px-5 py-3 text-white"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      rejectWithdrawal(
                        withdrawal.id
                      )
                    }
                    className="rounded-lg bg-red-600 px-5 py-3 text-white"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminWithdrawalsPage() {
  return (
    <AdminGuard>
      <WithdrawalsContent />
    </AdminGuard>
  )
}