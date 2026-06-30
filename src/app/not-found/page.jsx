import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'

export default function NotFoundPage() {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
          <Link href="/" className="btn bg-primary text-white hover:bg-primary-dark">
            Back to Home
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}
