// Sign-up page at route: /auth/sign-up
// Client component - registers a new user via the API client.
"use client"
import React, { useState } from 'react'
import { signup } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function SignUpPageAuthRoute() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // client-side validation
    if (password !== rePassword) {
      setError('Passwords do not match')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await signup({ name, email, password })
      alert('Registered successfully. Please sign in.')
      router.push('/auth/sign-in')
    } catch (err: any) {
      alert(err?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} className="border p-2" />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="border p-2" />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2" />
        <input placeholder="Confirm password" type="password" value={rePassword} onChange={e=>setRePassword(e.target.value)} className="border p-2" />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button disabled={loading} className="bg-black text-white px-4 py-2 mt-2">{loading? 'Registering...' : 'Register'}</button>
      </form>
    </div>
  )
}
