'use client'

import { forwardRef } from 'react'

const AuthInput = forwardRef(
  ({ label, icon: Icon, type = 'text', placeholder, error, ...props }, ref) => {
    return (
      <div className="group flex w-full flex-col gap-1.5">
        {label && (
          <label className="px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 sm:text-xs sm:tracking-widest">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3 text-gray-300 transition-colors group-focus-within:text-emerald-400 sm:left-3.5">
              <Icon size={17} />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            autoComplete="off"
            className={`w-full rounded-2xl border bg-gray-50 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all sm:py-3 ${
              error
                ? 'border-red-300 focus:border-red-400'
                : 'border-gray-100 focus:border-primary/30'
            } focus:bg-white ${Icon ? 'pl-9 sm:pl-10' : 'px-3.5 sm:px-4'} pr-3.5 sm:pr-4`}
            {...props}
          />
        </div>
        {error ? (
          <p className="px-1 text-xs font-medium text-red-500">{error}</p>
        ) : null}
      </div>
    )
  }
)

AuthInput.displayName = 'AuthInput'

export default AuthInput
