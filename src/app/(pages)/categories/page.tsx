// Categories listing page at route: /categories
import React from 'react'

type Category = { _id: string; name: string; image?: string }

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/categories')
    if (!res.ok) return []
    const json = await res.json()
    return json?.data || []
  } catch (e) {
    return []
  }
}


function imgSrcFrom(item: any) {
  if (!item) return null
  if (typeof item.image === 'string') return item.image
  if (item.image?.url) return item.image.url
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    const first = item.images[0]
    return typeof first === 'string' ? first : first?.url || first?.path || null
  }
  return null
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Categories</h1>

      {categories.length === 0 ? (
        <p className="text-gray-500">No categories available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {categories.map((c) => {
            const src = imgSrcFrom(c)
            return (
              <a key={c._id} href={`/categories/${c._id}`} className="border rounded p-4 flex flex-col items-center text-center hover:shadow-lg transition cursor-pointer">
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
                  {src ? (
                    <img src={src.startsWith('http') ? src : `https://ecommerce.routemisr.com/${src}`} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </div>
                <h3 className="font-medium uppercase tracking-wide">{c.name}</h3>
              </a>
            )
          })}
        </div>
      )}

      
    </main>
  )
}
