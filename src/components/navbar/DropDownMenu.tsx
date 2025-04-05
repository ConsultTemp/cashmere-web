import { Mic } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../NavigationMenu'
import Link from 'next/link'

export const DropDownMenu = () => {
  const tabs = [
    {
      title: 'Studi',
      options: [
        { label: 'Studio 1', href: '/studio/1' },
        { label: 'Studio 2', href: '/studio/2' },
        { label: 'Studio 3', href: '/studio/3' },
        { label: 'Studio 4', href: '/studio/4' },
      ],
    },
    {
      title: 'Servizi',
      options: [
        { label: 'Affitto sala' },
        { label: 'Registrazione', href: '/service/1' },
        { label: 'Mix&Master', href: '/service/2' },
        { label: 'Produzione', href: '/service/3' },
      ],
    },
    {
      title: 'Contatti',
      options: [
        { label: 'Whatsapp', href: '' },
        { label: 'Instagram', href: '' },
        { label: 'Telefono', href: '' },
        { label: 'Posizione', href: '' },
      ],
    },
  ]

  return (
    <NavigationMenu className="w-full md:w-auto">
      <NavigationMenuList className="flex flex-col md:flex-row w-full">
        {tabs.map(({ title, options }) => (
          <NavigationMenuItem key={title} className="text-siva-main-text w-full md:w-auto">
            <NavigationMenuTrigger className="w-full justify-start md:justify-center">{title}</NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-[200px] md:min-w-[300px] p-2 flex flex-col gap-0 text-siva-main-text text-sm font-medium">
              {options.map(({ label, href }) => (
                <Link
                href={href || '/'}
                  key={label}
                  className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md hover:text-black hover:bg-neutral-100"
                >
                  <div className="w-8 h-8 bg-neutral-50 rounded-md flex justify-center items-center">
                    <Mic width={16} height={16} className="stroke-neutral-700" />
                  </div>
                  <p>{label}</p>
                </Link>
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

