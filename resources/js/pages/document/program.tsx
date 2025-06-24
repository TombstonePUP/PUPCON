

import type React from "react"

import EditableGrid from "@/components/editablegrid"
import ImageUploader from "@/components/imageuploader"
import InputError from "@/components/input-error"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head, useForm } from "@inertiajs/react"
import type { PerProgram } from "@/types"
import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"

export interface ProgramProps {
  program: PerProgram
}

interface ObjectiveForm {
  objective_id?: number
  objective_title: string
  objective_description: string
}

interface FacultyForm {
  faculty_id?: number
  faculty_name: string
  faculty_position: string
  faculty_image?: File | null
}

interface ProgramInfoForm {
  program_banner?: File | null
  program_description: string
}

interface GalleryForm {
  gallery_id?: number
  gallery_image?: File | null
  gallery_caption: string
}

// Mock data - empty arrays to show blank state
const mockObjectives: any[] = []
const mockGallery: any[] = []
const mockFaculty: any[] = []

export default function Users({ program }: ProgramProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: program.program_name,
      href: `/manage-program/${program.program_id}`,
    },
  ]

  // Program Info Form
  const {
    data: programInfoData,
    setData: setProgramInfoData,
    post: postProgramInfo,
    processing: processingProgramInfo,
    errors: errorsProgramInfo,
  } = useForm<ProgramInfoForm>({
    program_banner: null,
    program_description: "",
  })

  // Objectives Form
  const {
    data: objectiveData,
    setData: setObjectiveData,
    post: postObjective,
    put: putObjective,
    delete: deleteObjective,
    processing: processingObjective,
    errors: errorsObjective,
    reset: resetObjective,
  } = useForm<ObjectiveForm>({
    objective_id: undefined,
    objective_title: "",
    objective_description: "",
  })

  // Gallery Form
  const {
    data: galleryData,
    setData: setGalleryData,
    post: postGallery,
    delete: deleteGallery,
    processing: processingGallery,
    errors: errorsGallery,
    reset: resetGallery,
  } = useForm<GalleryForm>({
    gallery_id: undefined,
    gallery_image: null,
    gallery_caption: "",
  })

  // Faculty Form
  const {
    data: facultyData,
    setData: setFacultyData,
    post: postFaculty,
    put: putFaculty,
    delete: deleteFaculty,
    processing: processingFaculty,
    errors: errorsFaculty,
    reset: resetFaculty,
  } = useForm<FacultyForm>({
    faculty_id: undefined,
    faculty_name: "",
    faculty_position: "",
    faculty_image: null,
  })

  const [objectiveDialogOpen, setObjectiveDialogOpen] = useState(false)
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false)
  const [facultyDialogOpen, setFacultyDialogOpen] = useState(false)
  const [editingObjective, setEditingObjective] = useState<any>(null)
  const [editingFaculty, setEditingFaculty] = useState<any>(null)

  // Program Info Handlers
  const submitProgramInfo = (e: React.FormEvent) => {
    e.preventDefault()
    postProgramInfo(`/manage-program/${program.program_id}/info`)
  }

  // Objective Handlers
  const addObjective = (e: React.FormEvent) => {
    e.preventDefault()
    postObjective(`/manage-program/${program.program_id}/objectives`, {
      onSuccess: () => {
        resetObjective()
        setObjectiveDialogOpen(false)
      },
    })
  }

  const updateObjective = (e: React.FormEvent) => {
    e.preventDefault()
    putObjective(`/manage-program/${program.program_id}/objectives/${objectiveData.objective_id}`, {
      onSuccess: () => {
        resetObjective()
        setObjectiveDialogOpen(false)
        setEditingObjective(null)
      },
    })
  }

  const handleEditObjective = (objective: any) => {
    setEditingObjective(objective)
    setObjectiveData({
      objective_id: objective.id,
      objective_title: objective.title,
      objective_description: objective.description,
    })
    setObjectiveDialogOpen(true)
  }

  // Gallery Handlers
  const addGalleryImage = (e: React.FormEvent) => {
    e.preventDefault()
    postGallery(`/manage-program/${program.program_id}/gallery`, {
      onSuccess: () => {
        resetGallery()
        setGalleryDialogOpen(false)
      },
    })
  }

  // Faculty Handlers
  const addFaculty = (e: React.FormEvent) => {
    e.preventDefault()
    postFaculty(`/manage-program/${program.program_id}/faculty`, {
      onSuccess: () => {
        resetFaculty()
        setFacultyDialogOpen(false)
      },
    })
  }

  const updateFaculty = (e: React.FormEvent) => {
    e.preventDefault()
    putFaculty(`/manage-program/${program.program_id}/faculty/${facultyData.faculty_id}`, {
      onSuccess: () => {
        resetFaculty()
        setFacultyDialogOpen(false)
        setEditingFaculty(null)
      },
    })
  }

  const handleEditFaculty = (faculty: any) => {
    setEditingFaculty(faculty)
    setFacultyData({
      faculty_id: faculty.id,
      faculty_name: faculty.name,
      faculty_position: faculty.position,
      faculty_image: null,
    })
    setFacultyDialogOpen(true)
  }

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

        {/* Module 1: Program Banner & Description */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Program Overview</h2>
            <p className="text-sm text-gray-600">Manage program banner and description</p>
          </div>

          <form onSubmit={submitProgramInfo} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program Banner</label>
              <ImageUploader
                onImageChange={(file) => setProgramInfoData("program_banner", file)}
                uploadText="Upload course banner"
                changeText="Change banner"
                maxSizeMB={10}
              />
              <InputError message={errorsProgramInfo.program_banner} className="mt-2" />
            </div>

            <div>
              <label htmlFor="program_description" className="block text-sm font-medium text-gray-700 mb-2">
                Program Description
              </label>
              <textarea
                id="program_description"
                required
                value={programInfoData.program_description}
                onChange={(e) => setProgramInfoData("program_description", e.target.value)}
                placeholder="Provide a detailed description of the program, its goals, and key features."
                className="min-h-[120px] w-full resize-y rounded-md border border-gray-300 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1414] focus:border-transparent transition-colors"
              />
              <InputError message={errorsProgramInfo.program_description} className="mt-2" />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button
                type="submit"
                disabled={processingProgramInfo}
                className="bg-[#7f1414] hover:bg-[#8b1515] text-white px-6"
              >
                Save Program Overview
              </Button>
            </div>
          </form>
        </div>

        {/* Module 2: Program Objectives and Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Program Objectives */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Program Objectives</h2>
              <p className="text-sm text-gray-600">Define learning outcomes and goals</p>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div></div>
              <Dialog open={objectiveDialogOpen} onOpenChange={setObjectiveDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium px-4 py-2"
                    onClick={() => {
                      setEditingObjective(null)
                      resetObjective()
                      setObjectiveDialogOpen(true)
                    }}
                  >
                    Add program
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingObjective ? "Edit Objective" : "Add Program Objective"}</DialogTitle>
                    <DialogDescription>
                      {editingObjective ? "Update the objective details" : "Create a new learning objective"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={editingObjective ? updateObjective : addObjective} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Objective Title</label>
                      <input
                        type="text"
                        required
                        value={objectiveData.objective_title}
                        onChange={(e) => setObjectiveData("objective_title", e.target.value)}
                        placeholder="e.g., Academic Excellence"
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1414] focus:border-transparent"
                      />
                      <InputError message={errorsObjective.objective_title} className="mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        required
                        value={objectiveData.objective_description}
                        onChange={(e) => setObjectiveData("objective_description", e.target.value)}
                        placeholder="Describe the learning objective in detail..."
                        className="min-h-[80px] w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1414] focus:border-transparent"
                      />
                      <InputError message={errorsObjective.objective_description} className="mt-1" />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        disabled={processingObjective}
                        className="bg-[#7f1414] hover:bg-[#8b1515] text-white"
                      >
                        {editingObjective ? "Update" : "Add"} Objective
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Details Section */}
            {mockObjectives.length > 0 ? (
              <div className="border border-gray-200 rounded p-4 min-h-[200px] max-h-[400px] overflow-y-auto bg-gray-50">
                <div className="space-y-3">
                  {mockObjectives.map((objective) => (
                    <div key={objective.id} className="bg-white border border-gray-300 rounded p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 mb-1">{objective.title}</h5>
                          <p className="text-sm text-gray-600">{objective.description}</p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditObjective(objective)}
                            className="h-6 w-6 p-0 text-[#7f1414] hover:bg-red-50"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              deleteObjective(`/manage-program/${program.program_id}/objectives/${objective.id}`)
                            }
                            className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded p-4 min-h-[200px] bg-gray-50 flex items-center justify-center">
                <p className="text-center text-gray-500">No objectives added yet</p>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
              <Button className="bg-[#7f1414] hover:bg-[#8b1515] text-white px-6">Save Objectives</Button>
            </div>
          </div>

          {/* Gallery of Excellence */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Gallery of Excellence</h2>
              <p className="text-sm text-gray-600">Showcase program facilities and activities</p>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div></div>
              <Dialog open={galleryDialogOpen} onOpenChange={setGalleryDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium px-4 py-2"
                    onClick={() => {
                      resetGallery()
                      setGalleryDialogOpen(true)
                    }}
                  >
                    add image
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Gallery Image</DialogTitle>
                    <DialogDescription>Upload an image to the program gallery</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={addGalleryImage} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => setGalleryData("gallery_image", e.target.files ? e.target.files[0] : null)}
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1414] focus:border-transparent"
                      />
                      <InputError message={errorsGallery.gallery_image} className="mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                      <input
                        type="text"
                        required
                        value={galleryData.gallery_caption}
                        onChange={(e) => setGalleryData("gallery_caption", e.target.value)}
                        placeholder="Image caption"
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1414] focus:border-transparent"
                      />
                      <InputError message={errorsGallery.gallery_caption} className="mt-1" />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        disabled={processingGallery}
                        className="bg-[#7f1414] hover:bg-[#8b1515] text-white"
                      >
                        Add Image
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Gallery Grid */}
            {mockGallery.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 min-h-[200px]">
                {mockGallery.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="border border-gray-300 rounded aspect-square bg-white flex items-center justify-center overflow-hidden shadow-sm">
                      <img
                        src={item.image || "/placeholder.svg?height=150&width=150"}
                        alt={item.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteGallery(`/manage-program/${program.program_id}/gallery/${item.id}`)}
                        className="text-white hover:bg-red-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="min-h-[200px] bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                <p className="text-center text-gray-500">No images uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Module 3: Faculty */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Faculty Members</h2>
            <p className="text-sm text-gray-600">Manage program faculty and staff</p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <Dialog open={facultyDialogOpen} onOpenChange={setFacultyDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium px-4 py-2"
                  onClick={() => {
                    setEditingFaculty(null)
                    resetFaculty()
                    setFacultyDialogOpen(true)
                  }}
                >
                  Add Faculty
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingFaculty ? "Edit Faculty Member" : "Add Faculty Member"}</DialogTitle>
                  <DialogDescription>
                    {editingFaculty ? "Update faculty member details" : "Add a new faculty member"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={editingFaculty ? updateFaculty : addFaculty} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={facultyData.faculty_name}
                      onChange={(e) => setFacultyData("faculty_name", e.target.value)}
                      placeholder="e.g., Dr. John Smith"
                      className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1414] focus:border-transparent"
                    />
                    <InputError message={errorsFaculty.faculty_name} className="mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      required
                      value={facultyData.faculty_position}
                      onChange={(e) => setFacultyData("faculty_position", e.target.value)}
                      placeholder="e.g., Professor, Associate Professor"
                      className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1414] focus:border-transparent"
                    />
                    <InputError message={errorsFaculty.faculty_position} className="mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFacultyData("faculty_image", e.target.files ? e.target.files[0] : null)}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f1414] focus:border-transparent"
                    />
                    <InputError message={errorsFaculty.faculty_image} className="mt-1" />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={processingFaculty}
                      className="bg-[#7f1414] hover:bg-[#8b1515] text-white"
                    >
                      {editingFaculty ? "Update" : "Add"} Faculty
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Faculty Grid */}
          {mockFaculty.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-h-[300px]">
              {mockFaculty.map((faculty) => (
                <div
                  key={faculty.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm relative group"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={faculty.image || "/placeholder.svg?height=120&width=120"}
                      alt={faculty.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h5 className="font-medium text-gray-900 mb-1">{faculty.name}</h5>
                    <p className="text-sm text-gray-600">{faculty.position}</p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditFaculty(faculty)}
                      className="h-6 w-6 p-0 bg-white text-[#7f1414] hover:bg-red-50 rounded shadow"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFaculty(`/manage-program/${program.program_id}/faculty/${faculty.id}`)}
                      className="h-6 w-6 p-0 bg-white text-red-600 hover:bg-red-50 rounded shadow"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="min-h-[300px] bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
              <p className="text-center text-gray-500">No faculty members added yet</p>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
            <Button className="bg-[#7f1414] hover:bg-[#8b1515] text-white px-6">Save Faculty</Button>
          </div>
        </div>

        {/* Areas Section - UNCHANGED */}
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
                Save Draft
              </Button>
              <Button variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                Preview
              </Button>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#7f1414] hover:bg-[#8b1515] text-white px-8">Submit for Review</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogTitle className="text-lg font-semibold text-gray-900">Submit Program for Review</DialogTitle>
                <DialogDescription className="text-gray-600">
                  This action will submit your complete program information for administrative review.
                </DialogDescription>
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
