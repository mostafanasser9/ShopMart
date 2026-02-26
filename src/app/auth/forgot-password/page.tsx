// Forgot password flow at route: /auth/forgot-password
// Client component with three steps: request code, verify code, reset password.
"use client"
import React, { useState } from 'react'
import { forgotPassword, verifyResetCode, resetPassword } from '@/lib/api'

export default function ForgotPasswordAuthRoute() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email'|'code'|'reset'>('email')
  const [resetCode, setResetCode] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPassword({ email })
      alert('Reset code sent (if email exists).')
      setStep('code')
    } catch (err: any) {
      alert(err?.message || 'Failed to send reset code')
    } finally { setLoading(false) }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await verifyResetCode({ resetCode })
      alert('Code verified. Set a new password.')
      setStep('reset')
    } catch (err: any) {
      alert(err?.message || 'Invalid code')
    } finally { setLoading(false) }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPassword({ email, resetCode, password })
      alert('Password reset successful. You can sign in now.')
      setStep('email')
    } catch (err: any) {
      alert(err?.message || 'Failed to reset password')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      {step === 'email' && (
        <form onSubmit={sendEmail} className="flex flex-col gap-3">
          <h2 className="text-xl">Forgot password</h2>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="border p-2" />
          <button disabled={loading} className="bg-black text-white py-2">{loading? 'Sending...' : 'Send reset code'}</button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={handleVerify} className="flex flex-col gap-3">
          <h2 className="text-xl">Enter reset code</h2>
          <input placeholder="Reset code" value={resetCode} onChange={e=>setResetCode(e.target.value)} className="border p-2" />
          <button disabled={loading} className="bg-black text-white py-2">Verify code</button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleReset} className="flex flex-col gap-3">
          <h2 className="text-xl">Set new password</h2>
          <input placeholder="New password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2" />
          <button disabled={loading} className="bg-black text-white py-2">Reset password</button>
        </form>
      )}
    </div>
  )
}
