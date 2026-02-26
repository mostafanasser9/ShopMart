// Sign-in page at route: /auth/sign-in
// This is a client component that calls the API client to authenticate users.
"use client"
import React, { useState } from 'react'
import { signin } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function SignInPageAuthRoute() {
  // Local form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Submit handler calls the API and stores token in localStorage
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res: any = await signin({ email, password })
      const token = res?.token || res?.data?.token || res?.accessToken
      if (token) localStorage.setItem('token', token)
      // try to store returned user id for later API calls
      const userId = res?.data?.user?._id || res?.data?._id || res?.user?._id || res?.id
      if (userId) localStorage.setItem('userId', userId)
      alert('Signed in successfully')
      router.push('/')
    } catch (err: any) {
      alert(err?.message || 'Sign in failed')
    } finally { setLoading(false) }
  }

  // Simple form UI
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4">Sign in</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="border p-2" />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2" />
        <div className="flex justify-between items-center">
          <button disabled={loading} className="bg-black text-white px-4 py-2 mt-2">{loading? 'Signing...' : 'Sign in'}</button>
          <a href="/auth/forgot-password" className="text-sm text-blue-600">Forgot?</a>
        </div>
      </form>
    </div>
  )
}
