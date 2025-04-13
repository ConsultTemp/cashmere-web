"use client"

import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ServiceCardProps {
  id: "0" | "1" | "2" | "3"
  title: string
  description: string
  imageUrl: string
  hasStudioButtons?: boolean
  actionLabel?: string
}

export default function ServiceCard({
  id,
  title,
  description,
  imageUrl,
  hasStudioButtons,
  actionLabel = "Scopri di più",
}: ServiceCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-2xl">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg sm:text-xl poppins-semibold">{title}</h3>
        <p className="text-gray-500 text-xs sm:text-sm">{description}</p>

        {/* Studio Buttons or Action Button */}
        <div className="mt-2">
          {hasStudioButtons ? (
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3, 4].map((num, i) => (
                <Link key={i} href={`/studio/${num}`}>
                  <button
                    key={num}
                    className="inline-flex items-center rounded-lg text-[14px] text-black hover:underline hover:font-bold transition-all duration-300"
                  >
                    Studio {num}
                  </button>
                </Link>
              ))}
            </div>
          ) : (
            <Link href={`/service/${id}`}>
              <button className="inline-flex items-center rounded-lg text-[14px] text-black hover:underline hover:font-bold transition-all duration-300">
                {actionLabel} <ChevronRight className="w-4"/>
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

