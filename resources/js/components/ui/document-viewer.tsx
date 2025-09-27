import React, { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog"
import { Button } from "./button"
import { 
  Maximize2, 
  Minimize2,
  RotateCw,
  Loader2,
  AlertCircle,
  Moon,
  Sun
} from "lucide-react"
import Programs from "@/pages/exhibits"

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
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!open) return
      
      if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [open, onOpenChange])

  // Reset states when dialog opens
  useEffect(() => {
    if (open) {
      setIsLoading(true)
      setHasError(false)
      setZoom(100)
      setRotation(0)
    }
  }, [open])



  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
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
  const bgColor = isDarkMode ? "bg-slate-800" : "bg-slate-50"
  const headerBg = isDarkMode ? "bg-slate-700 border-slate-600" : "bg-white border-slate-200"
  const textColor = isDarkMode ? "text-slate-100" : "text-slate-900"
  const containerBg = isDarkMode ? "bg-slate-900 border-slate-600" : "bg-white border-slate-200"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`!max-w-none ${dialogSize} p-0 flex flex-col ${bgColor} transition-all duration-300`}>
        <DialogHeader className={`px-6 py-3 pr-12 ${headerBg} border-b flex-shrink-0 transition-colors`}>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className={`text-lg font-medium ${textColor} truncate flex-1`}>
              {title || "Document Viewer"}
            </DialogTitle>
            
            <div className="flex items-center gap-2 flex-wrap">
              {/* Rotate */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
                title="Rotate 90°"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              
              {/* Dark Mode */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                title="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              {/* Fullscreen */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 p-4 overflow-hidden relative">
          <div className={`w-full h-full ${containerBg} rounded-lg shadow-sm border overflow-auto transition-all duration-300 relative flex items-center justify-center`}>
            {/* Loading State */}
            {isLoading && (
              <div className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'} z-10`}>
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className={`h-8 w-8 animate-spin ${textColor}`} />
                  <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Loading document...
                  </p>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {hasError && (
              <div className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'} z-10`}>
                <div className="flex flex-col items-center gap-3">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
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
                minWidth: '100%',
                minHeight: '100%'
              }}
            >
              <iframe
                ref={iframeRef}
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                width="100%"
                height="100%"
                className="border-0 transition-transform duration-300 ease-out"
                title={title || "Document"} 
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                style={{
                  filter: isDarkMode ? 'invert(0.9) hue-rotate(180deg)' : 'none',
                  backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: 'center center'
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}