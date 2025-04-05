export type BookingStatus = "future" | "pending" | "completed"

export interface Booking {
  id: string
  studioId: string
  studioName: string
  studioImage: string
  date: string
  status: BookingStatus
  timeSlot: string
}

export const bookings: Booking[] = [
  {
    id: "1",
    studioId: "1",
    studioName: "Studio 1",
    studioImage: "/Studio 1/1.jpg",
    date: "Domenica 26 gennaio",
    status: "future",
    timeSlot: "16:00 - 21:00",
  },
  {
    id: "2",
    studioId: "1",
    studioName: "Studio 1",
    studioImage: "/Studio 1/1.jpg",
    date: "Sabato 25 gennaio",
    status: "pending",
    timeSlot: "10:00 - 13:00",
  },
  {
    id: "3",
    studioId: "3",
    studioName: "Studio 3",
    studioImage: "/Studio 3/1.jpg",
    date: "Lunedì 20 gennaio",
    status: "completed",
    timeSlot: "14:00 - 17:00",
  },
  {
    id: "4",
    studioId: "2",
    studioName: "Studio 2",
    studioImage: "/Studio 2/1.jpg",
    date: "Lunedì 20 gennaio",
    status: "completed",
    timeSlot: "18:00 - 21:00",
  },
]

