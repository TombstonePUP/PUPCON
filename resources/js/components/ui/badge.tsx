import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors w-fit whitespace-nowrap [&>svg]:size-3 [&>svg]:pointer-events-none cursor-default",
  {
    variants: {
      variant: {
        default:
          "bg-gray-900 text-white hover:bg-gray-800",
        secondary:
          "bg-gray-100 text-gray-700 hover:bg-gray-200",
        destructive:
          "bg-red-500 text-white hover:bg-red-600",
        success:
          "bg-green-100 text-green-700 hover:bg-green-200",
        warning:
          "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
        outline:
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }