"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addToCartV2, addToCartV1 } from '@/lib/api'
import { ShoppingCart } from 'lucide-react'

export default function AddToCartButton({ productId, className, product }: { productId: string; className?: string; product?: { title?: string; price?: number; image?: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleAdd(e?: React.MouseEvent) {
    if (e) e.stopPropagation()
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || undefined : undefined
    if (!token) {
      router.push('/auth/sign-in')
      return
    }

    try {
      setLoading(true)
      await addToCartV2(productId, 1, token)
      alert('Added to cart')
      // update localStorage fallback so cart page can reflect immediately
      try {
        const raw = localStorage.getItem('cart')
        const list = raw ? JSON.parse(raw) : []
        const existing = Array.isArray(list) ? list : []
        // merge by productId
        const idx = existing.findIndex((it: any) => it.productId === productId || it._id === productId)
        if (idx >= 0) {
          existing[idx].quantity = (existing[idx].quantity || existing[idx].qty || 0) + 1
        } else {
          existing.push({ productId, quantity: 1, title: product?.title, price: product?.price, image: product?.image })
        }
        localStorage.setItem('cart', JSON.stringify(existing))
        try {
          window.dispatchEvent(new CustomEvent('cart-updated'))
        } catch (e) {}
      } catch (err) {
        // ignore
      }
    } catch (e) {
      console.error('addToCartV2 error:', e)
      try {
        await addToCartV1(productId, 1, token)
        alert('Added to cart (v1 fallback)')
      } catch (e2) {
        console.error('addToCartV1 error:', e2)
        const msg = (e2 as any)?.message || (e as any)?.message || 'Failed to add to cart'
        alert(`Failed to add to cart: ${msg}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleAdd} className={`flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black hover:border hover:border-black transition ${className || ''}`} disabled={loading}>
      <ShoppingCart size={16} />
      {loading ? 'Adding...' : 'Add to cart'}
    </button>
  )

}
