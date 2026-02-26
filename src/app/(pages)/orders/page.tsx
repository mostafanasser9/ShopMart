// Orders listing page at route: /orders
"use client"
import React, { useEffect, useState } from 'react'
import { getUserOrders } from '@/lib/api'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || undefined : undefined

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getUserOrders(token)
      .then((res: any) => { if (!mounted) return; setOrders(res?.data || res?.orders || []) })
      .catch(() => { if (!mounted) return; setOrders([]) })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [token])

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found. Place an order first.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o: any) => (
            <div key={o._id || o.id} className="border rounded p-4">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">Order #{o._id || o.id}</div>
                  <div className="text-sm text-gray-600">Status: {o.status || o.orderStatus || 'unknown'}</div>
                </div>
                <div className="font-semibold">EGP {o.total || o.amount || 0}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
