"use client"

interface EngineerCardProps {
  name: string
  id: string
  isSelected?: boolean
  isUnavailable?: boolean
  unavailabilityInfo?: {
    alternativeDates: Array<{
      date: string
      timeRange: string
      studios?: string[]
    }>
    message?: string
  }
  onSelect?: () => void
  onSelectAlternativeSlot?: (alt: { date: string; timeRange: string }, engineerId: string, studioId?: string) => void
}
import { studios } from "@/lib/studios"
import { useBookingStore } from "@/store/booking-store"
export function EngineerCard({
  name,
  id,
  isSelected,
  isUnavailable,
  unavailabilityInfo,
  onSelect,
  onSelectAlternativeSlot,
}: EngineerCardProps) {
  console.log("unavailability my slatt")

  const { selectedStudio } = useBookingStore()
  console.log(selectedStudio)
  return (
    <div className="w-full">
      {!isUnavailable ? (
        <div
          onClick={onSelect}
          className={`
              w-full p-3 sm:p-8 rounded-lg border transition-all cursor-pointer
              flex items-center justify-between
              ${isSelected ? "border-black bg-black/5" : "border-border hover:bg-muted/50"}
            `}
        >
          <span className="text-base">{name}</span>
          <div
            className={`
                w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center
                ${isSelected && !isUnavailable ? "bg-black border-black text-white" : "border-gray-300"}
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
        <div className="w-full rounded-lg border p-3 sm:p-8 opacity-80">
          <div className="flex items-center justify-between ">
            <span className="text-base text-gray-400">{name}</span>
            <div className="w-6 h-6 rounded-full bg-muted" />
          </div>

          {isUnavailable && unavailabilityInfo && (
            <div>
              <p className="text-red-500 text-sm">{unavailabilityInfo.message || `${name} non è disponibile nella fascia oraria selezionata.`}</p>
              {/* {unavailabilityInfo.alternativeDates.map((alt, i) => (
                <div
                  key={i}
                  className="text-sm p-2 cursor-pointer rounded flex items-center flex flex-row"
                >
                  <span className="mr-2">📅</span> {alt.date} {alt.timeRange}
                  <div className="flex flex-row flex-wrap items-center gap-2 mx-2">
                    {(selectedStudio && !alt.studios?.includes(selectedStudio)) &&
                      alt.studios && alt.studios.map((s) => {
                        const studioname = studios.find((st) => st.dbId == s)
                        if (!(studioname && studioname.dbId)) { return null }
                        return <p onClick={() => onSelectAlternativeSlot && onSelectAlternativeSlot(alt, id, s)} className="py-1 px-2 bg-gray-100 text-black hover:bg-gray-200 rounded-sm" key={s}>{studioname.name}</p>
                      })
                    }
                    {!(selectedStudio && !alt.studios?.includes(selectedStudio)) && <p className="py-1 px-2 bg-gray-100 text-black  hover:bg-gray-200 rounded-sm" onClick={() => onSelectAlternativeSlot && onSelectAlternativeSlot(alt, id)}>Seleziona</p>}
                  </div>
                </div>
              ))} */}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
