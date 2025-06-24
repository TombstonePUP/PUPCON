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
    <DialogContent className="max-w-6xl max-h-[95vh]">
      <DialogHeader>
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
      <DialogDescription>
        <iframe
          src={fileUrl}
          width="100%"
          height="700"
          className="rounded border border-gray-300"
          title={title || "Document"}
        />
      </DialogDescription>
    </DialogContent>
  </Dialog>
)