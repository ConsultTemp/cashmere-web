import { type User, type Fonico, type Studio, type Service, BookingState, type CalendarEvent } from "../types/booking"
import { addDays, setHours, setMinutes } from "date-fns"

export function getMockUsers(): User[] {
  return [
    { id: "user1", name: "Kango", email: "kango@example.com", phone: "+39 333 1234567" },
    { id: "user2", name: "Skugnizz", email: "skugnizz@example.com", phone: "+39 333 7654321" },
    { id: "user3", name: "Mambolosco", email: "mambolosco@example.com", phone: "+39 333 9876543" },
    { id: "user4", name: "KFresco", email: "kfresco@example.com", phone: "+39 333 3456789" },
  ]
}

export function getMockFonici(): Fonico[] {
  return [
    { id: "tizio", name: "Tizio" },
    { id: "caio", name: "Caio" },
    { id: "sempronio", name: "Sempronio" },
  ]
}

export function getMockStudios(): Studio[] {
  return [
    { id: "studio1", name: "Studio 1" },
    { id: "studio2", name: "Studio 2" },
    { id: "studio3", name: "Studio 3" },
    { id: "studio4", name: "Studio 4" },
  ]
}

export function getMockServices(): Service[] {
  return [
    { id: "service1", name: "Registrazione" },
    { id: "service2", name: "Mixaggio" },
    { id: "service3", name: "Mastering" },
    { id: "service4", name: "Produzione" },
    { id: "service5", name: "Editing" },
  ]
}

export function generateMockBookings(): CalendarEvent[] {
  const today = new Date()
  const users = getMockUsers()
  const fonici = getMockFonici()
  const studios = getMockStudios()

  const studioColors: Record<string, { bg: string; border: string }> = {
    studio1: { bg: "#38bdf8", border: "#0ea5e9" },
    studio2: { bg: "#f87171", border: "#ef4444" },
    studio3: { bg: "#a78bfa", border: "#8b5cf6" },
    studio4: { bg: "#4ade80", border: "#22c55e" },
  }

  const bookings: CalendarEvent[] = [
    {
      id: "booking1",
      title: "13:00 - 18:00 Kango",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
      backgroundColor: studioColors["studio1"].bg,
      borderColor: studioColors["studio1"].border,
      userId: "user1",
      fonicoId: "tizio",
      studioId: "studio1",
      services: ["service1", "service2"],
      notes: "Registrazione nuovo singolo",
      state: BookingState.CONFIRMED,
      extendedProps: {
        id: "booking1",
        userId: "user1",
        fonicoId: "tizio",
        studioId: "studio1",
        services: ["service1", "service2"],
        notes: "Registrazione nuovo singolo",
        state: BookingState.CONFIRMED,
      },
    },
    {
      id: "booking2",
      title: "15:00 - 19:00 Skugnizz",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 19, 0),
      backgroundColor: studioColors["studio2"].bg,
      borderColor: studioColors["studio2"].border,
      userId: "user2",
      fonicoId: "caio",
      studioId: "studio2",
      services: ["service1", "service4"],
      notes: "Produzione EP",
      state: BookingState.CONFIRMED,
      extendedProps: {
        id: "booking2",
        userId: "user2",
        fonicoId: "caio",
        studioId: "studio2",
        services: ["service1", "service4"],
        notes: "Produzione EP",
        state: BookingState.CONFIRMED,
      },
    },
    {
      id: "booking3",
      title: "19:00 - 22:00 Mambolosco",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 19, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 22, 0),
      backgroundColor: studioColors["studio3"].bg,
      borderColor: studioColors["studio3"].border,
      userId: "user3",
      fonicoId: "sempronio",
      studioId: "studio3",
      services: ["service2", "service3"],
      notes: "Mixaggio album",
      state: BookingState.CONFIRMED,
      extendedProps: {
        id: "booking3",
        userId: "user3",
        fonicoId: "sempronio",
        studioId: "studio3",
        services: ["service2", "service3"],
        notes: "Mixaggio album",
        state: BookingState.CONFIRMED,
      },
    },
    {
      id: "booking4",
      title: "20:00 - 01:00 KFresco",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 20, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 1, 0),
      backgroundColor: studioColors["studio4"].bg,
      borderColor: studioColors["studio4"].border,
      userId: "user4",
      fonicoId: "tizio",
      studioId: "studio4",
      services: ["service1", "service5"],
      notes: "Sessione notturna",
      state: BookingState.CONFIRMED,
      extendedProps: {
        id: "booking4",
        userId: "user4",
        fonicoId: "tizio",
        studioId: "studio4",
        services: ["service1", "service5"],
        notes: "Sessione notturna",
        state: BookingState.CONFIRMED,
      },
    },
  ]

  return bookings.map((booking) => ({
    ...booking,
    extendedProps: {
      ...booking.extendedProps,
      start: booking.start,
      end: booking.end,
    },
  }))
}

