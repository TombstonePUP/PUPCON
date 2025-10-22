import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 rounded-full",
        orientation === "horizontal"
          ? "h-[1px] w-full bg-gray-300"
          : "h-full w-[1px] bg-gray-300",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
