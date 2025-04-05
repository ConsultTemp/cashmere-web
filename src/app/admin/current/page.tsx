"use client"

import { Button } from "@/components/Button"
import { CardContent, Card } from "@/components/Card"
import { Badge } from "@/components/Badge"
import { Calendar, Phone } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { studios } from "@/lib/types"
import { useUser } from "@/hooks/useUser"
import Link from "next/link"
import { useBooking } from "@/hooks/useBooking"
import type { Booking } from "@/types/booking"
import { format, parseISO } from "date-fns"
import { it } from "date-fns/locale"
import { studios as studioData } from "@/lib/studios"

interface Studio {
  id: string
  name: string
}
interface Engineer {
  id: string
  username: string
}

interface TimeSlot {
  start: string
  end: string
}

interface AvailabilityDay {
  date: string
  slots: TimeSlot[]
  isUnavailable?: boolean
}

export default function CurrentPage() {
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [availability, setAvailability] = useState<AvailabilityDay[]>([])
  const [currentBookings, setCurrentBookings] = useState([])
  const [selectedStudio, setSelectedStudio] = useState<string>("a9xgk7yq34mnp0z2vwsdl5btc")
  const [selectedEngineer, setSelectedEngineer] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { getEngineers } = useUser()
  const { getCurrentBookings, getAvailableTimeSlots } = useBooking()

  // Load engineers on component mount
  useEffect(() => {
    const loadEngineers = async () => {
      try {
        const data = await getEngineers()
        setEngineers(data)
        console.log(data)
        if (data.length > 0) {
          setSelectedEngineer(data[0].id)
        }
      } catch (error) {
        console.error("Error loading engineers:", error)
      }
    }

    const loadCurrent = async () => {
      try {
        const data = await getCurrentBookings()
        setCurrentBookings(data)
        console.log(data)
      } catch (error) {
        console.error("Error loading current bookings:", error)
      }
    }
    loadCurrent()
    loadEngineers()
  }, [])

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedStudio || !selectedEngineer) return

      setIsLoading(true)
      try {
        const data = await getAvailableTimeSlots(selectedStudio, selectedEngineer)
        setAvailability(data)
        console.log("Available time slots:", data)
      } catch (error) {
        console.error("Error fetching availability:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvailability()
  }, [selectedStudio, selectedEngineer])

  const renderStudioCard = (studio: Studio, booking: Booking | null) => (
    <Card className="border" key={studio.id}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md overflow-hidden">
              <Image
               //@ts-ignore
                src={studioData.find(s => s.dbId == studio.id)?.imagesUrl[0]}
                width={40}
                height={40}
                alt={studio.name}
                className="object-cover"
              />
            </div>
            <span className="font-bold text-lg">{studio.name}</span>
          </div>
          <Badge
            className={
              !booking || !booking.id
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-red-500 text-white hover:bg-red-600"
            }
          >
            {!booking || !booking.id ? "Libero" : "Occupato"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 mb-1  whitespace-nowrap">
               {/*  @ts-ignore */}
              Artista: {booking && booking.user.username && <span className="text-black">{booking.user.username}</span>}
            </p>
            <p className="text-gray-500 mb-1">
              Inizio:{" "}
              {booking && booking.start && (
                <span className="text-black">
                  {new Date(booking.start).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">
              Fine:{" "}
              {booking && booking.end && (
                <span className="text-black">
                  {new Date(booking.end).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </p>
            <p className="text-gray-500 mb-1 whitespace-nowrap">
              Fonico:{" "}
              {booking && (
                <span className="text-black">
                  {booking && booking.fonico ? booking?.fonico.username : "Senza fonico"}
                </span>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString)
    return format(date, "EEEE, d/MM", { locale: it })
  }

  return (
    <div className="py-8 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Bentornato</h1>
          <p className="text-gray-500 text-sm">admin@gmail.com</p>
        </div>
      </div>

      {/* Cards section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/calendar">
          <Card className="bg-gray-100">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Calendario studi</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/confirm">
          <Card className="bg-gray-100">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-medium">Conferma prenotazioni</span>
                <p className="text-sm text-gray-500">2 nuove</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/availability">
          <Card className="bg-gray-100">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Panoramica fonici</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Stato studi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studios.map((s) =>
            renderStudioCard(
              s,
               //@ts-ignore
              currentBookings.find((b) => b.studioId == s.id),
            ),
          )}
        </div>
      </div>

      {/* Quick availability check */}
      <div>
        <h2 className="text-lg font-bold mb-4">Verifica rapida disponibilità</h2>

        <div className="mb-6">
          <p className="mb-2">Seleziona studio</p>
          <div className="flex flex-wrap gap-2">
            {studios.map((studio) => (
              <Button
                key={studio.id}
                onClick={() => setSelectedStudio(studio.id)}
                className={`rounded-full ${
                  selectedStudio === studio.id
                    ? "bg-black text-white hover:bg-black/90"
                    : "bg-white text-black border border-[1px] border-black hover:bg-gray-200"
                }`}
              >
                {studio.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-2">Seleziona fonico</p>
          <div className="flex flex-wrap gap-2">
            {engineers.map((engineer) => (
              <Button
                key={engineer.id}
                onClick={() => setSelectedEngineer(engineer.id)}
                className={`rounded-full ${
                  selectedEngineer === engineer.id
                    ? "bg-black text-white hover:bg-black/90"
                    : "bg-white text-black border border-[1px] border-black hover:bg-gray-200"
                }`}
              >
                {engineer.username}
              </Button>
            ))}
          </div>
        </div>

        {/* Availability table */}
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left font-medium">Data</th>
                <th className="p-4 text-left font-medium">Fascia oraria disponibile</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={2} className="p-4 text-center">
                    Caricamento disponibilità...
                  </td>
                </tr>
              ) : availability.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-4 text-center">
                    Seleziona uno studio e un fonico per vedere la disponibilità
                  </td>
                </tr>
              ) : (
                availability.map((day) => (
                  <tr key={day.date} className={`border-b ${day.isUnavailable ? "bg-red-500 text-white" : ""}`}>
                    <td className="p-4">{formatDate(day.date)}</td>
                    <td className="p-4">
                      {!day.isUnavailable && (
                        <div className="flex gap-2 flex-wrap">
                          {day.slots.map((slot, index) => (
                            <Badge key={index} variant="outline" className="bg-white">
                              {slot.start} - {slot.end}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

