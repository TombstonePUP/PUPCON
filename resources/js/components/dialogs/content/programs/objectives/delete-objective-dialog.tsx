
            <Dialog open={objectiveDeleteOpen} onOpenChange={setObjectiveDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Objective?</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this objective? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="default" onClick={() => setObjectiveDeleteOpen(false)}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
