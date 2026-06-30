'use client'

export default function RoleToggle({ activeRole, setActiveRole }) {
  return (
    <div className="relative mb-4 flex rounded-full bg-neutral/10 p-1 shadow-inner sm:mb-6 sm:p-1.5">
      <div
        className={`absolute top-1 bottom-1 w-[50%] rounded-full bg-white shadow-lg transition-transform duration-500 ease-out z-0 sm:top-1.5 sm:bottom-1.5 ${
          activeRole === 'artisan' ? 'translate-x-[98%]' : 'translate-x-0'
        }`}
      />

      <button
        type="button"
        onClick={() => setActiveRole('customer')}
        className={`relative z-10 flex-1 rounded-full py-2.5 text-xs font-semibold transition-colors duration-300 sm:py-3 sm:text-sm ${
          activeRole === 'customer' ? 'text-emerald-500' : 'text-emerald-500/50'
        }`}
      >
        CUSTOMER
      </button>
      <button
        type="button"
        onClick={() => setActiveRole('artisan')}
        className={`relative z-10 flex-1 rounded-full py-2.5 text-xs font-semibold transition-colors duration-300 sm:py-3 sm:text-sm ${
          activeRole === 'artisan' ? 'text-emerald-500' : 'text-emerald-500/50'
        }`}
      >
        ARTISAN
      </button>
    </div>
  )
}
