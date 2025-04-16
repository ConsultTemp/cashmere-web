"use client"

import { useState, useRef, useEffect } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Calendar } from "@/components/Calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover"
import { Button } from "@/components/Button"
import { BookingCalendar } from "./components/Calendar"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { studios } from "@/lib/types"
import { useUser } from "@/hooks/useUser"
import { useUserStore } from "@/store/user-store"

export default function CalendarPage() {
  const { user } = useUserStore()
  const [view, setView] = useState<"timeGridDay" | "timeGridWeek" | "dayGridMonth">("timeGridWeek")
  const [selectedStudio, setSelectedStudio] = useState<string>("all")
  const [selectedFonico, setSelectedFonico] = useState<string>(user.role == "ENGINEER" ? user.id : "all")
  const [date, setDate] = useState<Date>(new Date())
  const [engineers, setEngineers] = useState<any[]>([])
  const calendarRef = useRef(null)

  // Call the getEngineers function from the useUser hook when the component mounts
  const { getEngineers } = useUser()

  useEffect(() => {
    const fetchEngineers = async () => {
      const engns = await getEngineers()
      console.log(engns)
      setEngineers(engns)
    }

    fetchEngineers()
  }, [])

  const handleViewChange = (newView: "timeGridDay" | "timeGridWeek" | "dayGridMonth") => {
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

  return (
    <div className="bg-white mx-auto py-24 sm:py-6 md:py-36 px-0 sm:px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-4 sm:mb-6 flex flex-col space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={view === "timeGridDay" ? "light_blue" : "gray"}
                className="rounded-md px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium"
                onClick={() => handleViewChange("timeGridDay")}
              >
                Giorno
              </Button>
              <Button
                variant={view === "timeGridWeek" ? "light_blue" : "gray"}
                className="rounded-md px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium"
                onClick={() => handleViewChange("timeGridWeek")}
              >
                Settimana
              </Button>
              <Button
                variant={view === "dayGridMonth" ? "light_blue" : "gray"}
                className="rounded-md px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium"
                onClick={() => handleViewChange("dayGridMonth")}
              >
                Mese
              </Button>
              <Button
                variant="outline"
                className="rounded-md px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium"
                onClick={handleTodayClick}
              >
                Oggi
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handlePrevClick}>
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <h2 className="text-sm sm:text-base md:text-xl font-semibold">
                {format(date, view === "dayGridMonth" ? "MMMM yyyy" : "MMMM yyyy", { locale: it }).charAt(0).toUpperCase() + 
                format(date, view === "dayGridMonth" ? "MMMM yyyy" : "MMMM yyyy", { locale: it }).slice(1)}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleNextClick}>
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select value={selectedStudio} onValueChange={setSelectedStudio}>
                <SelectTrigger className="w-full sm:w-[140px] text-xs sm:text-sm">
                  <SelectValue placeholder="Studio 1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti gli studi</SelectItem>
                  {studios.map((studio) => {
                    return (
                      <SelectItem key={studio.id} value={studio.id}>
                        {studio.name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              {user.role != "ENGINEER" && (
                <Select value={selectedFonico} onValueChange={setSelectedFonico}>
                  <SelectTrigger className="w-full sm:w-[140px] text-xs sm:text-sm">
                    <SelectValue placeholder="Fonico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i fonici</SelectItem>
                    {engineers.map((en) => {
                      return (
                        <SelectItem key={en.id} value={en.id}>
                          {en.username}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="gray" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                    <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
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

        <div className="h-[calc(100vh-180px)] sm:h-[calc(100vh-160px)]">
          <BookingCalendar
            ref={calendarRef}
            view={view}
            selectedStudio={selectedStudio}
            selectedFonico={selectedFonico}
            canEdit={user.role !== "ENGINEER"}
          />
        </div>
      </div>
    </div>
  )
}

