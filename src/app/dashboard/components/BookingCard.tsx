import Image from "next/image"
import { Card, CardContent } from "@/components/Card"
import type { Booking } from "@/types/booking"
import { studios } from "@/lib/studios"

interface BookingCardProps {
  booking: Booking
}

export function BookingCard({ booking }: BookingCardProps) {
  const studio = studios.find((s) => s.dbId === booking.studioId)
  return (
    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
      <CardContent className="p-0">
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <Image
            src={studio?.imagesUrl[0] || "/placeholder.svg"}
            alt={studio?.name || "Studio"}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg">{studio?.name || `Studio ${booking.studio.value}`}</h3>
          <p className="text-muted-foreground">{new Date(booking.start).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  )
}

