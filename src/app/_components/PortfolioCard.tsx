import Image from "next/image"

interface PortfolioCardProps {
  title: string
  artist: string
  imageUrl: string
  tags: string[]
}

export default function PortfolioCard({ title, artist, imageUrl, tags }: PortfolioCardProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 rounded-xl border border-2 border-gray-200 hover:border-black transition p-3 sm:p-4 border border-[1px] border-gray-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 sm:gap-2">
        <h3 className="text-lg poppins-medium line-clamp-1">{title}</h3>

      </div>
    </div>
  )
}

