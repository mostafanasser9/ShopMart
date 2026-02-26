// Product details page at route: /products/[id]
// Server component that fetches a single product by id from the API.
import React from 'react'
import Link from 'next/link'
import AddToCartButton from '../AddToCartButton'
import AddToWishlistButton from '../AddToWishlistButton'

type Product = {
  _id: string
  title: string
  description?: string
  image?: string
  images?: Array<string | { url?: string; path?: string }>
  price?: number
}

async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
  if (!res.ok) return null
  const json = await res.json()
  return json?.data || null
}

export default async function ProductDetail(props: { params: { id: string } | Promise<{ id: string }> }) {
  // `params` may be a Promise; await it before accessing `id`.
  const { params } = props
  const resolvedParams = await params
  const id = resolvedParams.id
  const product = await getProduct(id)

  if (!product) return <div className="p-8">Product not found.</div>

  const imgCandidate =
    typeof product.image === 'string'
      ? product.image
      : Array.isArray(product.images)
      ? product.images[0] && (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url || product.images[0].path)
      : null
  const src = imgCandidate ? (imgCandidate.startsWith('http') ? imgCandidate : `https://ecommerce.routemisr.com/${imgCandidate}`) : null

  const brandName = (product as any).brand?.name || (product as any).brand || (product as any).brandName || ''
  const categoryName = (product as any).category?.name || (product as any).category || ''
  const rating = (product as any).ratingsAverage ?? (product as any).rating ?? (product as any).avgRating ?? 0
  const reviewsCount = (product as any).ratingsCount ?? (product as any).reviews?.length ?? (product as any).reviewsCount ?? (product as any).reviewCount ?? 0
  const priceStr = product.price != null ? `EGP ${Number(product.price).toFixed(2)}` : ''

  return (
    <main className="max-w-7xl mx-auto p-6">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-black">Product Details</span>
      </nav>

      <section className="border rounded p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="h-96 bg-gray-100 overflow-hidden rounded">
              {src ? (
                <img src={src} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
              )}
            </div>
          </div>

          <div className="col-span-2 flex flex-col">
            {brandName && <div className="text-sm text-gray-500">{brandName}</div>}
            <h1 className="text-3xl font-bold text-black mt-1">{product.title}</h1>
            {categoryName && <div className="text-sm text-gray-500 mt-1">{categoryName}</div>}

            <p className="mt-4 text-gray-700">{product.description}</p>

            <div className="mt-4 text-2xl font-semibold">{priceStr}</div>

            <div className="mt-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xl text-yellow-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className={i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">({reviewsCount})</div>
              </div>
            </div>

            <div className="mt-6 w-full flex items-center gap-3">
              <div className="flex-1">
                <AddToCartButton productId={product._id} className="w-full" product={{ title: product.title, price: product.price, image: src || undefined }} />
              </div>
              <div>
                <AddToWishlistButton productId={product._id} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
