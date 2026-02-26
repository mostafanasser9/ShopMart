"use client"
import React, { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

export default function AddToWishlistButton({ productId }: { productId: string }) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('wishlist')
      const list = raw ? JSON.parse(raw) : []
      setActive(Array.isArray(list) && list.includes(productId))
    } catch (e) {
      setActive(false)
    }
  }, [productId])

  function toggle(e: React.MouseEvent) {
    e.stopPropagation()
    try {
      const raw = localStorage.getItem('wishlist')
      const list = raw ? JSON.parse(raw) : []
      const set = new Set(Array.isArray(list) ? list : [])
      if (set.has(productId)) {
        set.delete(productId)
        setActive(false)
      } else {
        set.add(productId)
        setActive(true)
      }
      localStorage.setItem('wishlist', JSON.stringify(Array.from(set)))
    } catch (err) {
      console.error('wishlist error', err)
    }
  }

  return (
    <button onClick={toggle} className={`p-2 rounded ${active ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`} aria-pressed={active}>
      <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={1}
        />
      </svg>
    </button>
  )
}
