"use client"
import React, { useEffect, useState } from 'react'

type CartItem = {
  _id: string
  product: { _id: string; title: string; price?: number; image?: string }
  quantity: number
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    function readFromStorage() {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('cart') : null
        if (raw) {
          const parsed = JSON.parse(raw)
          const mapped = Array.isArray(parsed)
            ? parsed.map((it: any, idx: number) => ({
                _id: it._id || it.productId || `local-${idx}`,
                product: {
                  _id: it.productId || it._id || '',
                  title: it.title || it.name || 'Product',
                  price: it.price || it.unitPrice || 0,
                  image: it.image || it.imageUrl || undefined,
                },
                quantity: it.quantity || it.qty || 1,
              }))
            : []
          setItems(mapped)
        } else {
          setItems([])
        }
      } catch (e) {
        setItems([])
      }
    }

    readFromStorage()

    function onStorage(e: StorageEvent) {
      if (e.key === 'cart') readFromStorage()
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener('cart-updated', readFromStorage as EventListener)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('cart-updated', readFromStorage as EventListener)
    }
  }, [])

  function persist(next: CartItem[]) {
    try {
      const raw = next.map((it) => ({ _id: it._id, productId: it.product._id, title: it.product.title, price: it.product.price, image: it.product.image, quantity: it.quantity }))
      localStorage.setItem('cart', JSON.stringify(raw))
    } catch (e) {
      // ignore localStorage errors
    }
  }

  function changeQty(itemId: string, delta: number) {
    setItems((prev) => {
      const next = prev.map((i) => (i._id === itemId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
      persist(next)
      try { window.dispatchEvent(new Event('cart-updated')) } catch (e) {}
      return next
    })
  }

  function removeItem(itemId: string) {
    setItems((prev) => {
      const next = prev.filter((i) => i._id !== itemId)
      persist(next)
      try { window.dispatchEvent(new Event('cart-updated')) } catch (e) {}
      return next
    })
  }

  function clearCart() {
    try { localStorage.removeItem('cart') } catch (e) {}
    setItems([])
    try { window.dispatchEvent(new Event('cart-updated')) } catch (e) {}
  }

  const total = items.reduce((acc, it) => acc + ((it.product?.price || 0) * it.quantity), 0)
  const formatEGP = (v: number) => `EGP ${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <main>
      <div className="mb-4 p-5">
        <h1 className="text-3xl font-bold text-black">Shopping cart</h1>
        <p className="text-sm text-gray-500 mt-1">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 p-5">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <div className="flex flex-col gap-4">
              {items.map((it) => {
                const p: any = it.product || {}
                let imgSrc: string | null = null
                if (p.image) {
                  if (typeof p.image === 'string') imgSrc = p.image
                  else if ((p.image as any)?.url) imgSrc = (p.image as any).url
                  else if ((p.image as any)?.path) imgSrc = (p.image as any).path
                }
                if (!imgSrc && p.images && Array.isArray(p.images) && p.images.length > 0) {
                  const first = p.images[0]
                  imgSrc = typeof first === 'string' ? first : (first as any)?.url || (first as any)?.path || null
                }
                const title = p.title || p.name || p.productName || 'Product'
                const brand = p.brand || p.manufacturer || ''
                const category = p.category || ''
                const itemPrice = (p.price ?? 0)

                return (
                  <div key={it._id} className="flex items-start gap-4 p-4 border rounded">
                    <div className="w-32 h-32 flex-shrink-0 overflow-hidden bg-gray-100">
                      {imgSrc ? (
                        <img src={imgSrc.startsWith('http') ? imgSrc : `https://ecommerce.routemisr.com/${imgSrc}`} alt={title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="font-medium text-lg">{title}</div>
                      <div className="text-sm text-gray-500 mt-1">{brand ? `${brand} · ${category}` : category}</div>

                      <div className="mt-3 flex items-center gap-3">
                        <button className="px-3 py-1 border rounded" onClick={() => changeQty(it._id, -1)}>-</button>
                        <span className="font-medium">{it.quantity}</span>
                        <button className="px-3 py-1 border rounded" onClick={() => changeQty(it._id, 1)}>+</button>
                      </div>
                    </div>

                    <div className="w-40 text-right flex flex-col items-end">
                      <div className="font-semibold">{formatEGP(itemPrice * it.quantity)}</div>
                      <div className="text-sm text-gray-400">each</div>
                      <button className="text-sm text-red-600 mt-2" onClick={() => removeItem(it._id)}>Remove</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="p-4 border rounded">
              <h2 className="text-lg font-semibold mb-4">Order summary</h2>

              <div className="flex justify-between text-sm text-gray-500">
                <div>Subtotal ({items.length} items)</div>
                <div className="text-black font-semibold">{formatEGP(total)}</div>
              </div>

              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <div>Shipping</div>
                <div className="text-green-600 font-semibold">Free</div>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-lg font-semibold">
                <div>Total</div>
                <div>{formatEGP(total)}</div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button onClick={() => { window.location.href = '/' }} className="w-full border bg-white hover:bg-gray-50 p-3 rounded">Continue Shopping</button>
                <a href="/checkout" className="w-full bg-black text-white p-3 rounded text-center hover:opacity-90">Proceed to checkout</a>
                <button onClick={clearCart} className="mt-3 flex items-center justify-center gap-2 text-red-600 border border-red-600 hover:bg-red-50 p-2 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h1v9a2 2 0 002 2h6a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 4a1 1 0 012 0v7a1 1 0 11-2 0V6zm4 0a1 1 0 10-2 0v7a1 1 0 102 0V6z" clipRule="evenodd" />
                  </svg>
                  Clear cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
