import * as React from "react"
import { cn } from "@/lib/utils"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  autoResize?: boolean;
  maxHeight?: number;
  minHeight?: number;
}

function Textarea({ 
  className, 
  autoResize = false,
  maxHeight = 300,
  minHeight = 120,
  ...props 
}: TextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleInput = React.useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
    }
    
    // Call user's onInput if provided
    if (props.onInput) {
      props.onInput(e);
    }
  }, [autoResize, maxHeight, props]);

  return (
    <textarea
      ref={textareaRef}
      data-slot="textarea"
      className={cn(
        // Base styles
        "flex w-full min-w-0 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-base text-gray-700 shadow-xs transition-colors duration-200 outline-none",
        // Placeholder
        "placeholder:text-gray-400",
        // Selection
        "selection:bg-primary selection:text-primary-foreground",
        // Hover state
        "hover:border-gray-400",
        // Focus state
        "focus:border-[#7f1414] focus:ring-2 focus:ring-[#7f1414]/20",
        // Disabled state
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Invalid/error state
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20 aria-invalid:focus:ring-red-500/20",
        // Responsive text size
        "md:text-sm",
        // Auto-resize specific styles
        autoResize && "resize-none overflow-y-auto",
        className
      )}
      style={{
        minHeight: autoResize ? `${minHeight}px` : undefined,
        maxHeight: autoResize ? `${maxHeight}px` : undefined,
      }}
      onInput={handleInput}
      {...props}
    />
  )
}

export { Textarea }