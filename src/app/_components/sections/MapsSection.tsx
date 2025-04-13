"use client"
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api"

const containerStyle = {
  width: "100%",
  height: "400px",
}

const center = {
  lat: 45.451188,
  lng: 9.241651,
}

export default function MapsSection() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  if (loadError) return <p>Errore nel caricamento della mappa</p>
  if (!isLoaded) return <p>Caricamento in corso...</p>

  return (
    <div className="w-full">
      <h2 className="poppins-semibold text-xl sm:text-3xl mb-8">Dove siamo</h2>
      <div className="rounded-lg mb-8 overflow-hidden h-[250px] sm:h-[300px] md:h-[400px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2799.9821302969377!2d9.2326!3d45.4554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c6a6e1b835a3%3A0x2d8f95f69e4692e9!2sVia%20Oreste%20Salomone%2C%2061%2C%2020138%20Milano%20MI!5e0!3m2!1sit!2sit!4v1617289345678!5m2!1sit!2sit"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <h4 className="text-lg sm:text-xl poppins-medium mt-4 mb-2">Via Oreste Salomone, 61, 20138 Milano (MI)</h4>
      <p className="text-gray-400">
        Una volta arrivati all'entrata dello stabile, citofonare al citofono Cashmere Studio.
      </p>
    </div>
  )
}

