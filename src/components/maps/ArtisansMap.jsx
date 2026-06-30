'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function ArtisansMap({ artisans = [], onBook }) {
  useEffect(() => {
    const L = require('leaflet')
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })
  }, [])

  return (
    <MapContainer
      center={[30.0444, 31.2357]}
      zoom={12}
      className="w-full h-[400px] rounded-xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {artisans.map((artisan) => (
        <Marker key={artisan.id} position={[artisan.location.lat, artisan.location.lng]}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold">{artisan.name}</h3>
              <p className="text-sm text-gray-500">{artisan.specialty}</p>
              <p className="text-sm text-yellow-500">★ {artisan.rating}</p>
              {onBook && (
                <button
                  onClick={() => onBook(artisan)}
                  className="mt-2 bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark"
                >
                  Quick Book
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
