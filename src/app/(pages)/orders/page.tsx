// Orders listing page at route: /orders
"use client"
import React, { useEffect, useState } from 'react'
import { getUserOrders } from '@/lib/api'

function fmtDate(d: string | number | undefined) {
  if (!d) return '—'
  try {
    const dt = new Date(d)
    return dt.toLocaleString()
  } catch (e) {
    return String(d)
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || undefined : undefined

  useEffect(() => {
    let mounted = true
    getUserOrders(token)
      .then((res: any) => { if (!mounted) return; const list = res?.data || res?.orders || res || []; setOrders(Array.isArray(list) ? list : []) })
      .catch(() => { if (!mounted) return; setOrders([]) })
    return () => { mounted = false }
  }, [token])

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 uppercase tracking-wide">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 p-6">No orders found. Place an order first.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((o: any) => {
            const id = o._id || o.id || o.orderId || 'unknown'
            const orderNum = id
            const created = o.createdAt || o.createdAtDate || o.date || o.orderDate
            const updated = o.updatedAt || o.updated || o.lastUpdated
            const total = getTotalFromOrder(o)
            const paymentMethod = o.paymentMethod || o.payment || (o.isPaid ? 'card' : 'unknown')
            const paid = o.isPaid || o.paid || o.paymentStatus === 'paid' || false
            const delivered = o.isDelivered || o.delivered || o.deliveryStatus === 'delivered' || false
            const shipping = o.shippingAddress || o.address || {}
            const phone = shipping?.phone || shipping?.mobile || shipping?.tel || shipping?.phoneNumber || ''
            const items = getItemsFromOrder(o)

            return (
              <OrderCard key={orderNum} order={{ orderNum, created, updated, total, paymentMethod, paid, delivered, shipping, phone, items }} />
            )
          })}
        </div>
      )}
    </main>
  )
}

function Badge({ children, color = 'gray' }: { children: React.ReactNode; color?: 'green' | 'red' | 'gray' }) {
  const bg = color === 'green' ? 'bg-green-100 text-green-800' : color === 'red' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
  return <span className={`inline-block px-2 py-1 text-xs rounded ${bg}`}>{children}</span>
}

function getItemsFromOrder(o: any) {
  return o.items || o.orderItems || o.products || o.cart?.items || o.cart?.products || []
}

function getTotalFromOrder(o: any) {
  const direct = o.total || o.amount || o.grandTotal || o.totalPrice || o.finalPrice
  if (typeof direct === 'number' && direct > 0) return direct
  const items = getItemsFromOrder(o)
  if (Array.isArray(items) && items.length > 0) {
    return items.reduce((s: number, it: any) => {
      const price = Number(it.price ?? it.unitPrice ?? it.priceAfterDiscount ?? it.amount ?? 0) || 0
      const qty = Number(it.quantity ?? it.qty ?? it.count ?? 1) || 1
      return s + price * qty
    }, 0)
  }
  return 0
}

function OrderCard({ order }: any) {
  const [open, setOpen] = useState(false)
  const { orderNum, created, updated, total, paymentMethod, paid, delivered, shipping, phone, items } = order

  return (
    <div className="bg-white border rounded p-4 relative shadow-sm overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-lg font-medium">Order #{orderNum}</div>
          <div className="text-sm text-gray-600 mt-1">Order Date: {fmtDate(created)}</div>
          <div className="mt-2 flex items-center gap-3">
            <div>Payment:</div>
            <div className="flex items-center gap-2">
              <Badge color={paid ? 'green' : 'gray'}>{paymentMethod}{paid ? ' · Paid' : ''}</Badge>
            </div>
            <div className="ml-2">Delivered:</div>
            <Badge color={delivered ? 'green' : 'red'}>{delivered ? 'Yes' : 'No'}</Badge>
          </div>
        </div>

        <div className="text-right">
          <div className="font-semibold">{formatEGP(total)}</div>
          <div className="text-sm text-gray-500 mt-2">Shipping: {shipping?.city || shipping?.country || '—'}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500">Shipping address</div>
          <div className="mt-1 text-sm">{shipping?.details || shipping?.addressLine || shipping?.street || '—'}</div>
          <div className="text-sm text-gray-500 mt-1">Phone: {phone || '—'}</div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <button onClick={() => setOpen((s) => !s)} className="bg-black text-white px-4 py-2 rounded cursor-pointer">{open ? 'Hide items' : 'View order items'}</button>
        </div>
      </div>
      {open && (
        <div className="mt-4 border-t pt-4">
          <div className="flex flex-col gap-3">
            {Array.isArray(items) && items.length > 0 ? items.map((it: any, idx: number) => (
              <div key={it._id || it.id || idx} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 flex-shrink-0 overflow-hidden">
                  {it.image ? <img src={typeof it.image === 'string' ? it.image : (it.image?.url || it.image?.path)} alt={it.title || it.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No</div>}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{it.title || it.name || it.productName}</div>
                  <div className="text-sm text-gray-500">Qty: {it.quantity || it.qty || 1}</div>
                </div>
                <div className="font-semibold">{formatEGP((it.price || it.unitPrice || 0) * (it.quantity || it.qty || 1))}</div>
              </div>
            )) : <div className="text-sm text-gray-500">No items available</div>}
          </div>
        </div>
      )}

      <div className="absolute right-3 bottom-3 text-xs text-gray-500">Last updated: {fmtDate(updated)}</div>
    </div>
  )
}

function formatEGP(v: number) {
  return `EGP ${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
