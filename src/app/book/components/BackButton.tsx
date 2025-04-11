import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  href: string
  disabled?: boolean
}

export function BackButton({ href, disabled = false }: BackButtonProps) {
  return (
    <Button variant="ghost" asChild disabled={disabled}>
      <Link href={href} className="flex items-center gap-2">
        <ChevronLeft className="h-4 w-4" />
        Indietro
      </Link>
    </Button>
  )
}
