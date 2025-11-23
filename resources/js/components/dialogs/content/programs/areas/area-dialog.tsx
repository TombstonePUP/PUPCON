
            <Dialog open={areaDialogOpen} onOpenChange={setAreaDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="mb-4 text-lg font-medium text-gray-900">
                            {areaData.area_id ? 'Edit Area' : 'Add New Area'}
                        </DialogTitle>
                        <DialogDescription className="flex flex-col text-sm text-gray-500">
                            {areaData.area_id ? 'Editing in ' : 'Adding in '} {program.program_name}
                            <span className="font-medium">
                                {selected_level?.level === 1 ? 'Preliminary Survey Visit' : 'Accreditation Level ' + selected_level?.level}
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={areaData.area_id ? updateArea : addArea} className="flex flex-col gap-2 space-y-4">
                        <div>
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Area Number (numeric numbers only)</Label>
                            <Input
                                type="text"
                                required
                                value={areaData.area_number}
                                onChange={(e) => setAreaData('area_number', e.target.value)}
                                placeholder="e.g., 1, 2 ,3"
                            />
                            <InputError message={errorsArea.area_number} className="mt-1" />
                        </div>
                        <div>
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Area Name</Label>
                            <Input
                                type="text"
                                required
                                value={areaData.area_name}
                                onChange={(e) => setAreaData('area_name', e.target.value)}
                                placeholder="Enter area name"
                            />
                            <InputError message={errorsArea.area_name} className="mt-1" />
                        </div>

                        <div className="my-0 mb-4 rounded-md border border-blue-100 bg-blue-50 p-4">
                            <p className="text-sm text-blue-800">
                                <span className="mb-1 block font-semibold text-blue-900">Note</span>
                                In the <span>area number</span> field, make sure to use numeric numbers to avoid issues.
                            </p>
                        </div>
                        <DialogFooter className="mt-2 gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" variant="noborder" disabled={processingArea}>
                                {areaData.area_id ? 'Save Changes' : 'Add Area'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
