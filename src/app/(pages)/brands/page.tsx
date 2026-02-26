// Brands listing page at route: /brands
import React from 'react'

type Brand = { _id: string; name: string; image?: string }

async function getBrands(): Promise<Brand[]> {
  const res = await fetch('https://ecommerce.routemisr.com/api/v1/brands')
  if (!res.ok) return []
  const json = await res.json()
  return json?.data || []
}

export default async function BrandsPage() {
  const brands = await getBrands()

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Brands</h1>
      {brands.length === 0 ? (
        <p className="text-gray-500">No brands available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((b) => (
            <div key={b._id} className="border rounded p-4 flex flex-col items-center text-center">
              <div className="w-full h-40 bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
                {b.image ? (
                  <img
                    src={b.image.startsWith('http') ? b.image : `https://ecommerce.routemisr.com/${b.image}`}
                    alt={b.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </div>
              <h3 className="font-medium">{b.name}</h3>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

