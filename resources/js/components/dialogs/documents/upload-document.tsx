"use client"

import { Button } from "@/components/ui/button"
import { useForm } from "@inertiajs/react"
import InputError from "@/components/input-error"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { ParameterOutlines } from "@/types"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import React from "react"

interface UploadDocumentProps {
  outline: ParameterOutlines
  program: string
  area_id: number
  onClose: () => void
}

interface UploadDocumentForm {
  outline_id: number
  document?: File | null
}

export function UploadDocument({ outline, program, area_id, onClose }: UploadDocumentProps) {
  const { data, setData, post, processing, errors, reset } = useForm<UploadDocumentForm>({
    outline_id: outline.parameter_outline_id,
    document: null,
  })

  const [isUploading, setIsUploading] = React.useState(false)

  const uploadDocument = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!data.document) {
      toast.error("No file selected", {
        description: "Please select a PDF file before uploading.",
      })
      return
    }

    try {
      setIsUploading(true)

      await post(
        route("manage.area.upload.file", {
          program_name: program,
          area_id: area_id,
          outline_id: outline.parameter_outline_id,
        }),
        {
          onProgress: (progress) => {
            if (progress?.percentage) {
              toast.info("Uploading...", {
                description: (
                  <div className="flex gap-1 w-full items-center">
                    <Progress value={progress.percentage} className="h-2 w-68" />
                    <p className="text-xs text-gray-500 text-right">
                      {progress.percentage}%
                    </p>
                  </div>
                ),
                id: "uploading",
              })
            }
          },
          onSuccess: () => {
            toast.dismiss("uploading")
            toast.success("Upload complete", {
              description: "Your document has been successfully uploaded.",
            })
            reset()
            setIsUploading(false)
            onClose()
          },
          onError: (errors) => {
            toast.dismiss("uploading")
            toast.error("Failed to upload document", {
              description:
                errors.document ?? "There was an error uploading the document.",
            })
            setIsUploading(false)
          },
        }
      )
    } catch (error) {
      console.error("Unexpected upload error:", error)
      toast.dismiss("uploading")
      toast.error("Unexpected error occurred", {
        description: "Please check your connection or try again later.",
      })
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => !isUploading && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Upload Document</DialogTitle>
          <DialogDescription>
            {`${outline.initial}.${outline.outline_number}. ${outline.outline_description}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={uploadDocument} className="flex flex-col gap-3">
          {/* Upload File Section */}
          <div className="space-y-2">
            <h3 className="text-muted-foreground mb-1 text-sm font-medium">
              Upload Document
            </h3>

            <div className="flex w-full items-center justify-center">
              {!data.document ? (
                <label
                  className={`flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 ${
                    isUploading ? "pointer-events-none opacity-70" : "cursor-pointer"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="mb-4 h-8 w-8 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and
                      drop
                    </p>
                    <p className="text-xs text-gray-500">PDF</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    disabled={isUploading}
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null
                      setData("document", file)
                    }}
                  />
                </label>
              ) : (
                <div
                  className={`flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 ${
                    isUploading ? "pointer-events-none opacity-70" : ""
                  }`}
                >
                  <span className="text-sm font-semibold text-gray-700">
                    {data.document.name}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    disabled={isUploading}
                    onClick={() => setData("document", null)}
                  >
                    Remove File
                  </Button>
                </div>
              )}
              <InputError message={errors.document} className="mt-2" />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={isUploading}
                onClick={() => !isUploading && onClose()}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="noborder"
              type="submit"
              disabled={isUploading || processing}
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
