// Category detail page at route: /categories/[id]
import React from 'react'

type Category = { _id: string; name: string; description?: string; image?: string }

async function getCategory(id: string): Promise<Category | null> {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}`)
  if (!res.ok) return null
  const json = await res.json()
  return json?.data || null
}

async function getSubcategories(id: string): Promise<Category[]> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}/subcategories`)
    if (!res.ok) return []
    const json = await res.json()
    return json?.data || []
  } catch (e) {
    return []
  }
}

export default async function CategoryDetail(props: { params: { id: string } | Promise<{ id: string }> }) {
  const { params } = props
  const resolved = await params
  const id = resolved.id
  const category = await getCategory(id)
  const subcats = await getSubcategories(id)

  if (!category) return <div className="p-8">Category not found.</div>

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex gap-6 items-center mb-6">
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

      {subcats && subcats.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {subcats.map((s) => (
              <a key={s._id} href={`/categories/${s._id}`} className="border rounded p-4 flex flex-col items-center text-center hover:shadow-lg transition cursor-pointer">
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
                  {s.image ? (
                    <img src={s.image.startsWith('http') ? s.image : `https://ecommerce.routemisr.com/${s.image}`} alt={s.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </div>
                <h3 className="font-medium uppercase tracking-wide">{s.name}</h3>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
