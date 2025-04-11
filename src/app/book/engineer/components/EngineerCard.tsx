"use client"

interface EngineerCardProps {
  name: string
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

export function EngineerCard({
  name,
  isSelected,
  isUnavailable,
  unavailabilityInfo,
  onSelect,
  onSelectAlternativeSlot,
}: EngineerCardProps) {
  return (
    <div className="w-full">
      {!isUnavailable ? (
        <div
          onClick={onSelect}
          className={`
              w-full p-3 sm:p-4 rounded-lg border transition-all cursor-pointer
              flex items-center justify-between
              ${isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}
            `}
        >
          <span className="text-base sm:text-lg">{name}</span>
          <div
            className={`
                w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center
                ${isSelected && !isUnavailable ? "bg-primary border-primary text-white" : "border-gray-300"}
              `}
          >
            {isSelected && !isUnavailable && (
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5 stroke-current" strokeWidth={3}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full rounded-lg border p-6 opacity-80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg text-gray-400">{name}</span>
            <div className="w-6 h-6 rounded-full bg-muted" />
          </div>

          {isUnavailable && unavailabilityInfo && (
            <div className="mt-2 text-red-500">
              {unavailabilityInfo.message || `${name} non è disponibile nella fascia oraria selezionata.`}
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
                        <span className="mr-2">📅</span> {alt.date} {alt.timeRange}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
