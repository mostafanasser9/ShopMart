// Products listing page at route: /products
// Server component that fetches products from the API and displays a grid.
import React from 'react'
import Link from 'next/link'
import AddToCartButton from './AddToCartButton'
import AddToWishlistButton from './AddToWishlistButton'

type Product = {
  _id: string
  title: string
  image?: string
  images?: Array<string | { url?: string; path?: string }>
  price?: number
  brand?: any
  category?: any
  ratingsAverage?: number
  ratingsCount?: number
  reviews?: any
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://ecommerce.routemisr.com/api/v1/products')
  if (!res.ok) return []
  const json = await res.json()
  return json?.data || []
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" suppressHydrationWarning>
          {products.map((p) => {
            const imgCandidate =
              typeof p.image === 'string'
                ? p.image
                : Array.isArray(p.images)
                ? p.images[0] && (typeof p.images[0] === 'string' ? p.images[0] : p.images[0].url || p.images[0].path)
                : null

            const src = imgCandidate ? (imgCandidate.startsWith('http') ? imgCandidate : `https://ecommerce.routemisr.com/${imgCandidate}`) : null
            const brandName = (p as any).brand?.name || (p as any).brand || (p as any).brandName || ''
            const categoryName = (p as any).category?.name || (p as any).category || ''
            const rating = (p as any).ratingsAverage ?? (p as any).rating ?? (p as any).avgRating ?? (p as any).ratingAverage ?? 0
            const reviewsCount = (p as any).ratingsCount ?? (p as any).reviews?.length ?? (p as any).reviewsCount ?? (p as any).reviewCount ?? (p as any).numReviews ?? (p as any).review_count ?? 0
            const priceStr = p.price != null ? `EGP ${Number(p.price).toFixed(2)}` : ''

            return (
              <div key={p._id} className="border rounded overflow-hidden flex flex-col" suppressHydrationWarning>
                <Link href={`/products/${p._id}`} className="group block flex-1">
                  <div className="h-56 bg-gray-100 overflow-hidden">
                    {src ? (
                      <img src={src} alt={p.title} className="w-full h-full object-cover transform group-hover:scale-105 transition" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                    )}
                  </div>

                  <div className="p-4">
                    {brandName && <div className="text-sm text-gray-500">{brandName}</div>}
                    <h3 className="font-medium mt-1 truncate">{p.title}</h3>
                    {categoryName && <div className="text-sm text-gray-500 mt-1">{categoryName}</div>}

                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-0.5 text-sm">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span key={i} className={i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'} aria-hidden>
                            ★
                          </span>
                        ))}
                      </div>
                      <div>({reviewsCount})</div>
                    </div>

                    <div className="mt-3 text-lg font-semibold">{priceStr}</div>
                  </div>
                </Link>

                <div className="p-3 flex gap-3">
                  <div className="flex-1">
                    <AddToCartButton productId={p._id} className="w-full" product={{ title: p.title, price: p.price, image: src || undefined }} />
                  </div>
                  <div className="flex items-center">
                    <AddToWishlistButton productId={p._id} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}

