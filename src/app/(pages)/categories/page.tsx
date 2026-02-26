// Categories listing page at route: /categories
import React from 'react'

type Category = { _id: string; name: string; image?: string }

async function getCategories(): Promise<Category[]> {
  const res = await fetch('https://ecommerce.routemisr.com/api/v1/categories')
  if (!res.ok) return []
  const json = await res.json()
  return json?.data || []
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Categories</h1>
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <div key={c._id} className="border rounded p-4 flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
                {c.image ? (
                  <img
                    src={c.image.startsWith('http') ? c.image : `https://ecommerce.routemisr.com/${c.image}`}
                    alt={c.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </div>
              <h3 className="font-medium">{c.name}</h3>
              <a href={`/categories/${c._id}`} className="mt-2 text-sm text-blue-600">View</a>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
