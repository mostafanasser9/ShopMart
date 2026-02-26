import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-gray-600 text-center max-w-xl">This page could not be found.</p>
      <div className="mt-6 text-center">
        <h2 className="text-xl font-semibold">ShopMart</h2>
        <p className="text-gray-500">Your one-stop destination for the latest technology, fashion, and lifestyle products. Quality guaranteed with fast shipping and excellent customer service.</p>
        <div className="mt-4 text-sm text-gray-600">
          <div>123 Shop Street, October City, DC 12345</div>
          <div>(+20) 01093333333</div>
          <div>support@shopmart.com</div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 underline">Return to Home</Link>
      </div>
    </div>
  )
}
