"use client"
import React, { useEffect, useState } from 'react'
type WishlistItem = { _id: string; _srcId?: string | null; title?: string; price?: number; image?: string }

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    async function read() {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('wishlist') : null
        if (raw) {
          const parsed = JSON.parse(raw)
          const mapped = Array.isArray(parsed) ? parsed.map((it: any, idx: number) => ({ _id: it._id || it.productId || `w-${idx}`, _srcId: it.productId || it._id || (it.product && (it.product._id || it.product.id)) || null, title: it.title || it.name || (it.product && (it.product.title || it.product.name)) || 'Product', price: it.price || it.unitPrice || (it.product && (it.product.price || it.product.unitPrice)) || 0, image: it.image || it.imageUrl || (it.product && (it.product.image || (Array.isArray(it.product.images) ? (typeof it.product.images[0] === 'string' ? it.product.images[0] : it.product.images[0].url) : undefined))) })) : []
          setItems(mapped)
          // enrich missing info from product API when possible
          enrichItems(mapped)
        } else setItems([])
      } catch (e) { setItems([]) }
    }

    read()
    window.addEventListener('cart-updated', read as EventListener)
    window.addEventListener('storage', (e: StorageEvent) => { if (e.key === 'wishlist') read() })
    return () => { window.removeEventListener('cart-updated', read as EventListener) }
  }, [])

  function persistIds(ids: string[]) {
    try { localStorage.setItem('wishlist', JSON.stringify(ids)) } catch (e) {}
  }

  async function enrichItems(list: any[]) {
    if (!Array.isArray(list) || list.length === 0) return
    const toFetch = list.filter((it) => {
      const need = !it.title || !it.image || !it.price || it.price === 0
      return need && it._srcId && !(String(it._srcId).startsWith('w-') || String(it._srcId).startsWith('local-'))
    })
    if (toFetch.length === 0) return
    const promises = toFetch.map(async (it) => {
      try {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${it._srcId}`)
        if (!res.ok) return null
        const json = await res.json()
        const pd = json?.data || json
        return { id: it._srcId, pd }
      } catch (e) { return null }
    })
    const results = await Promise.all(promises)
    const updated = list.map((it) => {
      const r = results.find((x) => x && x.id === it._srcId)
      if (!r || !r.pd) return it
      const pd = r.pd
      return {
        ...it,
        title: pd.title || pd.name || it.title,
        price: pd.price ?? pd.unitPrice ?? it.price,
        image: typeof pd.image === 'string' ? pd.image : (Array.isArray(pd.images) && pd.images[0] ? (typeof pd.images[0] === 'string' ? pd.images[0] : pd.images[0].url || pd.images[0].path) : pd.image?.url || pd.image?.path || it.image)
      }
    })
    setItems(updated)
  }

  function remove(id: string) {
    // remove id from stored wishlist (which is an array of ids)
    try {
      const raw = localStorage.getItem('wishlist')
      const parsed = raw ? JSON.parse(raw) : []
      const ids = Array.isArray(parsed) ? parsed.filter((x: any) => String(x) !== String(id)) : []
      persistIds(ids)
    } catch (e) {
      // ignore
    }

    setItems((prev) => prev.filter((p) => p._id !== id))
    try { window.dispatchEvent(new Event('cart-updated')) } catch (e) {}
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Wishlist</h1>
      {items.length === 0 ? (
        <p className="text-gray-500 p-4">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((it) => (
            <div key={it._id} className="border rounded p-4 flex gap-4 items-center">
              <div className="w-20 h-20 bg-gray-100 flex-shrink-0 overflow-hidden">
                {it.image ? <img src={it.image.startsWith('http') ? it.image : `https://ecommerce.routemisr.com/${it.image}`} alt={it.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No</div>}
              </div>
              <div className="flex-1">
                <div className="font-medium">{it.title}</div>
                <div className="text-sm text-gray-500">EGP {Number(it.price || 0).toLocaleString()}</div>
              </div>
              <div className="flex flex-col gap-2">
                <a href={`/products/${it._srcId || it._id}`} className="text-sm text-black border px-3 py-1 rounded cursor-pointer text-center">View</a>
                <button onClick={() => remove(it._id)} className="text-sm text-red-600 border px-3 py-1 rounded cursor-pointer">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-right">
        <a href="/checkout" className="bg-black text-white px-4 py-2 rounded inline-block cursor-pointer">Proceed to checkout</a>
      </div>
    </main>
  )
}
