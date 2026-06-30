'use client'

import { FaGoogle, FaFacebookF } from 'react-icons/fa'

export default function SocialLogins() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      <button
        type="button"
        className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral/10 bg-neutral/5 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-neutral/10 hover:border-neutral/20"
      >
        <FaGoogle className="text-red-500 transition-transform group-hover:scale-110" />
        <span>Google</span>
      </button>
      <button
        type="button"
        className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral/10 bg-neutral/5 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-neutral/10 hover:border-neutral/20"
      >
        <FaFacebookF className="text-blue-600 transition-transform group-hover:scale-110" />
        <span>Facebook</span>
      </button>
    </div>
  )
}
