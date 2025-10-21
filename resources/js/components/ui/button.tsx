import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer select-none transition-colors duration-300 ease-in-out disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7f1414] outline-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary / default button
        default:
          "border border-transparent bg-[#7f1414] text-white hover:bg-[#9b1818]",

        // Same style but no border
        noborder:
          "bg-[#7f1414] text-white hover:bg-[#9b1818]",

        // Danger / destructive button
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",

        // Minimal outline button
        outline:
          "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 hover:text-black",

        // Subtle gray secondary
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:text-black",

        // Transparent button, ideal for toolbars
        ghost:
          "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900",

        // Text link style button
        link:
          "text-[#7f1414] underline-offset-4 hover:underline hover:text-[#9b1818]",

        // White button with brand hover
        reverse:
          "border border-[#7f1414] bg-white text-[#7f1414] hover:bg-[#7f1414] hover:text-white",

        // Dark theme button
        black:
          "bg-black text-white hover:bg-[#222222]",

        // Neutral background button
        none:
          "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-[#7f1414]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);



function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
