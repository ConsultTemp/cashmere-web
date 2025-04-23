"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card"
import { useAvailability } from "@/hooks/useAvailability"
import { useBooking } from "@/hooks/useBooking"
import { useHoliday } from "@/hooks/useHoliday"
import { useUser } from "@/hooks/useUser"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useEffect, useState } from "react"
import { format, addMonths, parseISO, set } from "date-fns"

// Day abbreviation mapping
const dayAbbreviations = {
  monday: "mon",
  tuesday: "tue",
  wednesday: "wed",
  thursday: "thu",
  friday: "fri",
  saturday: "sat",
  sunday: "sun",
}

export default function EngineersAvailabilityCalendar() {
  const [count, setCount] = useState(1)
  const { getEngineers } = useUser()
  const { getWeeklyAvailability } = useAvailability()
  const { getEngineerBookings } = useBooking()
  const { getUserHolidays } = useHoliday()

  const [engineers, setEngineers] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: addMonths(new Date(), 1),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Recupero fonici...")
        const engineersData = await getEngineers()
        const engns = engineersData.filter(
          //@ts-ignore
          (eng) => eng.username != "Senza fonico" && eng.id != "cm9pobzca000018y2aatml5bm",
        )
        console.log("Fonici trovati: ", engns)
        setEngineers(engns)

        // Process each engineer's availability
        const availableEngineersMap = {}

        for (const engineer of engns) {
          try {
            // Get availability for this engineer
            const availabilities = await getWeeklyAvailability(engineer.id)

            // Get bookings for this engineer
            const bookings = await getEngineerBookings(engineer.id)

            // Get holidays for this engineer
            const holidays = await getUserHolidays(engineer.id)

            // Process each day in the date range
            const startDate = new Date()
            const endDate = addMonths(startDate, 1)

            // Loop through each day
            for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
              const dayOfWeek = format(day, "EEEE").toLowerCase()
              //@ts-ignore
              const dayAbbrev = dayAbbreviations[dayOfWeek]

              // Find availabilities for this day of week
              //@ts-ignore
              const dayAvailabilities = availabilities.filter((a) => a.day === dayAbbrev)

              if (dayAvailabilities.length === 0) {
                continue
              }

              // Process each availability for this day
              for (const availability of dayAvailabilities) {
                if (!availability.start || !availability.end) {
                  continue
                }

                try {
                  // Parse start and end times
                  const [startHour, startMinute] = availability.start.split(":").map(Number)
                  let [endHour, endMinute] = availability.end.split(":").map(Number)

                  // Handle end time crossing midnight
                  if (endHour < startHour) {
                    endHour += 24
                  }

                  // Process each hour in the availability range
                  for (let hour = startHour; hour < endHour; hour++) {
                    const slotStart = set(new Date(day), { hours: hour, minutes: 0, seconds: 0 })
                    const slotEnd = set(new Date(day), { hours: hour + 1, minutes: 0, seconds: 0 })

                    // FIXED: Check for booking conflicts for this specific hour
                    //@ts-ignore
                    const hasBookingConflict = bookings.some((booking) => {
                      if (!booking.start || !booking.end) {
                        return false
                      }

                      // IMPORTANT: Use exact hour comparison to avoid timezone issues
                      const bookingStartDate = new Date(booking.start)
                      const bookingEndDate = new Date(booking.end)

                      // Extract hours for direct comparison
                      const bookingStartHour = bookingStartDate.getHours()
                      const bookingEndHour = bookingEndDate.getHours()
                      const bookingStartDay = new Date(
                        bookingStartDate.getFullYear(),
                        bookingStartDate.getMonth(),
                        bookingStartDate.getDate(),
                      )
                      const bookingEndDay = new Date(
                        bookingEndDate.getFullYear(),
                        bookingEndDate.getMonth(),
                        bookingEndDate.getDate(),
                      )
                      const slotDay = new Date(slotStart.getFullYear(), slotStart.getMonth(), slotStart.getDate())

                      // Check if the booking is on the same day as the slot
                      const isSameStartDay = bookingStartDay.getTime() === slotDay.getTime()
                      const isSameEndDay = bookingEndDay.getTime() === slotDay.getTime()

                      // Only consider the booking if it's on the same day as the slot
                      if (!isSameStartDay && !isSameEndDay) {
                        return false
                      }

                      // Check if the current hour slot overlaps with the booking
                      // For same start day, check if hour >= booking start hour
                      // For same end day, check if hour < booking end hour
                      if (isSameStartDay && isSameEndDay) {
                        // Booking starts and ends on the same day as the slot
                        return hour >= bookingStartHour && hour < bookingEndHour
                      } else if (isSameStartDay) {
                        // Booking starts on the same day as the slot
                        return hour >= bookingStartHour
                      } else if (isSameEndDay) {
                        // Booking ends on the same day as the slot
                        return hour < bookingEndHour
                      }

                      return false
                    })

                    if (hasBookingConflict) {
                      continue // Skip this hour slot
                    }

                    // FIXED: Check for holiday conflicts for this specific hour
                    //@ts-ignore
                    const hasHolidayConflict = holidays.some((holiday) => {
                      if (!holiday.start || !holiday.end) {
                        return false
                      }

                      // IMPORTANT: Use exact hour comparison to avoid timezone issues
                      const holidayStartDate = new Date(holiday.start)
                      const holidayEndDate = new Date(holiday.end)

                      // Extract hours for direct comparison
                      const holidayStartHour = holidayStartDate.getHours()
                      const holidayEndHour = holidayEndDate.getHours()
                      const holidayStartDay = new Date(
                        holidayStartDate.getFullYear(),
                        holidayStartDate.getMonth(),
                        holidayStartDate.getDate(),
                      )
                      const holidayEndDay = new Date(
                        holidayEndDate.getFullYear(),
                        holidayEndDate.getMonth(),
                        holidayEndDate.getDate(),
                      )
                      const slotDay = new Date(slotStart.getFullYear(), slotStart.getMonth(), slotStart.getDate())

                      // Check if the holiday is on the same day as the slot
                      const isSameStartDay = holidayStartDay.getTime() === slotDay.getTime()
                      const isSameEndDay = holidayEndDay.getTime() === slotDay.getTime()

                      // Only consider the holiday if it's on the same day as the slot
                      if (!isSameStartDay && !isSameEndDay) {
                        return false
                      }

                      // Check if the current hour slot overlaps with the holiday
                      // For same start day, check if hour >= holiday start hour
                      // For same end day, check if hour < holiday end hour
                      if (isSameStartDay && isSameEndDay) {
                        // Holiday starts and ends on the same day as the slot
                        return hour >= holidayStartHour && hour < holidayEndHour
                      } else if (isSameStartDay) {
                        // Holiday starts on the same day as the slot
                        return hour >= holidayStartHour
                      } else if (isSameEndDay) {
                        // Holiday ends on the same day as the slot
                        return hour < holidayEndHour
                      }

                      return false
                    })

                    if (hasHolidayConflict) {
                      continue // Skip this hour slot
                    }

                    // Engineer is available for this hour slot
                    const slotKey = format(slotStart, "yyyy-MM-dd HH:00")
                    //@ts-ignore
                    if (!availableEngineersMap[slotKey]) {
                      //@ts-ignore
                      availableEngineersMap[slotKey] = []
                    }
                    //@ts-ignore
                    availableEngineersMap[slotKey].push(engineer.username)
                  }
                } catch (error) {
                  console.log(`Error processing availability: ${JSON.stringify(availability)}`, error)
                  continue
                }
              }
            }
          } catch (error) {
            console.log(`Error processing engineer ${engineer.username}:`, error)
          }
        }

        // Create events from the available engineers map
        const calendarEvents = []

        for (const [slotKey, engineerNames] of Object.entries(availableEngineersMap)) {
          try {
            const slotDate = parseISO(slotKey)
            const slotEnd = new Date(slotDate)
            slotEnd.setHours(slotDate.getHours() + 1)

            // Determine border color based on number of available engineers
            let borderColor = "#ef4444" // Red for 1 engineer
            //@ts-ignore
            if (engineerNames.length >= 3) {
              borderColor = "#22c55e" // Green for 3+ engineers
              //@ts-ignore
            } else if (engineerNames.length === 2) {
              borderColor = "#eab308" // Yellow for 2 engineers
            }

            calendarEvents.push({
              //@ts-ignore
              title: `${engineerNames.length} fonic${engineerNames.length > 1 ? "i" : "o"}`,
              start: slotDate,
              end: slotEnd,
              extendedProps: {
                engineers: engineerNames,
              },
              backgroundColor: "transparent",
              borderColor: borderColor,
              textColor: borderColor,
              borderWidth: "3px", // Thicker border
              className: "engineers-availability-event", // Custom class for styling
            })
          } catch (error) {
            console.log(`Error creating event for slot ${slotKey}:`, error)
          }
        }
