import React from 'react'

async function fetchCategories() {
  try {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/categories')
    if (!res.ok) return []
    const json = await res.json()
    return json?.data || []
  } catch (e) {
    return []
  }
}

async function getCategory(id: string) {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}`)
  if (!res.ok) return null
  const json = await res.json()
  return json?.data || null
}

async function getSubcategories(id: string) {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}/subcategories`)
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

export default async function Women() {
  const categories = await fetchCategories()
  const slug = 'women'
  const found = categories.find((c: any) => (c.name || '').toLowerCase() === slug || (c.slug || '').toLowerCase() === slug)
  if (!found) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold">Women category not found</h1>
        <p className="text-gray-500 mt-2">Try browsing the <a href="/categories" className="text-blue-600">Categories</a> page.</p>
      </main>
    )
  }

  const category = await getCategory(found._id)
  const subcats = await getSubcategories(found._id)

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex gap-6 items-center mb-6">
        <div className="w-28 h-28 bg-gray-100 flex items-center justify-center overflow-hidden">
          {category?.image ? (
            <img src={imgSrcFrom(category) || ''} alt={category.name} className="w-full h-full object-contain" />
          ) : (
            <span className="text-gray-400">No image</span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{category?.name}</h1>
          <p className="mt-2 text-gray-700">{category?.description || 'No description available.'}</p>
        </div>
      </div>

      {subcats && subcats.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {subcats.map((s: any) => (
              <a key={s._id} href={`/categories/${s._id}`} className="border rounded p-4 flex flex-col items-center text-center hover:shadow-lg transition cursor-pointer">
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
                  {imgSrcFrom(s) ? (
                    <img src={imgSrcFrom(s)?.startsWith('http') ? imgSrcFrom(s) : `https://ecommerce.routemisr.com/${imgSrcFrom(s)}`} alt={s.name} className="w-full h-full object-cover" />
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
