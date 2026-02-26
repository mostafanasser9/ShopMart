
import React from 'react'

export default function Home() {
  return (
    <main className="py-8">
      <section className="text-center px-6 mb-10">
        <h1 className="text-4xl font-bold">Welcome to ShopMart</h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Discover the latest technology, fashion, and lifestyle products. Quality guaranteed with fast shipping and excellent customer service.</p>
        <div className="mt-6 flex justify-center gap-4">
          <a href="/products" className="bg-black text-white px-4 py-2 rounded">Shop Now</a>
          <a href="/categories" className="border px-4 py-2 rounded">Browse Categories</a>
        </div>
      </section>
    </main>
  )
}