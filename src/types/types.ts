export interface PortfolioItem {
  title: string
  artist: string
  imageUrl: string
  tags: string[]
}

export interface CreateBooking {
  userId: string | null
  fonicoId: string
  studioId: string
  start: Date
  end: Date
  services: string[]
  notes?: string
  phone?: string
  instagram?: string
}

export interface CreateEntity {
  name: string
}

export interface CreateHoliday {
  userId: string
  start: Date
  end: Date
  reason: string
}
export enum BookingState {
  CONTATTARE = "CONTATTARE",
  CONFERMATO = "CONFERMATO",
  CONTATTATO = "CONTATTATO",
  ANNULLATO = "ANNULLATO",
}

export type StateType = "CONTATTARE" | "CONTATTATO" | "ANNULLATO" | "CONFERMATO"

export enum HolidayState {
  CONFERMARE = "CONFERMARE",
  CONFERMATO = "CONFERMATO",
  ANNULLATO = "ANNULLATO",
}

export type HolidayStateType = "CONFERMARE" | "ANNULLATO" | "CONFERMATO"

export enum HolidayType {
  FERIE = "FERIE",
  PERMESSO = "PERMESSO",
}

export type HolidayTypeType = "FERIE" | "PERMESSO"

export interface Availability {
  id: string
  day: string
  start: string
  end: string
  userId: string
}

export interface CreateAvailabilityDto {
  day: string
  start: string
  end: string
  engineerId?: string
}

export interface Report {
  id: string
  reason: string
}

export interface CreateReportDto {
  userId: string
  reason: string
}

