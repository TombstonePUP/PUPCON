
            <Dialog open={galleryDeleteOpen} onOpenChange={setGalleryDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Gallery Image?</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this image? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="default" onClick={() => setGalleryDeleteOpen(false)}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
