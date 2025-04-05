"use client"

interface EngineerCardProps {
  name: string
  isSelected?: boolean
  isUnavailable?: boolean
  unavailabilityInfo?: {
    message: string
    alternativeDates: Array<{
      date: string
      timeRange: string
    }>
  }
  onSelect?: () => void
}

export function EngineerCard({ name, isSelected, isUnavailable, unavailabilityInfo, onSelect }: EngineerCardProps) {
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

          {unavailabilityInfo && (
            <div className="space-y-4">
              <p className="text-gray-700">{unavailabilityInfo.message}</p>

              <div>
                <p className="font-medium mt-4">Date libere suggerite</p>
                <div className="flex gap-4 mt-2">
                  {unavailabilityInfo.alternativeDates.map((date, i) => (
                    <div key={i} className="px-4 py-2 bg-muted rounded-md text-sm">
                      {date.date} / {date.timeRange}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

