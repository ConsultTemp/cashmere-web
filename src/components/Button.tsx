"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:opacity-[85%]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-[1px] border-[#758A9C] bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-[#6FC7DF] to-[#08B1DF] text-white",
        light_blue:'bg-cashmere-lightblue text-cashmere-dark-lightblue',
        gray: "bg-gray-100 text-black",
        danger: "bg-gradient-to-r from-[#ff0000] to-[#ff0000] text-white"
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-11 rounded-md px-8 text-base",
        xs: "h-8 px-2 py-0 text-xs rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  bgColor?: string // Nuova prop per il colore di sfondo personalizzato
  to?: string // Prop per il Link
  action?: () => void // Prop per l'azione
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, bgColor, to, action, onClick, ...props }, ref) => {
    // Gestione dello stile per bgColor
    const buttonStyle = variant === 'bgColor' && bgColor ? { backgroundColor: bgColor } : {}
    
    // Gestione del click
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (action) {
        action()
      }
      if (onClick) {
        onClick(e)
      }
    }

    // Se c'è un 'to', usa Link
    if (to) {
      return (
        <Link href={to} className={cn(buttonVariants({ variant, size, className }))} style={buttonStyle}>
          <span {...props} />
        </Link>
      )
    }

    // Altrimenti usa un button normale
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        style={buttonStyle}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
