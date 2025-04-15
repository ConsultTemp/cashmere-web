"use client"

import { useBookingStore } from "@/store/booking-store"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

export const NavigationGuard = () => {
  const { selectedServices, selectedPackage } = useBookingStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Se siamo in una pagina figlia di /book/ (ma non nella pagina principale /book/)
    // e non abbiamo servizi selezionati, reindirizza a /book/
    if (pathname.startsWith("/book/") && pathname !== "/book" && pathname != "/book/confirm" && selectedServices.length === 0 && !selectedPackage) {
      router.push("/book")
    }
  }, [pathname, selectedServices, selectedPackage, router])

  return null
}
