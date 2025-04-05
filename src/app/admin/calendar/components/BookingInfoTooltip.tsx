"use client"

import { useEffect, useRef } from "react"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import type { CalendarEvent } from "../types/booking"
import { Calendar, Clock, MapPin, User } from "lucide-react"
import { getMockUsers, getMockFonici, getMockStudios, getMockServices } from "../lib/data"

interface BookingInfoTooltipProps {
  event: CalendarEvent
  position: { x: number; y: number }
  onClose: () => void
}

export function BookingInfoTooltip({ event, position, onClose }: BookingInfoTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  console.log(event)
  const users = getMockUsers()
  const fonici = getMockFonici()
  const studios = getMockStudios()
  const services = getMockServices()

  const user = users.find((u) => u.id === event.userId)
  const fonico = fonici.find((f) => f.id === event.fonicoId)
  const studio = studios.find((s) => s.id === event.studioId)
  const eventServices = services.filter((s) => event.services.includes(s.id))

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      ref={tooltipRef}
      className="absolute z-50 rounded-md border border-border bg-card p-4 shadow-md"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: "translate(10px, -50%)",
        maxWidth: "300px",
      }}
    >
      <div className="space-y-3">
        <h3 className="font-medium">{user?.name}</h3>

        <div className="flex items-start gap-2 text-sm">
          <Calendar className="h-4 w-4 mt-0.5 text-primary" />
          <div>
            <p className="font-medium">Data e Ora</p>
            <p>{format(event.start, "EEEE d MMMM yyyy", { locale: it })}</p>
            <p>
              {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <User className="h-4 w-4 mt-0.5 text-primary" />
          <div>
            <p className="font-medium">Fonico</p>
            <p>{event.fonico.username}</p>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 mt-0.5 text-primary" />
          <div>
            <p className="font-medium">Studio</p>
            <p>Studio {event.studio.value}</p>
          </div>
        </div>

        {event.services.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <Clock className="h-4 w-4 mt-0.5 text-primary" />
            <div>
              <p className="font-medium">Servizi</p>
              <ul className="list-disc pl-4">
                {event.services.map((service) => (
                  <li key={service.id}>{service.name}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {event.notes && (
          <div className="pt-2 border-t border-border">
            <p className="font-medium text-sm mb-1">Note</p>
            <p className="text-sm">{event.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

