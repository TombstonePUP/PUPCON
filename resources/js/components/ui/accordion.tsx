import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function Accordion(props: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        // Rounded container with hidden overflow keeps the bar clipped
        "relative overflow-hidden rounded-[0.5vw] border border-[#7f1414]/25 hover:border-[#7f1414]/50 transition duration-300",
        // Red bar, now full height of the item but clipped by overflow-hidden
        "before:absolute before:top-0 before:left-0 before:h-full before:w-[0.4vw] before:bg-[#7f1414]",
        // Padding moved so content never overlaps the bar
        "pl-[3vw] px-[1vw]",
        className
      )}
      {...props}
    />
  )
}


function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex ">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 px-6 text-left text-sm font-medium outline-none",
          "transition-colors focus-visible:ring-2 focus-visible:ring-[#7f1414]/40",
          "disabled:pointer-events-none disabled:opacity-50",
          "[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="size-4 shrink-0 translate-y-0.5 transition-transform duration-150" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        "overflow-hidden text-sm px-6" ,
        // shorter, smoother animation
        "data-[state=open]:animate-[accordion-down_0.18s_ease-out]",
        "data-[state=closed]:animate-[accordion-up_0.18s_ease-in]",
        className
      )}
      {...props}
    >
      <div className="pt-0 pb-4 flex flex-col mb-[1vw] gap-[1vw]">
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
