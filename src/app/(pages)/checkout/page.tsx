"use client"
import React, { useEffect, useState } from 'react'
import { getCartV2, createCheckoutSession, createCashOrder } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || undefined : undefined

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getCartV2(token)
      .then((res: any) => { if (!mounted) return; setCart(res?.data || null) })
      .catch(() => { if (!mounted) return; setCart(null) })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [token])

  async function handleCardCheckout() {
    if (!cart?.id) return alert('No cart available')
    try {
      setProcessing(true)
      const res = await createCheckoutSession(cart.id, token)
      // API may return URL in different places; try common locations
      const url = res?.url || res?.data?.url || res?.session?.url
      if (url) {
        window.location.href = url
      } else {
        alert('Checkout session created. No redirect URL returned.')
      }
    } catch (e: any) {
      console.error(e)
      alert(e?.message || 'Checkout failed')
    } finally { setProcessing(false) }
  }

  async function handleCashCheckout() {
    if (!cart?.id) return alert('No cart available')
    try {
      setProcessing(true)
      await createCashOrder(cart.id, token)
      alert('Order placed (cash).')
      router.push('/orders')
    } catch (e: any) {
      console.error(e)
      alert(e?.message || 'Cash checkout failed')
    } finally { setProcessing(false) }
  }

  const total = cart?.items?.reduce((s: number, it: any) => s + ((it.product?.price || 0) * it.quantity), 0) || 0

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      {loading ? (
        <p>Loading cart...</p>
      ) : !cart || (cart.items || []).length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          <div className="border rounded p-4">
            {cart.items.map((it: any) => (
              <div key={it._id} className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {it.product?.image ? (
                    <img src={it.product.image.startsWith('http') ? it.product.image : `https://ecommerce.routemisr.com/${it.product.image}`} alt={it.product.title} className="w-full h-full object-contain" />
                  ) : <span className="text-gray-400">No image</span>}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{it.product?.title}</div>
                  <div className="text-sm text-gray-600">Qty: {it.quantity}</div>
                </div>
                <div className="font-semibold">EGP {(it.product?.price || 0) * it.quantity}</div>
              </div>
            ))}
            <div className="text-right font-semibold">Total: EGP {total}</div>
          </div>

          <div className="flex gap-3 justify-end">
            <button disabled={processing} onClick={handleCardCheckout} className="bg-blue-600 text-white px-4 py-2 rounded">Pay with Card (Stripe)</button>
            <button disabled={processing} onClick={handleCashCheckout} className="bg-gray-100 px-4 py-2 rounded">Pay Cash on Delivery</button>
          </div>
        </div>
      )}
    </main>
  )
}