//@ts-ignore
        setEvents(calendarEvents)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  //@ts-ignore
  const handleDatesSet = (dateInfo) => {
    setDateRange({
      start: dateInfo.start,
      end: dateInfo.end,
    })
  }
//@ts-ignore
  const renderEventContent = (eventInfo) => {
    const { extendedProps } = eventInfo.event
    return (
      <div className="engineers-availability-content p-1 text-xs overflow-y-auto max-h-full">
        <div className="font-bold mb-1">{eventInfo.event.title}</div>
        <div className="text-xs">
          {extendedProps.engineers
          //@ts-ignore
            .filter((eng) => eng.name != "Senza fonico" && eng.id != "cm9pobzca000018y2aatml5bm")//@ts-ignore
            .map((engineer, index) => (
              <div key={index} className="whitespace-normal engineers-availability-name">
                {engineer}
              </div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Panoramica Disponibilità Fonici</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="engineers-availability-calendar">
            {/* Custom CSS with scoped class names */}
            <style jsx global>{`
                            .engineers-availability-calendar .fc-timegrid-slot {
                                height: 100px !important;
                            }
                            .engineers-availability-calendar .fc-timegrid-event {
                                overflow-y: auto !important;
                                max-height: 100% !important;
                            }
                            .engineers-availability-calendar .fc-event-title {
                                white-space: normal !important;
                            }
                            .engineers-availability-calendar .engineers-availability-name {
                                margin-bottom: 2px;
                            }
                        `}</style>

            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              slotDuration="01:00:00"
              slotMinTime="10:00:00"
              slotMaxTime="28:00:00"
              allDaySlot={false}
              height="auto"
              events={events}
              eventContent={renderEventContent}
              datesSet={handleDatesSet}
              editable={false}
              selectable={false}
              dayMaxEvents={true}
              slotLabelFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: false,
              }}
              locale="it" // Set locale to Italian
              buttonText={{
                today: "Oggi",
                month: "Mese",
                week: "Settimana",
                day: "Giorno",
              }}
              firstDay={1} // Start week on Monday
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
