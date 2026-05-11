'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password',
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Password reset email sent.')
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md rounded-lg border p-6 shadow"
      >
        <h1 className="mb-4 text-2xl font-bold">Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="mb-4 w-full rounded border p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full rounded bg-black p-3 text-white"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm">
            {message}
          </p>
        )}
      </form>
    </div>
  )
}