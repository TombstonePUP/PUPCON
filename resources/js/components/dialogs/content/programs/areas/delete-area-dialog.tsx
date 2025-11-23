            <Dialog open={areaDeleteOpen} onOpenChange={setAreaDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium text-gray-900">Delete Area?</DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            This will permanently remove this area. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="my-0 rounded-md border border-red-100 bg-red-50 p-4">
                        <p className="text-sm text-red-800">
                            <span className="mb-1 block font-semibold text-red-900">Warning: Irreversible Action!</span>
                            This action will permanently delete the area and all associated document (if any). This action cannot be undone.
                        </p>
                    </div>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="noborder" onClick={handleDeleteArea} disabled={processingArea}>
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

