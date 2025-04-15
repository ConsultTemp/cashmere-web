"use client"

import Link from "next/link"
import { format, addDays } from "date-fns"
import { it } from "date-fns/locale"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/Carousel"
import { Button } from "@/components/Button"
import { BackButton } from "../components/BackButton"
import { BookingSummary } from "../components/BookingSummary"
import { useBookingStore } from "../../../store/booking-store"
import { services } from "@/lib/types"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/Select"

export default function DateTimePage() {
  const { selectedDate, setSelectedDate, setTimeRange, selectedServices, selectedPackage, timeFrom, timeTo } =
    useBookingStore()

  const dates = Array.from({ length: 28 }, (_, i) => addDays(new Date(), i))
  console.log(selectedDate)
  console.log(timeFrom)
  console.log(timeTo)
  const selectedService = services.find((s) => s.id === selectedPackage)
  const packageHasDuration = !!selectedService?.duration

  const handleStartTimeChange = (value: string) => {
    if (!value) {
      setTimeRange(null, null)
      return
    }

    const [startHour] = value.split(":").map(Number)

    if (packageHasDuration) {
      const endHour = startHour + selectedService!.duration
      setTimeRange(value, `${endHour}:00`)
    } else {
      setTimeRange(value, timeTo) // mantiene timeTo
    }
  }

  return (
    <div className="container max-w-3xl py-6 sm:py-8 px-4 sm:px-6">
      <div className="flex justify-between items-center flex-wrap">
        <BackButton href="/book" />
        <BookingSummary />
      </div>
      <div className="mt-4 sm:mt-6 space-y-16 sm:space-y-16">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Quando vuoi venire in studio?</h1>
          <p className="text-gray-400 font-light mt-2">Seleziona data e ora della sessione</p>
        </div>

        <div className="mt-16">
          <div className="flex flex-col justify-between items-start w-full mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Seleziona data</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 sm:gap-0">
              <p className="font-light text-sm sm:text-base">
                Selezionato:{" "}
                <span className="font-semibold">
                  {" "}
                  {selectedDate && format(selectedDate, "d MMMM", { locale: it })}{" "}
                </span>
              </p>
              <Button
                variant="ghost"
                onClick={() => setSelectedDate(new Date())}
                className="underline px-2 py-1 text-sm"
              >
                Torna alla data di oggi
              </Button>
            </div>
          </div>

          <Carousel className="w-full">
            <CarouselContent>
              {dates.map((date) => (
                <CarouselItem key={date.toISOString()} className="w-full sm:basis-1/3">
                  <div
                    className={`
                      p-3 sm:p-4 text-center rounded-lg cursor-pointer border text-sm sm:text-base
                      ${selectedDate?.toDateString() === date.toDateString()
                        ? "border-black bg-gray-50"
                        : "hover:border-black"
                      }
                    `}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="font-semibold">{format(date, "d MMMM", { locale: it })}</div>
                    <div className="text-xs sm:text-sm text-gray-400">{format(date, "EEEE", { locale: it })}</div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>

        </div>

        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold">Seleziona fascia oraria</h2>
          <p className="text-xs sm:text-sm text-gray-400" style={{ margin: "0px" }}>
            Minimo 1 ora
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Dalle</label>
              <Select value={timeFrom || ""} onValueChange={(value) => handleStartTimeChange(value)}>
                <SelectTrigger className="w-full p-2 rounded-md border text-sm focus-visible:ring-0">
                  <SelectValue placeholder="Seleziona orario" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 13 }, (_, i) => i + 10).map((hour) => (
                    <SelectItem key={hour} value={`${hour}:00`}>
                      {`${hour}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Alle</label>
              <Select value={timeTo || ""} onValueChange={(value) => setTimeRange(timeFrom, value)} disabled={packageHasDuration}>
                <SelectTrigger className="w-full p-2 rounded-md border text-sm">
                  <SelectValue placeholder="Seleziona orario"/>
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 13 }, (_, i) => i + 10)
                    .filter((hour) => !timeFrom || hour > Number.parseInt(timeFrom.split(":")[0]))
                    .map((hour) => (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {`${hour}:00`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-gray-400">
          Per prenotazioni periodiche o superiori alle 4 ore scrivi su Whatsapp al numero{" "}
          <a href="tel:3514206294" className="text-black underline">
            351 420 6294
          </a>{" "}
          oppure su Instagram a questo profilo:{" "}
          <a
            href="https://instagram.com/cashmerestudiomilano"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline"
          >
            @cashmerestudiomilano
          </a>
        </div>

        {selectedDate && timeFrom && timeTo && <div className="flex justify-end">
          <Button size="lg" asChild variant="gradient" className="px-8 sm:px-12 py-4 sm:py-6">
            <Link href="/book/studio">Avanti</Link>
          </Button>
        </div>}
      </div>
    </div>
  )
}

