
                            <Dialog
                                open={addLevelDialogOpen}
                                onOpenChange={(open) => {
                                    setAddLevelDialogOpen(open);
                                    if (!open) {
                                        setProgramToStart(null);
                                        setSelectedProgramId('');
                                    }
                                }}
                            >
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-medium text-gray-900">Add Program Level</DialogTitle>
                                        <DialogDescription className="text-sm text-gray-500">
                                            Start a new accreditation level for an existing program.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4">
                                        <div className="space-y-2">
                                            <Label className="mb-2 block text-sm font-medium text-gray-700">Program</Label>
                                            <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a program" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {programs.map((program) => (
                                                        <SelectItem key={program.program_id} value={String(program.program_id)}>
                                                            {program.program_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="mb-2 block text-sm font-medium text-gray-700">Current Status</Label>
                                                <div className="flex h-10 w-full items-center rounded-md border border-gray-200 bg-gray-50 px-3">
                                                    <span className={`text-sm ${currentProgramStatusClass}`}>{currentProgramStatus}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="mb-2 block text-sm font-medium text-gray-700">New Level</Label>
                                                <Select defaultValue="">
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Candidate">Candidate</SelectItem>
                                                        <SelectItem value="Level I">Level I</SelectItem>
                                                        <SelectItem value="Level II">Level II</SelectItem>
                                                        <SelectItem value="Level III">Level III</SelectItem>
                                                        <SelectItem value="Level IV">Level IV</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button variant="noborder">Submit</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
