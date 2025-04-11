import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
  isCurrent?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-sm text-gray-500 ${className}`}>
      <ol className="flex items-center space-x-1" itemScope itemType="https://schema.org/BreadcrumbList">
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link href="/" className="flex items-center hover:text-gray-700" itemProp="item">
            <Home className="h-4 w-4" />
            <span className="sr-only" itemProp="name">
              Home
            </span>
            <meta itemProp="position" content="1" />
          </Link>
        </li>

        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <ChevronRight className="h-4 w-4 mx-1" aria-hidden="true" />
            {item.isCurrent ? (
              <span aria-current="page" className="font-medium text-gray-900" itemProp="name">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-gray-700" itemProp="item">
                <span itemProp="name">{item.label}</span>
              </Link>
            )}
            <meta itemProp="position" content={`${index + 2}`} />
          </li>
        ))}
      </ol>
    </nav>
  )
}
