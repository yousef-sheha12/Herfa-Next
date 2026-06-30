'use client'

import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'

export default function MapSearch({ onSearch, onFindNearby }) {
  const [filters, setFilters] = useState({
    category: '',
    location: '',
  })

  const handleSearch = () => {
    if (onSearch) onSearch(filters)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={filters.category}
          onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
          className="select select-bordered w-full sm:w-48 bg-white text-gray-900"
        >
          <option value="">All Services</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
          <option value="Carpentry">Carpentry</option>
          <option value="Painting">Painting</option>
          <option value="Cleaning">Cleaning</option>
        </select>
        <div className="relative flex-1">
          <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Enter your location..."
            value={filters.location}
            onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
            className="input input-bordered w-full pl-10 bg-white text-gray-900"
          />
        </div>
        <button onClick={handleSearch} className="btn bg-primary text-white hover:bg-primary-dark">
          <Search size={18} />
          Search
        </button>
      </div>
      {onFindNearby && (
        <button onClick={onFindNearby} className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white w-full">
          <MapPin size={18} />
          Find Artisans Near Me
        </button>
      )}
    </div>
  )
}
