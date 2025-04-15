"use client"

import { useState } from "react"
import { Button } from "@/components/Button"
import { BookingState } from "@/types/types"

interface BookingFiltersProps {
  onFilterChange: (status: BookingState | "future" | "past" | "pending") => void
}

export function BookingFilters({ onFilterChange }: BookingFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<BookingState | "future" | "past" | "pending">("future")

  const handleFilterClick = (status: BookingState | "future" | "past" | "pending") => {
    setActiveFilter(status)
    onFilterChange(status)
  }

  return (
    <div className="flex gap-2 flex-row flex-wrap">
      <Button variant={"outline"} onClick={() => handleFilterClick("future")} className={`border border-2 border-${activeFilter === "future" ? "black bg-gray-100" : "gray-300"} rounded-full`}>
        Future
      </Button>
      <Button variant={"outline"} onClick={() => handleFilterClick("pending")} className={`border border-2 border-${activeFilter === "pending" ? "black bg-gray-100" : "gray-300"} rounded-full`}>
        In attesa di conferma
      </Button>
      <Button variant={"outline"} onClick={() => handleFilterClick("past")} className={`border border-2 border-${activeFilter === "past" ? "black bg-gray-100" : "gray-300"} rounded-full`}>
        Completate
      </Button>
    </div>
  )
}