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
    <div className="flex gap-2">
      <Button variant={activeFilter === "future" ? "default" : "outline"} onClick={() => handleFilterClick("future")}>
        Future
      </Button>
      <Button variant={activeFilter === "pending" ? "default" : "outline"} onClick={() => handleFilterClick("pending")}>
        In attesa di conferma
      </Button>
      <Button
        variant={activeFilter === "past" ? "default" : "outline"}
        onClick={() => handleFilterClick("past")}
      >
        Completate
      </Button>
    </div>
  )
}