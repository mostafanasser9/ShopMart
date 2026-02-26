// Brand detail page at route: /brands/[id]
import React from 'react'

type Brand = { _id: string; name: string; description?: string; image?: string }

async function getBrand(id: string): Promise<Brand | null> {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands/${id}`)
  if (!res.ok) return null
  const json = await res.json()
  return json?.data || null
}

export default async function BrandDetail(props: { params: { id: string } | Promise<{ id: string }> }) {
  const { params } = props
  const resolved = await params
  const id = resolved.id
  const brand = await getBrand(id)

  if (!brand) return <div className="p-8">Brand not found.</div>

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex gap-6 items-center">
        <div className="w-28 h-28 bg-gray-100 flex items-center justify-center overflow-hidden">
          {brand.image ? (
            <img
              src={brand.image.startsWith('http') ? brand.image : `https://ecommerce.routemisr.com/${brand.image}`}
              alt={brand.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-gray-400">No image</span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{brand.name}</h1>
          <p className="mt-2 text-gray-700">{brand.description || 'No description available.'}</p>
        </div>
      </div>
    </main>
  )
}
