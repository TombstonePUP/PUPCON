import EditableGrid from "@/components/editablegrid"
import ImageUploader from "@/components/imageuploader"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"
import type { PerProgram } from "@/types"

export interface ProgramProps {
  program: PerProgram
}

export default function Users({ program }: ProgramProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: program.program_name,
      href: `/manage-program/${program.program_id}`,
    },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${program.program_name} - Program Management`} />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {program.degree_type} in {program.program_name}
              </h1>
              <p className="text-sm text-gray-600 mt-1">Preliminary Survey Visit</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Draft</div>
              <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                Last saved: 2 hours ago
              </div>
            </div>
          </div>
        </div>

        {/* Program Information Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Program Information</h2>
            <p className="text-sm text-gray-600">Manage program banner, description, and objectives</p>
          </div>

          <div className="space-y-6">
            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program Banner</label>
              <ImageUploader
                onImageChange={(file) => console.log("Selected file:", file)}
                uploadText="Upload course banner"
                changeText="Change banner"
                maxSizeMB={10}
              />
            </div>

            {/* Program Description */}
            <div>
              <label htmlFor="outline_description" className="block text-sm font-medium text-gray-700 mb-2">
                Program Description
              </label>
              <textarea
                id="outline_description"
                required
                placeholder="Enter a comprehensive program overview..."
                className="min-h-[120px] w-full resize-y rounded-md border border-gray-300 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1414] focus:border-transparent transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide a detailed description of the program, its goals, and key features.
              </p>
            </div>

            {/* Program Objectives */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Program Objectives</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[#7f1414] border-[#7f1414] hover:bg-[#7f1414] hover:text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Objective
                </Button>
              </div>
              <div className="border border-gray-200 rounded-md p-4 min-h-[100px]">
                <div className="text-center py-6 text-gray-500">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-sm">No objectives added yet</p>
                </div>
              </div>
            </div>

            {/* Submit Button for Program Information */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button className="bg-[#7f1414] hover:bg-[#8b1515] text-white px-6">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Save Program Information
              </Button>
            </div>
          </div>
        </div>

        {/* Media & Faculty Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Media & Faculty</h2>
            <p className="text-sm text-gray-600">Manage program gallery and faculty members</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gallery Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Program Gallery</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[#7f1414] border-[#7f1414] hover:bg-[#7f1414] hover:text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Image
                </Button>
              </div>
              <div className="border border-gray-200 rounded-md p-4 min-h-[200px]">
                <div className="text-center py-8 text-gray-500">
                  <svg
                    className="w-10 h-10 mx-auto mb-3 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm">No images uploaded yet</p>
                </div>
              </div>
            </div>

            {/* Faculty Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Faculty Members</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[#7f1414] border-[#7f1414] hover:bg-[#7f1414] hover:text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Faculty
                </Button>
              </div>
              <div className="border border-gray-200 rounded-md p-4 min-h-[200px]">
                <div className="text-center py-8 text-gray-500">
                  <svg
                    className="w-10 h-10 mx-auto mb-3 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  <p className="text-sm">No faculty members added yet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button for Media & Faculty */}
          <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
            <Button className="bg-[#7f1414] hover:bg-[#8b1515] text-white px-6">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Save Media & Faculty
            </Button>
          </div>
        </div>

        {/* Areas Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Program Areas</h3>
            <p className="text-sm text-gray-600">Configure assessment areas for this program</p>
          </div>
          <EditableGrid
            mode="areas"
            initialItems={program.areas || []}
            onAdd={(area) => console.log("Add area", area)}
            onEdit={(id, area) => console.log("Edit area", id, area)}
            onRemove={(id) => console.log("Remove area", id)}
            programName={program.program_name}
          />
        </div>

        {/* Final Action Buttons */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Save Draft
              </Button>
              <Button variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Preview
              </Button>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#7f1414] hover:bg-[#8b1515] text-white px-8">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Submit for Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogTitle className="text-lg font-semibold text-gray-900">Submit Program for Review</DialogTitle>
                <DialogDescription className="text-gray-600">
                  This action will submit your complete program information for administrative review. Make sure all
                  sections are complete before submitting.
                </DialogDescription>

                {/* Submission Checklist */}
                <div className="space-y-3 my-4">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Program information completed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Program areas configured</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Media & faculty (optional)</span>
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button className="bg-[#7f1414] hover:bg-[#8b1515] text-white">Submit Program</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
