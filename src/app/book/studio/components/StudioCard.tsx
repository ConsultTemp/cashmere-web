"use client"

import { Calendar } from "lucide-react"
import Image from "next/image"

interface StudioCardProps {
  id: string
  name: string
  description: string
  image: string
  isSelected?: boolean
  isUnavailable?: boolean
  unavailabilityInfo?: {
    alternativeDates: Array<{
      date: string
      timeRange: string
    }>
    message?: string
  }
  onSelect?: () => void
  onSelectAlternativeSlot?: (alt: { date: string; timeRange: string }) => void
}

export function StudioCard({
  id,
  name,
  description,
  image,
  isSelected,
  isUnavailable,
  unavailabilityInfo,
  onSelect,
  onSelectAlternativeSlot,
}: StudioCardProps) {
  return (
    <div
      className={`
        relative rounded-lg border transition-all
        ${isUnavailable ? "opacity-80 cursor-default pb-6 sm:pb-8" : "cursor-pointer hover:bg-muted/50"}
        ${isSelected && !isUnavailable ? "border-black" : "border-border"}
      `}
      onClick={() => !isUnavailable && onSelect?.()}
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Checkbox circle */}
          <div className="flex-shrink-0 flex items-center justify-center sm:justify-start">
            <div
              className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center
                ${isSelected && !isUnavailable ? "bg-black border-black text-white" : "border-gray-300"}
              `}
            >
              {isSelected && !isUnavailable && (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current" strokeWidth={3}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center sm:text-left flex flex-col items-start justify-center">
            <h3 className="text-xl sm:text-2xl poppins-semibold">{name}</h3>
            <p className=" mt-1 text-sm text-gray-400">
              {description.length > 100 ? description.slice(0, 100) + "..." : description}
            </p>
          </div>

          {/* Image */}
          <div className="flex-shrink-0 w-full sm:w-64 h-40 relative rounded-lg overflow-hidden mx-auto sm:mx-0">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>
        </div>

        {/* Unavailability info */}
        {isUnavailable && unavailabilityInfo && (
          <div className="mt-2">
            <p className="text-red-500">{unavailabilityInfo.message || `${name} non è disponibile nella fascia oraria selezionata.`}</p>
            {unavailabilityInfo.alternativeDates && unavailabilityInfo.alternativeDates.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Orari alternativi disponibili:</p>
                <div className="mt-1 space-y-1">
                  {unavailabilityInfo.alternativeDates.map((alt, i) => (
                    <div
                      key={i}
                      className="text-sm p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center"
                      onClick={() => onSelectAlternativeSlot && onSelectAlternativeSlot(alt)}
                    >
                      <span className="mr-2"><Calendar className="w-4 h-4"/></span> {alt.date} {alt.timeRange}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
