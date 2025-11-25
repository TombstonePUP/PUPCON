import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';

import { Separator } from '@/components/ui/separator';
import { EditIcon, ImageIcon, Plus, Trash2Icon, Upload } from 'lucide-react';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import SectionFooter from '../ui/section-footer';

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

const handleSave = () => {
    console.log('Submitting VMGO Data:', data);
    post(route('content.vmgo.update'));
};

const handlePreview = () => {
    window.open('/about/vision-mission-goals', '_blank');
};

export default function WelcomeContentSection({ ...props }: WelcomeContentSectionProps) {
    return (
        <>
            <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
                <div className="p-8">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Welcome Page</h2>
                        <p className="text-sm text-gray-600">Configure welcome page content</p>
                    </div>
                    {/* Gallery Pane */}
                    <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                        {/* Left Pane */}
                        <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                            <h4 className="mb-3 text-xs text-gray-500">Select an image</h4>
                            <div className="space-y-1">
                                {/* Sample Category 1 (Selected bersyon) */}
                                <div className="group flex cursor-pointer items-center justify-between rounded-md bg-[#7f1414]/4 p-2 px-4 transition-colors">
                                    <span className="truncate text-sm font-normal text-red-900">PUPSJ Drone Shot</span>
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
                                    <span className="truncate text-sm text-gray-700">Main Building Hallway</span>
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
                                            <Plus className="mr-2 h-4 w-4" /> Add image
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className="text-lg font-medium text-gray-900">Add Image</DialogTitle>
                                            <DialogDescription className="text-sm text-gray-500">
                                                Provide or edit the name and image contents for the home page gallery
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-2">
                                            <Label className="mb-2 block text-sm font-medium text-gray-700">Image Name</Label>
                                            <Input type="text" autoFocus tabIndex={1} placeholder="ex. PUPSJ Drone Shot" />
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium text-gray-700">Upload Image</Label>
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
                                                        <p className="text-xs text-gray-500">jpg, png, jpeg</p>
                                                    </div>
                                                    <input
                                                        name="document"
                                                        type="file"
                                                        className="hidden"
                                                        accept=".jpg"
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
                                                Add Image
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        {/* Right Pane */}
                        <div className="w-full p-6">
                            <>
                                <div className="h-full">
                                    <div className="h-full w-full">
                                        <div className="h-full w-full overflow-hidden rounded-lg border border-gray-100">
                                            <div className="animate-in fade-in-0 flex h-full w-full flex-col items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-gray-500">
                                                <ImageIcon className="h-12 w-12 text-gray-400" />
                                                <span className="mt-2 text-sm">No Image Available</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        </div>
                    </div>

                    <Separator className="my-10 bg-gray-200" />

                    <div className="mb-6">
                        <h3 className="mb-4 text-base font-semibold text-gray-900">Campus Audio-Visual Presentation</h3>
                        <div className="grid gap-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-6">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">YouTube Link</label>
                                        <Input
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            // value={data.vmgo.avp_link || ''}
                                            // onChange={(e) =>
                                            //     setData({
                                            //         ...data,
                                            //         vmgo: {
                                            //             ...data.vmgo,
                                            //             avp_link: e.target.value,
                                            //         },
                                            //     })
                                            // }
                                            // disabled={processing}
                                        />
                                        {/* <InputError message={errors['vmgo.avp_link']} className="mt-2" /> */}
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">Video Title</label>
                                        <Input
                                            placeholder="Enter video title..."
                                            // value={data.vmgo.avp_title || ''}
                                            // onChange={(e) =>
                                            //     setData({
                                            //         ...data,
                                            //         vmgo: {
                                            //             ...data.vmgo,
                                            //             avp_title: e.target.value,
                                            //         },
                                            //     })
                                            // }
                                            // disabled={processing}
                                        />
                                        {/* <InputError message={errors['vmgo.avp_title']} className="mt-2" /> */}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Video Description</label>
                                    <Textarea
                                        className="flex-1"
                                        placeholder="Enter video description..."
                                        // value={data.vmgo.avp_description || ''}
                                        // onChange={(e) =>
                                        //     setData({
                                        //         ...data,
                                        //         vmgo: {
                                        //             ...data.vmgo,
                                        //             avp_description: e.target.value,
                                        //         },
                                        //     })
                                        // }
                                        // disabled={processing}
                                    />
                                    {/* <InputError message={errors['vmgo.avp_description']} className="mt-2" /> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-10 bg-gray-200" />

                    <div className="mb-6">
                        <h3 className="mb-4 text-base font-semibold text-gray-900">Campus Audio-Visual Presentation</h3>

                        {/* Banner Upload */}
                        <div className="mb-8">
                            <div>
                                <div className="mt-5 mb-6 flex flex-col gap-3">
                                    <h3 className="text-sm font-medium text-gray-700">Director's Image</h3>

                                    {/* {!data.page.previewUrl ? ( */}
                                    <label className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12 text-center transition-all duration-300 hover:border-[#7f1414]/70">
                                        <input type="file" className="hidden" accept="image/*" />
                                        <div className="flex flex-col items-center justify-center gap-4 pt-5 pb-6">
                                            <div className="relative">
                                                <div className="rounded-fullopacity-20 absolute inset-0 animate-pulse"></div>
                                                <div className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-dashed transition-transform duration-300 group-hover:scale-105">
                                                    <Upload className="h-6 w-6 text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="mt-4 text-center">
                                                <p className="mb-1 text-lg font-semibold text-gray-700">Upload Director's Image</p>
                                                <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                                            </div>
                                            <div className="mt-2 flex gap-2">
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">PNG</span>
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">JPG</span>
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">Max 5MB</span>
                                            </div>
                                        </div>
                                    </label>
                                    {/* ) : ( */}
                                    {/* <div className="group relative">
                                <img src={data.page.previewUrl} alt="Preview" className="h-48 w-full rounded-lg border border-gray-200 object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-black/40 opacity-0 transition group-hover:opacity-100">
                                    <input id="replace-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-12 w-12 rounded-full bg-white p-0"
                                        onClick={() => document.getElementById('replace-image')?.click()}
                                    >
                                        <Edit2 className="h-5 w-5 text-red-600" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-12 w-12 rounded-full bg-white p-0"
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                page: { ...data.page, banner: null, previewUrl: null },
                                            })
                                        }
                                    >
                                        <Trash2 className="h-5 w-5 text-red-600" />
                                    </Button>
                                </div>
                            </div> */}
                                    {/* )} */}
                                    {/* <InputError message={errors['page.banner']} className="mt-2" /> */}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Director's Message</label>
                                    <Textarea
                                        placeholder="Enter your message..."
                                        autoResize
                                        minHeight={100}
                                        maxHeight={250}
                                        // value={data.page.description}
                                        // onChange={(e) =>
                                        //     setData({
                                        //         ...data,
                                        //         page: { ...data.page, description: e.target.value },
                                        //     })
                                        // }
                                        // disabled={processing}
                                    />
                                    {/* <InputError message={errors['page.description']} className="mt-2" /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <SectionFooter onSave={handleSave} onPreview={handlePreview} />
            </div>
        </>
    );
}
