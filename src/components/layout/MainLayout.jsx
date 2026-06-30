'use client'

import Navbar from './Navbar'
import Footer from './Footer'

export default function MainLayout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Navbar />
      <main className="relative z-0 flex-grow flex flex-col w-full">
        {children}
      </main>
      <Footer />
    </div>
  )
}
