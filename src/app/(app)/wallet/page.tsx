'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  status: string
  created_at: string
}

export default function WalletPage() {
  const [balance, setBalance] = useState<number>(0)

  const [transactions, setTransactions] = useState<
    Transaction[]
  >([])

  const [loading, setLoading] = useState(true)

  const [withdrawAmount, setWithdrawAmount] =
    useState('')

  const [mpesaNumber, setMpesaNumber] =
    useState('')

  useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    setBalance(Number(profile?.balance || 0))

    const { data: transactionData } =
      await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', {
          ascending: false,
        })

    setTransactions(transactionData || [])

    setLoading(false)
  }

  const requestWithdrawal = async () => {
    const amount = Number(withdrawAmount)

    if (!mpesaNumber) {
      alert('Enter M-Pesa number.')
      return
    }

    if (amount <= 0) {
      alert('Invalid amount.')
      return
    }

    if (amount > balance) {
      alert('Insufficient balance.')
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
      .from('withdrawals')
      .insert([
        {
          user_id: user.id,
          amount,
          mpesa_number: mpesaNumber,
          status: 'pending',
        },
      ])

    if (error) {
      alert(error.message)
      return
    }

    alert(
      'Withdrawal request submitted successfully.'
    )

    setWithdrawAmount('')
    setMpesaNumber('')
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading wallet...
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">
            My Wallet
          </h1>

          <div className="mt-8">
            <p className="text-sm text-gray-500">
              Available Balance
            </p>

            <h2 className="mt-2 text-5xl font-bold">
              KES {balance}
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            <h2 className="text-2xl font-bold">
              Withdraw Funds
            </h2>

            <input
              type="text"
              placeholder="M-Pesa Number"
              value={mpesaNumber}
              onChange={(e) =>
                setMpesaNumber(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />

            <input
              type="number"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) =>
                setWithdrawAmount(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />

            <button
              onClick={requestWithdrawal}
              className="w-full rounded-lg bg-black px-6 py-3 text-white"
            >
              Request Withdrawal
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            Transaction History
          </h2>

          {transactions.length === 0 ? (
            <p className="mt-4 text-gray-500">
              No transactions yet.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div>
                    <p className="font-semibold">
                      {transaction.description}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(
                        transaction.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">
                      KES {transaction.amount}
                    </p>

                    <p className="text-sm text-gray-500 capitalize">
                      {transaction.type.replace(
                        '_',
                        ' '
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}