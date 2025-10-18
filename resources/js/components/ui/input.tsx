import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "flex h-9 w-full min-w-0 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-base text-gray-700 shadow-xs transition-all duration-200 outline-none",
        "placeholder:text-gray-400",
        "selection:bg-primary selection:text-primary-foreground",
        "hover:border-gray-400",
        "focus:border-[#7f1414] focus:ring-2 focus:ring-[#7f1414]/20",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20 aria-invalid:focus:ring-red-500/20",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }