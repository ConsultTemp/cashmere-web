import Image from "next/image"

interface PortfolioCardProps {
  title: string
  artist: string
  imageUrl: string
  tags: string[]
}

export default function PortfolioCard({ title, artist, imageUrl, tags }: PortfolioCardProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 rounded-2xl border border-[1px] border-gray-200 hover:border-black transition p-3 sm:p-4 border border-[1px] border-gray-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 sm:gap-2">
        <h3 className="text-base sm:text-xl font-semibold line-clamp-1">{title}</h3>
        <p className="text-gray-400 text-sm line-clamp-1">{artist}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[#6FC7DF]/10 px-2 py-1 text-xs font-medium text-[#6FC7DF]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

