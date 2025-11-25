
                                        <Dialog>
                                            <DialogTrigger>
                                                <Button className="flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                                    <PlusIcon className="mr-2 h-4 w-4" />
                                                    Add New File
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle className="text-lg font-medium text-gray-900">File Name</DialogTitle>
                                                    <DialogDescription className="text-sm text-gray-500">
                                                        Provide or edit the name and file contents for this exhibit
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-2">
                                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Upload Document</Label>
                                                    <Input type="text" autoFocus tabIndex={1} placeholder="ex. UG Manual 202X" />
                                                </div>
                                                <div>
                                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Upload Document</Label>
                                                    <div className="flex w-full items-center justify-center">
                                                        {/* {!data.document ? ( */}
                                                        <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
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
                                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                                </p>
                                                                <p className="text-xs text-gray-500">PDF</p>
                                                            </div>
                                                            <input
                                                                name="document"
                                                                type="file"
                                                                className="hidden"
                                                                accept=".pdf"
                                                                onChange={(e) => {
                                                                    const file = e.target.files ? e.target.files[0] : null;
                                                                    // setData('document', file);
                                                                }}
                                                            />
                                                        </label>
                                                        {/* ) : ( */}
                                                        {/* <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-50 p-5 text-center">
                                        <span className="text-sm font-semibold text-gray-700">{data.document.name}</span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => {
                                                setData('document', null);
                                            }}
                                        >
                                            Remove File
                                        </Button>
                                    </div> */}
                                                        {/* )} */}
                                                        {/* <InputError message={errors.document} className="mt-2" /> */}
                                                    </div>
                                                </div>
                                                <DialogFooter className="mt-2">
                                                    <DialogClose asChild>
                                                        <Button type="button" variant="outline" id="add-card-dialog-close">
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button type="submit" className="border-none">
                                                        Save
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
