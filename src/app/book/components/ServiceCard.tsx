"use client"

import Image from "next/image"

interface ServiceCardProps {
  title: string
  description: string
  imageUrl: string
  selected: boolean
  onSelect: () => void
}

export default function ServiceCard({ title, description, imageUrl, selected, onSelect }: ServiceCardProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 px-4 sm:px-6 border border-${selected ? "border-[1px] border-black" : "hover:border-black border-[1px]"} rounded-lg transition py-12 cursor-pointer hover:border-black`}
      onClick={onSelect}
    >
      <div className="w-16 h-16 sm:w-1/6 aspect-square flex flex-col justify-center items-center mx-auto sm:mx-0">
        <Image
          src={imageUrl || "/Studio 1/1.jpg"}
          alt={title}
          width={50}
          height={50}
          className="object-square object-cover transition-transform duration-300 rounded-md"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 w-full sm:w-3/5 justify-center text-center sm:text-left">
        <h3 className="text-xl sm:text-xl font-semibold">{title}</h3>
        <p className="text-gray-500 text-xs sm:text-sm">{description}</p>
      </div>
      <div className="w-full sm:w-1/5 flex flex-col justify-center items-center sm:items-end px-4">
        <div
          className={`rounded-full aspect-square w-8 h-8 border border-[1px] border-gray-400 flex flex-col items-center justify-center bg-${selected ? "black" : "white"} text-white text-xl`}
        >
          &#10003;
        </div>
      </div>
    </div>
  )
}

