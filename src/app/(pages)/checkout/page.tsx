"use client"
import React, { useEffect, useState } from 'react'
import { getCartV2, addToCartV2, createCheckoutSession, createCashOrder } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const [cart, setCart] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || undefined : undefined

  useEffect(() => {
    let mounted = true
    setIsLoading(true);
    // Try server cart for authenticated users; fall back to localStorage cart for guests.
    // If user is signed in and server cart is empty but localStorage has items, sync them to server.
    (async () => {
      try {
        const res: any = await getCartV2(token)
        if (!mounted) return
        const serverCart = res?.data || null
        if (serverCart && (serverCart.items || []).length > 0) {
          setCart(serverCart)
        } else {
          // try to sync local cart to server for authenticated users
          try {
            const raw = localStorage.getItem('cart')
            const local = raw ? JSON.parse(raw) : []
            if (token && local && local.length > 0) {
              // add each item to server cart
              await Promise.all(
                local.map((it: any) => addToCartV2(it._srcId || it.productId || it._id, it.quantity || it.qty || 1, token))
              )
              // re-fetch server cart
              const refreshed: any = await getCartV2(token)
              setCart(refreshed?.data || null)
            } else {
              const mapped = { items: (local || []).map((it: any, idx: number) => ({ _id: it._id || `local-${idx}`, product: { _id: it._srcId || it._id, title: it.title || it.name || '', image: it.image || it.img || undefined, price: it.price || it.unitPrice || 0 }, quantity: it.qty || it.quantity || 1 })) }
              setCart(mapped)
            }
          } catch (e) {
            const raw = localStorage.getItem('cart')
            const local = raw ? JSON.parse(raw) : []
            const mapped = { items: (local || []).map((it: any, idx: number) => ({ _id: it._id || `local-${idx}`, product: { _id: it._srcId || it._id, title: it.title || it.name || '', image: it.image || it.img || undefined, price: it.price || it.unitPrice || 0 }, quantity: it.qty || it.quantity || 1 })) }
            setCart(mapped)
          }
        }
      } catch (e) {
        if (!mounted) return
        try {
          const raw = localStorage.getItem('cart')
          const local = raw ? JSON.parse(raw) : []
          const mapped = { items: (local || []).map((it: any, idx: number) => ({ _id: it._id || `local-${idx}`, product: { _id: it._srcId || it._id, title: it.title || it.name || '', image: it.image || it.img || undefined, price: it.price || it.unitPrice || 0 }, quantity: it.qty || it.quantity || 1 })) }
          setCart(mapped)
        } catch (e) {
          setCart(null)
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [token])

  const [shippingAddress, setShippingAddress] = useState({ details: '', phone: '', city: '' })

  // Stripe/card checkout removed per request.
  async function handleCardCheckout() {
    if (!cart?.id) return alert('No cart available — sign in to complete checkout')
    try {
      setProcessing(true)
      const res = await createCheckoutSession(cart.id, token, { url: window.location.origin, shippingAddress })
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
    if (!cart?.id) return alert('No cart available — sign in to complete checkout')
    try {
      setProcessing(true)
      await createCashOrder(cart.id, token, shippingAddress)
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
      {isLoading ? (
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

          <div className="border rounded p-4">
            <h2 className="font-semibold mb-2">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input value={shippingAddress.details} onChange={(e) => setShippingAddress({ ...shippingAddress, details: e.target.value })} placeholder="Address details" className="border p-2 rounded" />
              <input value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} placeholder="Phone" className="border p-2 rounded" />
              <input value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} placeholder="City" className="border p-2 rounded" />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button disabled={processing || !token} onClick={handleCardCheckout} className="bg-blue-600 text-white px-4 py-2 rounded">Pay with Card</button>
            <button disabled={processing || !token} onClick={handleCashCheckout} className="bg-gray-100 px-4 py-2 rounded">Pay Cash on Delivery</button>
          </div>
          {!token && <p className="text-sm text-gray-500 mt-2">Sign in to complete payment and create the server-side order.</p>}
        </div>
      )}
    </main>
  )
}
