import { create } from "zustand"

export type ServiceType = "recording" | "mixing" | null
export type PackageType = "2h-mix" | "2h-mix-beat" | "4h-2mix" | "beat-session" | null
export type Engineer = "Primo fonico" | "Sleza" | "Tarantino" | "Rivreck" | "Nicholas Frey" | "Emdi"

interface BookingState {
  // Step 1: Services
  selectedServices: ServiceType[]
  selectedPackage: PackageType

  // Step 2: Date & Time
  selectedDate: Date | null
  timeFrom: string | null
  timeTo: string | null

  // Step 3: Studio
  selectedStudio: string | null

  // Step 4: Engineer
  needsEngineer: boolean
  selectedEngineer: Engineer | null

  // Step 5: Contact
  instagramUsername: string
  phoneNumber: string
  notes: string

  // Actions
  setSelectedServices: (services: ServiceType[]) => void
  setSelectedPackage: (pkg: PackageType) => void
  setSelectedDate: (date: Date | null) => void
  setTimeRange: (from: string | null, to: string | null) => void
  setSelectedStudio: (studio: string | null) => void
  setNeedsEngineer: (needs: boolean) => void
  setSelectedEngineer: (engineer: Engineer | null) => void
  setContactInfo: (instagram: string, phone: string, notes: string) => void
  resetBooking: () => void
  saveBookingToLocalStorage: () => void
  loadBookingFromLocalStorage: () => void
}

export const useBookingStore = create<BookingState>((set, get) => ({
  // Initial state
  selectedServices: [],
  selectedPackage: null,
  selectedDate: null,
  timeFrom: null,
  timeTo: null,
  selectedStudio: null,
  needsEngineer: false,
  selectedEngineer: null,
  instagramUsername: "",
  phoneNumber: "",
  notes: "",

  // Actions
  setSelectedServices: (services) => set({ selectedServices: services }),
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setTimeRange: (from, to) => set({ timeFrom: from, timeTo: to }),
  setSelectedStudio: (studio) => set({ selectedStudio: studio }),
  setNeedsEngineer: (needs) => set({ needsEngineer: needs }),
  setSelectedEngineer: (engineer) => set({ selectedEngineer: engineer }),
  setContactInfo: (instagram, phone, notes) => set({ instagramUsername: instagram, phoneNumber: phone, notes: notes }),
  resetBooking: () =>
    set({
      selectedServices: [],
      selectedPackage: null,
      selectedDate: null,
      timeFrom: null,
      timeTo: null,
      selectedStudio: null,
      needsEngineer: false,
      selectedEngineer: null,
      instagramUsername: "",
      phoneNumber: "",
      notes: "",
    }),
  saveBookingToLocalStorage: () => {
    const state = useBookingStore.getState()
    const bookingData = {
      selectedStudio: state.selectedStudio,
      selectedEngineer: state.selectedEngineer,
      selectedServices: state.selectedServices,
      selectedDate: state.selectedDate?.toISOString(),
      timeFrom: state.timeFrom,
      timeTo: state.timeTo,
      selectedPackage: state.selectedPackage,
      instagramUsername: state.instagramUsername,
      phoneNumber: state.phoneNumber,
      notes: state.notes,
    }
    localStorage.setItem("bookingData", JSON.stringify(bookingData))
  },

  // Carica i dati della prenotazione da localStorage
  loadBookingFromLocalStorage: () => {
    const bookingDataStr = localStorage.getItem("bookingData")
    if (bookingDataStr) {
      try {
        const bookingData = JSON.parse(bookingDataStr)
        set({
          selectedStudio: bookingData.selectedStudio || "",
          selectedEngineer: bookingData.selectedEngineer || null,
          selectedServices: bookingData.selectedServices || [],
          selectedDate: bookingData.selectedDate ? new Date(bookingData.selectedDate) : new Date(),
          timeFrom: bookingData.timeFrom || "",
          timeTo: bookingData.timeTo || "",
          selectedPackage: bookingData.selectedPackage || null,
          instagramUsername: bookingData.instagramUsername || "",
          phoneNumber: bookingData.phoneNumber || "",
          notes: bookingData.notes || "",
        })
      } catch (error) {
        console.error("Errore nel caricamento dei dati della prenotazione:", error)
      }
    }
  },
}))
