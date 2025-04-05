export enum BookingState {
  CONTATTARE = "CONTATTARE",
  CONFERMATO = "CONFERMATO",
  CONTATTATO = "CONTATTATO",
  ANNULLATO = "ANNULLATO"
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
}

export interface Fonico {
  id: string
  name: string
}

export interface Studio {
  id: string
  name: string
}

export interface Service {
  id: string
  name: string
}

export interface Booking {
  id: string
  userId: string
  user?:{
    username: string
  }
  fonico:{
    username: string
  }
  fonicoId: string
  studioId: string
  start: Date
  end: Date
  services: string[]
  notes?: string
  state: BookingState
}

export interface CalendarEvent extends Omit<Booking, "start" | "end"> {
  title: string
  start: Date
  end: Date
  backgroundColor: string
  borderColor: string
  extendedProps: Booking
}

export interface DraggedEvent {
  event: any
  oldStart: Date
  oldEnd: Date
  newStart: Date
  newEnd: Date
}

export interface BookingFormData {
  userId: string
  fonicoId: string
  studioId: string
  start: Date
  end: Date
  services: string[]
  notes?: string
}

