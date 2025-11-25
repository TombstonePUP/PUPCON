
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent className="sm:max-w-5xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-medium text-gray-900">Static Exhibit Title</DialogTitle>
                            <DialogDescription className="text-sm text-gray-500">
                                Modify exhibit title, and manage categories and files.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                            {/* Left Pane */}
                            <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                                <h4 className="mb-3 text-xs text-gray-500">Select a category</h4>
                                <div className="space-y-1">
                                    {/* Sample Category 1 (Selected bersyon) */}
                                    <div className="group flex cursor-pointer items-center justify-between rounded-md bg-[#7f1414]/4 p-2 px-4 transition-colors">
                                        <span className="truncate text-sm font-normal text-red-900">Undergraduate</span>
                                        <div className="flex items-center space-x-0.5 opacity-100 transition-opacity">
                                            <ActionButton>
                                                <EditIcon className="h-4 w-4" />
                                            </ActionButton>
                                            <ActionButton>
                                                <Trash2Icon className="h-4 w-4" />
                                            </ActionButton>
                                        </div>
                                    </div>

                                    {/*Sample Category 2 */}
                                    <div className="group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 text-gray-700 transition-colors hover:bg-gray-100">
                                        <span className="truncate text-sm text-gray-700">Graduate</span>
                                        <div className="flex items-center space-x-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                            <ActionButton>
                                                <EditIcon className="h-4 w-4" />
                                            </ActionButton>
                                            <ActionButton>
                                                <Trash2Icon className="h-4 w-4" />
                                            </ActionButton>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 border-gray-200 pt-4">
                                    <Dialog>
                                        <DialogTrigger className="w-full">
                                            <Button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition">
                                                <Plus className="mr-2 h-4 w-4" /> New Category
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="text-lg font-medium text-gray-900">Create New Category</DialogTitle>
                                                <DialogDescription className="text-sm text-gray-500">
                                                   Create a new category within an exhibit
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-2">
                                                <Label className="mb-2 block text-sm font-medium text-gray-700">Category Name</Label>
                                                <Input type="text" autoFocus tabIndex={1} placeholder="ex. Syllabus for BSHM" />
                                            </div>
                                            <DialogFooter className="mt-2">
                                                <DialogClose asChild>
                                                    <Button type="button" variant="outline" id="add-card-dialog-close">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                                <Button type="submit" className="border-none">
                                                    Create
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>

                            {/* Right Pane */}
                            <div className="w-2/3 p-6">
                                <>
                                    <h4 className="mb-6 truncate text-lg font-medium text-gray-900">Undergraduate</h4>
                                    <div className="max-h-[300px] space-y-3 overflow-y-auto pr-2">
                                        {/* Static  Item 1 */}
                                        <div className="group flex items-start justify-between rounded-md border border-gray-100 bg-white p-3 px-6 transition-all hover:border-red-200">
                                            <div>
                                                <span className="text-sm font-medium text-gray-900">UG Handbook 2024.pdf</span>
                                            </div>
                                            <div className="flex flex-shrink-0 items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <ActionButton className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700">
                                                    <EditIcon className="h-4 w-4" />
                                                </ActionButton>

                                                <ActionButton className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700">
                                                    <Trash2Icon className="h-4 w-4" />
                                                </ActionButton>
                                            </div>
                                        </div>

                                        {/* Static Item 2 */}
                                        <div className="group flex items-start justify-between rounded-md border border-gray-100 bg-white p-3 px-6 transition-all hover:border-red-200">
                                            <div>
                                                <span className="text-sm font-medium text-gray-900">UG Handbook 2026.pdf</span>
                                            </div>
                                            <div className="flex flex-shrink-0 items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <ActionButton className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700">
                                                    <EditIcon className="h-4 w-4" />
                                                </ActionButton>

                                                <ActionButton className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700">
                                                    <Trash2Icon className="h-4 w-4" />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
