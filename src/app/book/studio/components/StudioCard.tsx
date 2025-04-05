"use client"

import Image from "next/image"
import Link from "next/link"
import type { Studio } from "@/store/booking-store"

interface StudioCardProps {
  id: Studio
  name: string
  description: string
  image: string
  isSelected?: boolean
  isUnavailable?: boolean
  unavailabilityInfo?: {
    occupiedTime: string
    alternativeDates: Array<{
      date: string
      timeRange: string
    }>
  }
  onSelect?: (id: Studio) => void
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
}: StudioCardProps) {
  return (
    <div
      className={`
        relative rounded-lg border transition-all
        ${isUnavailable ? "opacity-80 cursor-default pb-6 sm:pb-8" : "cursor-pointer hover:bg-muted/50"}
        ${isSelected && !isUnavailable ? "border-primary" : "border-border"}
      `}
      onClick={() => !isUnavailable && onSelect?.(id)}
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Checkbox circle */}
          <div className="flex-shrink-0 flex items-center justify-center sm:justify-start">
            <div
              className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center
                ${isSelected && !isUnavailable ? "bg-primary border-primary text-white" : "border-gray-300"}
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
          <div className="flex-grow text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">{name}</h3>
            <p className="text-gray-700 mt-1 text-sm sm:text-base">
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
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <p className="text-gray-700 text-sm sm:text-base">
              Lo {name} è occupato nella fascia oraria e nel giorno da te scelto
              <br />
              {unavailabilityInfo.occupiedTime}{" "}
              <Link href="/book/datetime" className="text-primary underline ml-2 sm:ml-4">
                Seleziona nuova data
              </Link>
            </p>

            <div className="space-y-2">
              <p className="font-medium text-sm sm:text-base">Date libere suggerite</p>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {unavailabilityInfo.alternativeDates.map((date, i) => (
                  <div key={i} className="px-3 py-1 sm:px-4 sm:py-2 bg-muted rounded-md text-xs sm:text-sm">
                    {date.date} / {date.timeRange}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

