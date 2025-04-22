"use client"

import { useState, useRef, useEffect } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { Button } from "@/components/Button"
import { Calendar } from "@/components/Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import { AvailabilityCalendar } from "./components/AvailabilityCalendar"
import { useUser } from "@/hooks/useUser"
import { useHoliday } from "@/hooks/useHoliday"
import { useUserStore } from "@/store/user-store"
import EngineersAvailabilityCalendar from "./components/EngineersAvailabilityCalendar"

export default function AvailabilityPage() {
  const { user } = useUserStore()
  const [view, setView] = useState<"timeGridDay" | "timeGridWeek">("timeGridWeek")
  const [date, setDate] = useState<Date>(new Date())
  const [selectedEngineer, setSelectedEngineer] = useState<string>(user?.role == "ENGINEER" ? user?.id : "")
  const [engineers, setEngineers] = useState<Array<{ id: string; name: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)

  const calendarRef = useRef(null)
  const { getEngineers } = useUser()
  const { getUserHolidays } = useHoliday()

  // Load engineers on component mount
  useEffect(() => {
    const loadEngineers = async () => {
      try {
        setIsLoading(true)
        console.log("Chiamata a getEngineers...")
        const data = await getEngineers()
        console.log("Risposta da getEngineers:", data)

        // Gestisci il caso in cui data è null o undefined
        if (data && Array.isArray(data) && data.length > 0) {
          setEngineers(data)
          // Imposta l'ingegnere selezionato solo se non è già impostato
          if (!selectedEngineer && data.length > 0) {
            setSelectedEngineer(data[0].id)
          }
        } else {
          console.error("Nessun ingegnere trovato o risposta non valida")
          setEngineers([])
        }
      } catch (error) {
        console.error("Error loading engineers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEngineers()
  }, [])

  const handleViewChange = (newView: "timeGridDay" | "timeGridWeek") => {
    setView(newView)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date)
      if (calendarRef.current) {
        // @ts-ignore - FullCalendar methods
        calendarRef.current.getApi().gotoDate(date)
      }
    }
  }

  const handlePrevClick = () => {
    if (calendarRef.current) {
      // @ts-ignore - FullCalendar methods
      calendarRef.current.getApi().prev()
      // @ts-ignore - FullCalendar methods
      setDate(calendarRef.current.getApi().getDate())
    }
  }

  const handleNextClick = () => {
    if (calendarRef.current) {
      // @ts-ignore - FullCalendar methods
      calendarRef.current.getApi().next()
      // @ts-ignore - FullCalendar methods
      setDate(calendarRef.current.getApi().getDate())
    }
  }

  const handleTodayClick = () => {
    if (calendarRef.current) {
      // @ts-ignore - FullCalendar methods
      calendarRef.current.getApi().today()
      // @ts-ignore - FullCalendar methods
      setDate(calendarRef.current.getApi().getDate())
    }
  }

  // Mock stats data
  const stats = {
    availability: view === "timeGridDay" ? 13 : 78,
    sessions: view === "timeGridDay" ? 9 : 33,
    holidays: view === "timeGridDay" ? 0 : 12,
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Caricamento...</div>
  }

  // Gestisci il caso in cui engineers è vuoto
  const engineerOptions = engineers && engineers.length > 0 ? engineers : []
  //@ts-ignore
  const selectedEngineerName = engineerOptions.find((eng) => eng.id === selectedEngineer)?.username || ""

  return (
    <div className="bg-white p-0 md:p-6 lg:p-8 py-12">
      <div className="mx-auto">
        <div className="mb-6 flex flex-col space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-md px-4 py-2 text-sm font-medium" onClick={handleTodayClick}>
                Oggi
              </Button>
              <div className="">
              <Button
                variant={isEditMode ? "default" : "outline"}
                onClick={isEditMode ? () => setIsEditMode(false) : () => setIsEditMode(true)}
                className={isEditMode ? "bg-emerald-500 hover:bg-emerald-600 rounded-md" : "bg-black border-black text-white hover:bg-black-90 hover:text-white rounded-md"}
                disabled={isLoading}
              >
                {isEditMode ? "Salva modifiche" : "Modifica disponibilità"}
              </Button>
            </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handlePrevClick}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-semibold">{format(date,"MMMM yyyy", { locale: it }).charAt(0).toUpperCase() + 
                format(date,"MMMM yyyy", { locale: it }).slice(1)}</h2>
              <Button variant="ghost" size="icon" onClick={handleNextClick}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {user?.role != "ENGINEER" && engineerOptions.length > 0 && (
                <Select value={selectedEngineer} onValueChange={setSelectedEngineer}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Seleziona fonico" />
                  </SelectTrigger>
                  <SelectContent>
                    {engineerOptions.filter((e) => e.id != 'cm8z06fn00002mytvfftqrkgx' && e.id != "cm9pobzca000018y2aatml5bm").map((engineer) => (
                      <SelectItem key={engineer.id} value={engineer.id}>
                        {/* @ts-ignore */}
                        {engineer.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-gray-100 border-0">
                    <CalendarIcon className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  {/* @ts-ignore */}
                  <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white">
          {selectedEngineer && (
            <AvailabilityCalendar
              ref={calendarRef}
              view={"timeGridWeek"}
              onViewChange={handleViewChange}
              selectedEngineer={selectedEngineer}
              date={date}
              engineerName={selectedEngineerName}
              isEditMode={isEditMode}
            />
          )}
        </div>
        <div>
          <EngineersAvailabilityCalendar/>
        </div>
      </div>
    </div>
  )
}

