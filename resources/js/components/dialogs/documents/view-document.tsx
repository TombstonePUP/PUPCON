"use client"
import React, { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Maximize2,
  Minimize2,
  Loader2,
  AlertCircle
} from "lucide-react"

interface DocumentViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileUrl: string
  title?: string
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  open,
  onOpenChange,
  fileUrl,
  title,
}) => {
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === "Escape") onOpenChange(false)
    }
    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [open, onOpenChange])

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setIsLoading(true)
      setHasError(false)
      setZoom(100)
    }
  }, [open])

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const dialogSize = isFullscreen ? "!w-screen !h-screen" : "!w-[90vw] !h-[95vh]"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`!max-w-none ${dialogSize} p-0 flex flex-col bg-slate-50`}>
        <DialogHeader className="px-6 py-3 pr-12 bg-white border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-lg font-medium text-slate-900 truncate flex-1">
              {title || "Document Viewer"}
            </DialogTitle>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Fullscreen toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 p-4 overflow-hidden relative">
          <div className="w-full h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-auto relative flex items-center justify-center">
            {/* Loading */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                  <p className="text-sm text-slate-600">Loading document...</p>
                </div>
              </div>
            )}

            {/* Error */}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="flex flex-col items-center gap-3">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <p className="text-sm text-slate-600">
                    Failed to load document
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setHasError(false)
                      setIsLoading(true)
                      if (iframeRef.current) {
                        iframeRef.current.src = iframeRef.current.src
                      }
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* PDF Iframe */}
            <div
              className="flex items-center justify-center transition-all duration-300 ease-out"
              style={{
                width: `${Math.max(zoom, 100)}%`,
                height: `${Math.max(zoom, 100)}%`,
                minWidth: "100%",
                minHeight: "100%",
              }}
            >
              <iframe
                ref={iframeRef}
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                width="100%"
                height="100%"
                className="border-0"
                title={title || "Document"}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
