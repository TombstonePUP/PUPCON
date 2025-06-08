import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
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
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion"

import { Button } from "@/components/ui/button"
import {
    type Program,
    type Area,
    type ParameterOutlineCategory,
} from "@/types"
import InputError from '@/components/input-error';
// charts components
interface AreaFilesProps {
    program: Program;
    area?: Area;
    parameterOutlineCategories?: ParameterOutlineCategory[];
}

interface ParameterForm {
    area_id?: number;
    area_parameter_id?: number; // Optional for adding new parameters
    parameter_name: string;
    parameter_description: string;
}

interface ParameterOutlineForm {
    area_parameter_id: number;
    parameter_outline_category_id: number;
    outline_number: string;
    outline_name: string;
    outline_description: string;
    container: boolean;
    file_name?: string;
}

/* interface AreaFileForm {
    parameter_outline_id: number;
    file_name: string; */


export default function Areas({ program, area, parameterOutlineCategories }: AreaFilesProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: program.program_name,
            href: `/manage-program/${program.program_name}`,
        },
        {
            title: area.area_name,
            href: `/manage-program/${program.program_name}/${area.area_id}`,
        },
    ];
    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm<ParameterForm>({
        area_id: area?.area_id,
        area_parameter_id: undefined,
        parameter_name: '',
        parameter_description: '',
    });

    const addParameter = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('manage.area.addParameter', [ program.program_name, area?.area_id ]), {
            onFinish: () => {
                reset('parameter_name', 'parameter_description');
            },
        });
    }
    const editParameter = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('manage.area.updateParameter', [
                program.program_name,
                area?.area_id,
                data.area_parameter_id
            ]), {
            onSuccess: () => {
                reset('parameter_name', 'parameter_description');
            },
        });
    }

    const deleteParameter = (id: number) => {
        console.log('Deleting parameter with ID:', id);
        /* console.log(route(`/manage-program/${program.program_name}/${area?.area_id}/${id}/delete`, {
            program_name: program.program_name,
            area_id: area?.area_id,
            parameter_id: id
        }
        )); */

        destroy(route('manage.area.deleteParameter', [
            program.program_name,
            area?.area_id,
            id,
        ]), {
            onSuccess: () => {
                console.log('Parameter deleted successfully');
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${area.area_name} - ${program.program_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border-2">
                    <h1 className='text-center font-black text-[1.8vw] mb-3 mt-3'>
                        {area.area_name.toUpperCase()}
                    </h1>
                </div>
                <div className='flex flex-row'>
                    <div className='bg-[url]'>

                    </div>
                    <Dialog>
                        <DialogTrigger asChild className='flex-1 border rounded flex items-center flex-col p-10 h-[15vw]'>
                            <Button variant="outline">
                                <svg
                                    className="size-15"
                                    viewBox="0 0 46 46"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M23.0691 15.4943V30.4837M15.5743 22.989H30.5638M41.8058 22.989C41.8058 33.337 33.4171 41.7257 23.0691 41.7257C12.721 41.7257 4.33228 33.337 4.33228 22.989C4.33228 12.6409 12.721 4.2522 23.0691 4.2522C33.4171 4.2522 41.8058 12.6409 41.8058 22.989Z"
                                        stroke="#B4B4B4"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <p className='text-[#B4B4B4]'>Add Card</p>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Card</DialogTitle>
                                <DialogDescription>
                                    Make a new card for Program Performance Profile, Self-Survey, or Compliance
                                </DialogDescription>
                            </DialogHeader>
                            <div className=" flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Card Type</label>
                                    <select
                                        className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                        defaultValue="ppp"
                                    >
                                        <option value="ppp">Program Performance Profile</option>
                                        <option value="self-survey">Self-Survey</option>
                                        <option value="compliance">Compliance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Upload Document</label>
                                    <input
                                        type="file"
                                        className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-semibold file:text-foreground hover:file:bg-accent"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button>Submit</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="border-sidebar-border/70 relative space-y-5 overflow-y-auto rounded-xl border p-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Add Parameter</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Parameter</DialogTitle>
                                <DialogDescription>Parameter A</DialogDescription>
                            </DialogHeader>

                            <form onSubmit={addParameter} className="flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="w-1/4">
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">Parameter</label>
                                        <input
                                            id="parameter_name"
                                            type="text"
                                            // required
                                            autoFocus
                                            maxLength={1}
                                            tabIndex={1}
                                            value={data.parameter_name}
                                            onChange={(e) => setData('parameter_name', e.target.value)}
                                            disabled={processing}
                                            placeholder="A"
                                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                                        <input
                                            id="parameter_description"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={2}
                                            value={data.parameter_description}
                                            onChange={(e) => setData('parameter_description', e.target.value)}
                                            disabled={processing}
                                            placeholder="Enter description"
                                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                </div>
                                <InputError message={errors.parameter_name} className="mt-2" />
                                <InputError message={errors.parameter_description} className="mt-2" />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button tabIndex={3} variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" tabIndex={4}>Submit</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    {area.area_parameters?.length ? (
                        area.area_parameters.map((parameter) => (
                        <Accordion type="single" collapsible className='w-[100%] flex flex-col gap-[1vw]'>
                            <AccordionItem value="item-1">
                                <AccordionTrigger className='flex flex-row justify-between items-center'>
                                    <div className="flex flex-row justify-between w-full ">
                                        <h1 className='text-[#7f1414] font-black text-lg'>
                                            {parameter.parameter_name ? `Parameter ${parameter.parameter_name}` : null }
                                        </h1>
                                        <p className='text-lg'>{parameter.parameter_description}</p>
                                    </div>
                                    <div className='flex justify-center gap-3'>
                                        <Dialog>
                                            <DialogTrigger asChild >
                                                <Button>Edit</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Parameter</DialogTitle>
                                                    <DialogDescription>Parameter {parameter.parameter_name}</DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={editParameter} className="flex flex-col gap-4">
                                                    <div className="flex gap-4">
                                                        <div className="w-1/4">
                                                            <label className="block text-sm font-medium text-muted-foreground mb-1">Parameter</label>
                                                            <input
                                                                id="parameter_name"
                                                                type="text"
                                                                autoFocus
                                                                maxLength={1}
                                                                tabIndex={1}
                                                                value={data.parameter_name}
                                                                onChange={(e) => {
                                                                    // setData('area_id', undefined); // Reset area_id for editing
                                                                    setData('parameter_name', e.target.value)
                                                                    setData('area_parameter_id', parameter.area_parameter_id);
                                                                }}
                                                                disabled={processing}
                                                                placeholder={parameter.parameter_name || "A"}
                                                                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                                                            <input
                                                                id="parameter_description"
                                                                type="text"
                                                                required
                                                                autoFocus
                                                                // value={parameter.parameter_description}
                                                                value={data.parameter_description}
                                                                tabIndex={2}
                                                                onChange={(e) => setData('parameter_description', e.target.value)}
                                                                disabled={processing}
                                                                placeholder={parameter.parameter_description || "Enter description"}
                                                                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                            />
                                                        </div>
                                                    </div>
                                                    <InputError message={errors.parameter_name} className="mt-2" />
                                                    <InputError message={errors.parameter_description} className="mt-2" />
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button tabIndex={3} variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <Button type="submit" tabIndex={4}>Submit</Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="reverse">Remove</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Are you sure?</DialogTitle>
                                                    <DialogDescription>
                                                        This action cannot be undone. This will permanently delete the <b>Parameter {parameter.parameter_name}</b>.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <Button disabled={processing} onClick={() => deleteParameter(parameter.area_parameter_id)} type="submit">
                                                        Remove
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    {parameterOutlineCategories?.some(category =>
                                        category.parameter_outlines?.some(outline =>
                                            outline.area_parameter_id === parameter.area_parameter_id
                                        )
                                    ) ? (
                                        parameterOutlineCategories.map((category) => {
                                            const outlinesForParameter = category.parameter_outlines?.filter(
                                                (outline) => outline.area_parameter_id === parameter.area_parameter_id
                                            ) ?? [];
                                            if (!outlinesForParameter.length) return null;
                                            return (
                                                <div key={category.id} className='bg-[#D9D9D9] p-[2vw] rounded'>
                                                    <h1 className='font-black text-[1vw]'>{category.category_name}</h1>
                                                    <ul className='pl-[1vw]'>
                                                        {outlinesForParameter.map((outline) => (
                                                            <li key={outline.id}>
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <a className='cursor-pointer underline text-[#7f1414]'>
                                                                            {outline.outline_description}
                                                                        </a>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Attach Document</DialogTitle>
                                                                            <DialogDescription>
                                                                                Attach a document to the outline: <b>{outline.outline_description}</b>
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="flex flex-col gap-4">
                                                                            <div>
                                                                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                                                    Upload Document
                                                                                </label>
                                                                                <input
                                                                                    type="file"
                                                                                    className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-semibold file:text-foreground hover:file:bg-accent"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <DialogFooter>
                                                                            <DialogClose asChild>
                                                                                <Button variant="outline">Cancel</Button>
                                                                            </DialogClose>
                                                                            <Button>Submit</Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className='flex flex-col items-center justify-center w-full h-full'>
                                            <h1 className='text-[1.5vw] font-bold'>Content Not Available</h1>
                                            <p className='text-[1.2vw] text-[#858585]'>No Available Outline/Files in This Parameter.</p>
                                        </div>
                                    )}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <a className='cursor-pointer underline'>Add Outline</a>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add Outline</DialogTitle>
                                                <DialogDescription>
                                                    Make a new outline for {parameter.parameter_name}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className=" flex flex-col gap-4">
                                                <div>
                                                    <textarea
                                                        placeholder="Enter outline description"
                                                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring resize-y min-h-[100px]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Upload Document</label>
                                                    <input
                                                        type="file"
                                                        className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-semibold file:text-foreground hover:file:bg-accent"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <Button>Submit</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        ))
                    ) : (
                        <div className='flex flex-col items-center justify-center w-full h-full'>
                            <h1 className='text-[1.5vw] font-bold'>Content Not Available</h1>
                            <p className='text-[1.2vw] text-[#858585]'>No Available Parameters in This Area.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
