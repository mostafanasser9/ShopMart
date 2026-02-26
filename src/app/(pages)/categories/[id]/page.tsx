// Category detail page at route: /categories/[id]
import React from 'react'

type Category = { _id: string; name: string; description?: string; image?: string }

async function getCategory(id: string): Promise<Category | null> {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}`)
  if (!res.ok) return null
  const json = await res.json()
  return json?.data || null
}

export default async function CategoryDetail(props: { params: { id: string } | Promise<{ id: string }> }) {
  const { params } = props
  const resolved = await params
  const id = resolved.id
  const category = await getCategory(id)

  if (!category) return <div className="p-8">Category not found.</div>

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex gap-6 items-center">
        <div className="w-28 h-28 bg-gray-100 flex items-center justify-center overflow-hidden">
          {category.image ? (
            <img
              src={category.image.startsWith('http') ? category.image : `https://ecommerce.routemisr.com/${category.image}`}
              alt={category.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-gray-400">No image</span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <p className="mt-2 text-gray-700">{category.description || 'No description available.'}</p>
        </div>
      </div>
    </main>
  )
}
