"use client"

import { Button } from "@/components/Button"
import { CardContent, Card } from "@/components/Card"
import { Badge } from "@/components/Badge"
import { CalendarDays, CopyCheck, Users } from "lucide-react"
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
import { useUserStore } from "@/store/user-store"

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
  const { user } = useUserStore()
  const { getCurrentBookings, getAvailableTimeSlots } = useBooking()
  // Add a new state for tracking when "All engineers" is selected
  const [showAllEngineers, setShowAllEngineers] = useState(false)

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

  // Modify the useEffect that fetches availability to handle the "All engineers" case
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedStudio) return

      setIsLoading(true)
      try {
        if (showAllEngineers) {
          // Fetch availability for all engineers
          const allAvailabilities = []

          for (const engineer of engineers) {
            if(engineer.id == "cm8z06fn00002mytvfftqrkgx" || engineer.id == "cm9pobzca000018y2aatml5bm"){
              continue
            }
            const data = await getAvailableTimeSlots(selectedStudio, engineer.id)
            // Add engineer info to each slot
            //@ts-ignore
            const dataWithEngineer = data.map((day) => ({
              ...day,
              engineerName: engineer.username,
              engineerId: engineer.id,
            }))
            allAvailabilities.push(dataWithEngineer)
          }

          // Combine all availabilities by date
          const combinedAvailability = combineAvailabilities(allAvailabilities)
          setAvailability(combinedAvailability)
        } else {
          // Fetch availability for selected engineer
          const data = await getAvailableTimeSlots(selectedStudio, selectedEngineer)
          setAvailability(data)
        }
      } catch (error) {
        console.error("Error fetching availability:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvailability()
  }, [selectedStudio, selectedEngineer, showAllEngineers, engineers])

  // Add a helper function to combine availabilities
  //@ts-ignore
  const combineAvailabilities = (allAvailabilities) => {
    const dateMap = new Map()
  
    // Primo passaggio: raccogli tutte le date e inizializza la mappa
    //@ts-ignore
    allAvailabilities.forEach((engineerAvailability) => {
      if (!engineerAvailability || !engineerAvailability.length) return
      //@ts-ignore
      engineerAvailability.forEach((day) => {
        if (!dateMap.has(day.date)) {
          dateMap.set(day.date, {
            date: day.date,
            slots: [],
            unavailableEngineers: [], // Traccia i fonici non disponibili
            totalEngineers: 0 // Traccia il numero totale di fonici per questa data
          })
        }
        
        const dateEntry = dateMap.get(day.date)
        dateEntry.totalEngineers++
        
        // Se il fonico è indisponibile, aggiungi al conteggio ma non aggiungere slot
        if (day.isUnavailable) {
          dateEntry.unavailableEngineers.push(day.engineerName)
        }
        // Altrimenti, aggiungi gli slot con il nome del fonico
        else {
          //@ts-ignore
          day.slots.forEach((slot) => {
            dateEntry.slots.push({
              ...slot,
              engineerName: day.engineerName
            })
          })
        }
      })
    })
    
    // Secondo passaggio: determina se un giorno è completamente indisponibile
    // e rimuovi le proprietà di tracciamento temporanee
    dateMap.forEach((entry) => {
      // Il giorno è indisponibile solo se tutti i fonici sono indisponibili
      entry.isUnavailable = entry.unavailableEngineers.length === entry.totalEngineers
      
      // Rimuovi le proprietà di tracciamento
      delete entry.unavailableEngineers
      delete entry.totalEngineers
    })
  
    // Converti mappa in array e ordina per data
    return Array.from(dateMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }

  const renderStudioCard = (studio: Studio, booking: Booking | null) => (
    <Card className="border" key={studio.id}>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 relative rounded-xl overflow-hidden">
              <Image
                //@ts-ignore
                src={studioData.find((s) => s.dbId == studio.id)?.imagesUrl[0] || "/placeholder.svg"}
                alt={studio.name}
                fill
                className="object-cover"
              />
            </div>

            <span className="font-bold text-2xl poppins-semibold">{studio.name}</span>
          </div>
          <Badge
            className={
              !booking || !booking.id
                ? "bg-green-500 text-white hover:bg-green-600 px-3 py-1"
                : "bg-red-500 text-white hover:bg-red-600 px-3 py-1"
            }
          >
            {!booking || !booking.id ? "Libero" : "Occupato"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1  whitespace-nowrap">
              {/*  @ts-ignore */}
              Artista:{" "}
              {/*  @ts-ignore */}
              {booking && booking.user.username && (
                //@ts-ignore
                <span className="text-black poppins-medium">{booking.user.username}</span>
              )}
            </p>
            <p className="text-gray-500 mb-1">
              Inizio:{" "}
              {booking && booking.start && (
                <span className="text-black  poppins-medium">
                  {new Date(booking.start).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">
              Fine:{" "}
              {booking && booking.end && (
                <span className="text-black poppins-medium">
                  {new Date(booking.end).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </p>
            <p className="text-gray-500 mb-1 whitespace-nowrap">
              Fonico:{" "}
              {booking && (
                <span className="text-black poppins-medium">
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
          <h1 className="text-4xl poppins-semibold">Bentornato</h1>
          <p className="text-gray-500 text-sm">{user.username}</p>
        </div>
      </div>

      {/* Cards section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Calendario studi */}
        <Link href="/admin/calendar">
          <Card className="group bg-gray-100 border-0 py-3 rounded-lg transition-colors duration-300 hover:bg-blue-500">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-800 group-hover:text-white transition-colors duration-300">
                Calendario studi
              </span>
            </CardContent>
          </Card>
        </Link>

        {/* Conferma prenotazioni */}
        <Link href="/admin/confirm">
          <Card className="group bg-gray-100 border-0 py-3 rounded-lg transition-colors duration-300 hover:bg-green-500">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <CopyCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-800 group-hover:text-white transition-colors duration-300">
                Conferma prenotazioni
              </span>
            </CardContent>
          </Card>
        </Link>

        {/* Panoramica fonici */}
        <Link href="/admin/availability">
          <Card className="group bg-gray-100 border-0 py-3 rounded-lg transition-colors duration-300 hover:bg-purple-500">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-800 group-hover:text-white transition-colors duration-300">
                Panoramica fonici
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-lg poppins-semibold mb-4">Stato studi</h2>
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
        <h2 className="text-lg poppins-semibold mb-4">Verifica rapida disponibilità</h2>

        <div className="flex flex-col md:flex-row">
          <div className="mb-6 w-full md:w-1/2">
            <p className="mb-2 text-sm">Seleziona studio</p>
            <div className="flex flex-wrap gap-2">
              {studios.map((studio) => (
                <Button
                  key={studio.id}
                  onClick={() => setSelectedStudio(studio.id)}
                  className={`rounded-full ${
                    selectedStudio === studio.id
                      ? "bg-black text-white hover:bg-black/90 py-[1px] px-5"
                      : "bg-gray-100 text-black hover:bg-gray-200  py-[1px] px-5"
                  }`}
                >
                  {studio.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-6 w-full md:w-1/2">
            <p className="mb-2 text-sm">Seleziona fonico</p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  setShowAllEngineers(true)
                  setSelectedEngineer("")
                }}
                className={`rounded-full ${
                  showAllEngineers
                    ? "bg-black text-white hover:bg-black/90"
                    : "bg-white text-black border border-[1px] border-black hover:bg-gray-200"
                }`}
              >
                Tutti i fonici
              </Button>
              {engineers.filter((e) => e.id != "cm8z06fn00002mytvfftqrkgx" && e.id != "cm9pobzca000018y2aatml5bm").map((engineer) => (
                <Button
                  key={engineer.id}
                  onClick={() => {
                    setSelectedEngineer(engineer.id)
                    setShowAllEngineers(false)
                  }}
                  className={`rounded-full ${
                    selectedEngineer === engineer.id && !showAllEngineers
                      ? "bg-black text-white hover:bg-black/90"
                      : "bg-white text-black border border-[1px] border-black hover:bg-gray-200"
                  }`}
                >
                  {engineer.username}
                </Button>
              ))}
            </div>
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
                  <tr key={day.date} className={`border-b ${day.isUnavailable ? "bg-red-50 text-red-600" : ""}`}>
                    <td className="p-4">{formatDate(day.date)}</td>
                    <td className="p-4">
                      {!day.isUnavailable && (
                        <div className="flex gap-2 flex-wrap">
                          {day.slots.map((slot, index) => (
                            <Badge key={index} variant="outline" className="bg-white text-sm rounded-sm">
                              {/* @ts-ignore */}
                              {showAllEngineers ? `${slot.engineerName}: ` : ""}
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
