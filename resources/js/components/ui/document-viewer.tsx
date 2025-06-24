import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog"
import { Button } from "./button"
import { ExternalLink } from "lucide-react"

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
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      className="!max-w-none !w-[98vw] !h-[96vh] p-0 flex flex-col"
      style={{ maxWidth: "98vw", width: "98vw", height: "96vh" }}
    >
      <DialogHeader className="p-6 pb-2">
        <DialogTitle className="text-2xl font-bold flex items-center justify-between">
          <span>{title || "View Document"}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(fileUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open External
            </Button>
          </div>
        </DialogTitle>
      </DialogHeader>
      <DialogDescription className="flex-1">
        <iframe
          src={fileUrl}
          width="100%"
          height="100%"
          className="rounded-b-lg border-0 w-full h-full"
          title={title || "Document"}
        />
      </DialogDescription>
    </DialogContent>
  </Dialog>
)