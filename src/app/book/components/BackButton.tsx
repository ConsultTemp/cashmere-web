import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface BackButtonProps {
  href: string
  label?: string
}

export function BackButton({ href, label = "Indietro" }: BackButtonProps) {
  return (
    <Link 
      href={href}
      className="inline-flex items-center text-sm text-black hover:text-foreground transition-colors underline"
    >
      {label}
    </Link>
  )
}
