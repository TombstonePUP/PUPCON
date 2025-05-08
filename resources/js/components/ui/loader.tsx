import * as React from "react"
import { cn } from "@/lib/utils"

export function Loader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex items-center justify-center bg-white",
        className
      )}
      {...props}
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-[#7f1414]" />
    </div>
  )
}
