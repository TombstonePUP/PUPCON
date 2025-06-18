import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/charts/data-table"
import { columns } from "@/components/charts/users/columns"
import type { UserRecords } from "@/types"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Users, Mail, User, Shield, Settings, BookOpen, CheckCircle } from "lucide-react"

interface UsersProps {
  userRecords: UserRecords[]
}

const programList = [
  { id: "it", name: "Information Technology", color: "bg-blue-100 text-blue-800" },
  { id: "accounting", name: "Accounting", color: "bg-green-100 text-green-800" },
  { id: "psychology", name: "Psychology", color: "bg-purple-100 text-purple-800" },
]

const additionalAccess = [
  { id: "exhibits", name: "Exhibits Management", description: "Manage exhibition content and displays" },
  { id: "coordinator", name: "Accreditation Coordinator", description: "Coordinate accreditation processes" },
]

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Users",
    href: "/users",
  },
]

export default function UserManagement({ userRecords }: UsersProps) {
  // Form state
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])
  const [selectedAreas, setSelectedAreas] = useState<Record<string, number[]>>({})
  const [selectedAccess, setSelectedAccess] = useState<string[]>([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  // Form handlers
  const toggleProgram = (programId: string) => {
    setSelectedPrograms((prev) => {
      const isSelected = prev.includes(programId)
      const updated = isSelected ? prev.filter((p) => p !== programId) : [...prev, programId]

      if (isSelected) {
        setSelectedAreas((prevAreas) => {
          const updatedAreas = { ...prevAreas }
          delete updatedAreas[programId]
          return updatedAreas
        })
      }
      return updated
    })
  }

  const toggleArea = (programId: string, area: number) => {
    setSelectedAreas((prev) => {
      const current = prev[programId] || []
      return {
        ...prev,
        [programId]: current.includes(area) ? current.filter((a) => a !== area) : [...current, area],
      }
    })
  }

  const toggleAccess = (accessId: string) => {
    setSelectedAccess((prev) => (prev.includes(accessId) ? prev.filter((a) => a !== accessId) : [...prev, accessId]))
  }

  const isProgramSelected = (programId: string) => selectedPrograms.includes(programId)
  const isAccessSelected = (accessId: string) => selectedAccess.includes(accessId)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({ firstName: "", lastName: "", email: "" })
    setSelectedPrograms([])
    setSelectedAreas({})
    setSelectedAccess([])
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="h-8 w-8 text-[#7f1414]" />
              User Management
            </h1>
            <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#7f1414] hover:bg-[#a01818] text-white shadow-lg">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-[#7f1414]" />
                  Create New User Account
                </DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new user account with appropriate permissions
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="personal" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger value="permissions" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Permissions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>Enter the user's basic information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            placeholder="Enter first name"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className="focus:border-[#7f1414] focus:ring-[#7f1414]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            placeholder="Enter last name"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className="focus:border-[#7f1414] focus:ring-[#7f1414]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="focus:border-[#7f1414] focus:ring-[#7f1414]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-6 mt-6">
                  {/* Program Access */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Program Access
                      </CardTitle>
                      <CardDescription>Select which programs this user can access</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4">
                        {programList.map((program) => (
                          <div key={program.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id={program.id}
                                checked={isProgramSelected(program.id)}
                                onCheckedChange={() => toggleProgram(program.id)}
                                className="data-[state=checked]:bg-[#7f1414] data-[state=checked]:border-[#7f1414]"
                              />
                              <Label htmlFor={program.id} className="flex items-center gap-2 cursor-pointer">
                                <Badge className={program.color}>{program.name}</Badge>
                              </Label>
                            </div>

                            {/* Areas for selected programs */}
                            {isProgramSelected(program.id) && (
                              <div className="mt-4 pl-6 border-l-2 border-gray-200">
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                  Areas - {program.name}
                                </Label>
                                <div className="grid grid-cols-5 gap-2">
                                  {Array.from({ length: 10 }).map((_, i) => (
                                    <div key={i} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${program.id}-area-${i + 1}`}
                                        checked={(selectedAreas[program.id] || []).includes(i + 1)}
                                        onCheckedChange={() => toggleArea(program.id, i + 1)}
                                        className="data-[state=checked]:bg-[#7f1414] data-[state=checked]:border-[#7f1414]"
                                      />
                                      <Label htmlFor={`${program.id}-area-${i + 1}`} className="text-sm cursor-pointer">
                                        Area {i + 1}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional Access */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Additional Access
                      </CardTitle>
                      <CardDescription>Grant additional system permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {additionalAccess.map((access) => (
                          <div key={access.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                id={access.id}
                                checked={isAccessSelected(access.id)}
                                onCheckedChange={() => toggleAccess(access.id)}
                                className="data-[state=checked]:bg-[#7f1414] data-[state=checked]:border-[#7f1414] mt-1"
                              />
                              <div className="flex-1">
                                <Label htmlFor={access.id} className="font-medium cursor-pointer">
                                  {access.name}
                                </Label>
                                <p className="text-sm text-gray-600 mt-1">{access.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Permission Summary */}
                  {(selectedPrograms.length > 0 || selectedAccess.length > 0) && (
                    <Card className="border-[#7f1414]/20 bg-[#7f1414]/5">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-[#7f1414]" />
                          Permission Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedPrograms.length > 0 && (
                            <div>
                              <p className="font-medium text-sm text-gray-700 mb-2">Program Access:</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedPrograms.map((programId) => {
                                  const program = programList.find((p) => p.id === programId)
                                  const areaCount = selectedAreas[programId]?.length || 0
                                  return (
                                    <Badge
                                      key={programId}
                                      variant="outline"
                                      className="border-[#7f1414] text-[#7f1414]"
                                    >
                                      {program?.name} {areaCount > 0 && `(${areaCount} areas)`}
                                    </Badge>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {selectedAccess.length > 0 && (
                            <div>
                              <p className="font-medium text-sm text-gray-700 mb-2">Additional Access:</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedAccess.map((accessId) => {
                                  const access = additionalAccess.find((a) => a.id === accessId)
                                  return (
                                    <Badge key={accessId} variant="outline" className="border-green-500 text-green-700">
                                      {access?.name}
                                    </Badge>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button className="bg-[#7f1414] hover:bg-[#a01818]">Create User Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg border shadow-sm">
          <DataTable columns={columns} data={userRecords} />
        </div>
      </div>
    </AppLayout>
  )
}
