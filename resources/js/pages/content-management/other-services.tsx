import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { EditIcon, FileText, LibrarySquare, Link, Plus, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Other services',
        href: `/other-services`,
    },
];

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

type DocumentForm = {
    id: number;
    title: string;
    desc: string;
    file_path: string | null;
};

type ServiceLink = {
    id: number;
    title: string;
    desc: string;
    href: string;
    icon_name: string;
};

// --- Static Data ---
const initialDocumentForms: DocumentForm[] = [
    {
        id: 1,
        title: 'Admission Form (Form 137)',
        desc: 'Required for all incoming freshmen and transferees.',
        file_path: '/downloads/admission_form_137.pdf',
    },
    {
        id: 2,
        title: 'Scholarship Application Form',
        desc: 'Application form for university-sponsored scholarships.',
        file_path: '/downloads/scholarship_app_form.pdf',
    },
];

const initialServiceLinks: ServiceLink[] = [
    {
        id: 1,
        title: 'University Student Portal',
        desc: 'Access your student account, grades, and course info online.',
        href: 'https://studentportal.example.com',
        icon_name: 'User',
    },
    {
        id: 2,
        title: 'Online Guidance Appointment',
        desc: 'Schedule guidance counseling sessions easily through this portal.',
        href: 'https://guidance.example.com',
        icon_name: 'Calendar',
    },
];

const getNewId = (arr: { id: number }[]) => (arr.length > 0 ? Math.max(...arr.map((item) => item.id)) + 1 : 1);

const OthersContentSection: React.FC = () => {
    const [pageData, setPageData] = useState({
        title: 'Other Services & Portals',
        subtitle:
            'Quick access to official university portals, campus-built systems, downloadable forms, and trusted external resources for students and faculty.',
    });

    // --- State for Forms ---
    const [documentForms, setDocumentForms] = useState<DocumentForm[]>(initialDocumentForms);
    const [selectedFormId, setSelectedFormId] = useState<number | null>(initialDocumentForms[0]?.id || null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingForm, setEditingForm] = useState<DocumentForm | null>(null);
    const [formFormData, setFormFormData] = useState({ title: '', desc: '' });
    const [formFile, setFormFile] = useState<File | null>(null); // For file upload

    // --- State for Services ---
    const [serviceLinks, setServiceLinks] = useState<ServiceLink[]>(initialServiceLinks);
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(initialServiceLinks[0]?.id || null);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceLink | null>(null);
    const [serviceFormData, setServiceFormData] = useState({ title: '', desc: '', href: '', icon_name: '' });

    const selectedForm = documentForms.find((f) => f.id === selectedFormId);
    const selectedService = serviceLinks.find((s) => s.id === selectedServiceId);

    // --- Page Handlers ---
    const handleChange = (field: string, value: string) => {
        setPageData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        console.log('Saving Others Page...', { pageData, documentForms, serviceLinks });
    };

    const handlePreview = () => {
        window.open('/others', '_blank');
    };

    // --- Document Form CRUD Actions ---
    const resetFormModal = () => {
        setEditingForm(null);
        setFormFormData({ title: '', desc: '' });
        setFormFile(null);
        setIsFormModalOpen(false);
    };

    const handleShowAddFormModal = () => {
        resetFormModal();
        setIsFormModalOpen(true);
    };

    const handleShowEditFormModal = (form: DocumentForm) => {
        setEditingForm(form);
        setFormFormData({ title: form.title, desc: form.desc });
        setFormFile(null);
        setIsFormModalOpen(true);
    };

    const handleDeleteForm = (id: number) => {
        if (window.confirm('Are you sure you want to delete this form?')) {
            const updatedForms = documentForms.filter((f) => f.id !== id);
            setDocumentForms(updatedForms);
            if (selectedFormId === id) {
                setSelectedFormId(updatedForms[0]?.id || null);
            }
        }
    };

    const handleConfirmSaveForm = () => {
        if (!formFormData.title.trim()) {
            alert('Form Title cannot be empty.');
            return;
        }
        if (!formFile && !editingForm) {
            alert('Please select a file to upload.');
            return;
        }

        const newFilePath = formFile ? `/downloads/${formFile.name}` : editingForm?.file_path || null;

        if (editingForm) {
            const updatedForm = {
                ...editingForm,
                ...formFormData,
                file_path: newFilePath,
            };
            setDocumentForms(documentForms.map((f) => (f.id === editingForm.id ? updatedForm : f)));
        } else {
            const newId = getNewId(documentForms);
            const newForm: DocumentForm = {
                id: newId,
                ...formFormData,
                file_path: newFilePath,
            };
            setDocumentForms([...documentForms, newForm]);
            setSelectedFormId(newId);
        }
        resetFormModal();
    };

    // --- Service Link CRUD Actions ---
    const resetServiceModal = () => {
        setEditingService(null);
        setServiceFormData({ title: '', desc: '', href: '', icon_name: '' });
        setIsServiceModalOpen(false);
    };

    const handleShowAddServiceModal = () => {
        resetServiceModal();
        setIsServiceModalOpen(true);
    };

    const handleShowEditServiceModal = (service: ServiceLink) => {
        setEditingService(service);
        setServiceFormData({
            title: service.title,
            desc: service.desc,
            href: service.href,
            icon_name: service.icon_name,
        });
        setIsServiceModalOpen(true);
    };

    const handleDeleteService = (id: number) => {
        if (window.confirm('Are you sure you want to delete this service link?')) {
            const updatedServices = serviceLinks.filter((s) => s.id !== id);
            setServiceLinks(updatedServices);
            if (selectedServiceId === id) {
                setSelectedServiceId(updatedServices[0]?.id || null);
            }
        }
    };

    const handleConfirmSaveService = () => {
        if (!serviceFormData.title.trim() || !serviceFormData.href.trim()) {
            alert('Title and URL cannot be empty.');
            return;
        }

        if (editingService) {
            const updatedService = { ...editingService, ...serviceFormData };
            setServiceLinks(serviceLinks.map((s) => (s.id === editingService.id ? updatedService : s)));
        } else {
            const newId = getNewId(serviceLinks);
            const newService: ServiceLink = {
                id: newId,
                ...serviceFormData,
            };
            setServiceLinks([...serviceLinks, newService]);
            setSelectedServiceId(newId);
        }
        resetServiceModal();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                {/* Header Section */}
                <div className="mb-2 rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]">
                            <LibrarySquare className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-2">
                            <h1 className="text-xl font-semibold text-gray-900">Other Services</h1>
                            <p className="text-sm text-gray-500">Manage all content related to the "Other services" page and its sub-sections.</p>
                        </div>
                    </div>
                </div>
                <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
                    <div className="p-8">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Other Services & Portals Page</h2>
                            <p className="text-sm text-gray-600">Configure page content</p>
                        </div>

                        <div className="mb-10 grid grid-cols-1 gap-6">
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter page title..."
                                    value={pageData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Subtitle / Description</Label>
                                <Textarea
                                    placeholder="Enter page subtitle..."
                                    value={pageData.subtitle}
                                    onChange={(e) => handleChange('subtitle', e.target.value)}
                                    autoResize
                                    minHeight={100}
                                />
                            </div>
                        </div>

                        <Separator className="my-10 bg-gray-200" />

                        {/* --- Downloadable Forms Section --- */}
                        <div className="mb-6">
                            <h3 className="mb-4 text-base font-semibold text-gray-900">Downloadable Forms</h3>

                            <div className="flex min-h-[300px] rounded-lg border border-gray-200">
                                {/* Left Pane: Form List */}
                                <div className="flex w-2/3 flex-col justify-between border-r border-gray-200 bg-gray-50/50 p-6">
                                    <div className="max-h-[300px] overflow-y-auto pr-2">
                                        <h4 className="mb-3 text-xs text-gray-500">Select a Form</h4>
                                        <div className="grid grid-cols-2 gap-3 space-y-1">
                                            {documentForms.map((form) => (
                                                <div
                                                    key={form.id}
                                                    onClick={() => setSelectedFormId(form.id)}
                                                    className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-3 transition-colors ${
                                                        form.id === selectedFormId ? 'bg-[#7f1414]/4' : 'bg-white hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 truncate text-sm">
                                                        <FileText className="h-4 w-4 flex-shrink-0 text-gray-500" />
                                                        <span
                                                            className={` ${form.id === selectedFormId ? 'font-normal text-red-900' : 'text-gray-700'}`}
                                                        >
                                                            {form.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-0.5">
                                                        <ActionButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleShowEditFormModal(form);
                                                            }}
                                                            className="cursor-pointer rounded-md text-gray-400 hover:bg-red-50 hover:text-red-700"
                                                        >
                                                            <EditIcon className="h-4 w-4" />
                                                        </ActionButton>
                                                        <ActionButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteForm(form.id);
                                                            }}
                                                            className="cursor-pointer rounded-md text-gray-400 hover:bg-red-50 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </ActionButton>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                        <Button
                                            onClick={handleShowAddFormModal}
                                            className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Add New Form
                                        </Button>
                                    </div>
                                </div>

                                {/* Right Pane: Form Details */}
                                <div className="w-1/2 p-6">
                                    {!selectedForm ? (
                                        <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                            <X className="mb-2 h-8 w-8" />
                                            <p className="font-medium">No Form Selected</p>
                                            <p className="text-sm">Select a form on the left or click "Add New Form" to start.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-lg font-semibold break-words text-gray-900">{selectedForm.title}</h4>
                                            </div>
                                            <div>
                                                <h5 className="mb-1 text-sm font-semibold text-gray-700">Description</h5>
                                                <p className="text-sm text-gray-700">{selectedForm.desc}</p>
                                            </div>
                                            <div>
                                                <h5 className="mb-1 text-sm font-semibold text-gray-700">File Path</h5>
                                                <p className="truncate text-sm text-gray-500 italic">
                                                    {selectedForm.file_path || 'No file uploaded'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator className="my-10 bg-gray-200" />

                        {/* --- Services & Portals Section --- */}
                        <div className="mb-6">
                            <h3 className="mb-4 text-base font-semibold text-gray-900">Services & Portals</h3>

                            <div className="flex min-h-[300px] rounded-lg border border-gray-200">
                                {/* Left Pane: Service List */}
                                <div className="flex w-2/3 flex-col justify-between border-r border-gray-200 bg-gray-50/50 p-6">
                                    <div className="max-h-[300px] overflow-y-auto pr-2">
                                        <h4 className="mb-3 text-xs text-gray-500">Select a Service</h4>
                                        <div className="grid grid-cols-2 gap-3 space-y-1">
                                            {serviceLinks.map((service) => (
                                                <div
                                                    key={service.id}
                                                    onClick={() => setSelectedServiceId(service.id)}
                                                    className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-3 transition-colors ${
                                                        service.id === selectedServiceId ? 'bg-[#7f1414]/4' : 'bg-white hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 truncate text-sm">
                                                        <Link className="h-4 w-4 flex-shrink-0 text-gray-500" />
                                                        <span
                                                            className={` ${service.id === selectedServiceId ? 'font-normal text-red-900' : 'text-gray-700'}`}
                                                        >
                                                            {service.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-0.5">
                                                        <ActionButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleShowEditServiceModal(service);
                                                            }}
                                                            className="cursor-pointer rounded-md text-gray-400 hover:bg-red-50 hover:text-red-700"
                                                        >
                                                            <EditIcon className="h-4 w-4" />
                                                        </ActionButton>
                                                        <ActionButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteService(service.id);
                                                            }}
                                                            className="cursor-pointer rounded-md text-gray-400 hover:bg-red-50 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </ActionButton>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                        <Button
                                            onClick={handleShowAddServiceModal}
                                            className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Add New Service
                                        </Button>
                                    </div>
                                </div>

                                {/* Right Pane: Service Details */}
                                <div className="w-1/2 p-6">
                                    {!selectedService ? (
                                        <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                            <X className="mb-2 h-8 w-8" />
                                            <p className="font-medium">No Service Selected</p>
                                            <p className="text-sm">Select a service on the left or click "Add New Service" to start.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-lg font-semibold break-words text-gray-900">{selectedService.title}</h4>
                                            </div>
                                            <div>
                                                <h5 className="mb-1 text-sm font-semibold text-gray-700">Description</h5>
                                                <p className="text-sm text-gray-700">{selectedService.desc}</p>
                                            </div>
                                            <div>
                                                <h5 className="mb-1 text-sm font-semibold text-gray-700">URL</h5>
                                                <a
                                                    href={selectedService.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="truncate text-sm break-all text-blue-600 hover:underline"
                                                >
                                                    {selectedService.href}
                                                </a>
                                            </div>
                                            <div>
                                                <h5 className="mb-1 text-sm font-semibold text-gray-700">Icon Name</h5>
                                                <p className="font-mono text-sm text-gray-500">{selectedService.icon_name || 'Not set'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <SectionFooter onSave={handleSave} onPreview={handlePreview} />

                    {/* --- Add/Edit Form Modal --- */}
                    {isFormModalOpen && (
                        <div data-state="open" className="animate-in fade-in-0 fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                            <div data-state="open" className="animate-in fade-in-0 zoom-in-95 w-full max-w-lg rounded-lg bg-white p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">{editingForm ? 'Edit Form' : 'Add New Form'}</h3>
                                    <button onClick={resetFormModal} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="mt-6 max-h-[70vh] space-y-4 overflow-y-auto pr-2">
                                    <div>
                                        <Label className="mb-2 block text-sm font-medium text-gray-700">File</Label>
                                        {/* This is a placeholder. For a real app, you'd use a file input */}
                                        <Input type="file" onChange={(e) => setFormFile(e.target.files ? e.target.files[0] : null)} />
                                        {editingForm && editingForm.file_path && (
                                            <p className="mt-2 text-xs text-gray-500">
                                                Current file: {editingForm.file_path}. Upload a new file to replace it.
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label className="mb-2 block text-sm font-medium text-gray-700">Form Title</Label>
                                        <Input
                                            placeholder="e.g., Admission Form (Form 137)"
                                            value={formFormData.title}
                                            onChange={(e) => setFormFormData({ ...formFormData, title: e.target.value })}
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block text-sm font-medium text-gray-700">Description</Label>
                                        <Textarea
                                            placeholder="Enter a brief description..."
                                            value={formFormData.desc}
                                            onChange={(e) => setFormFormData({ ...formFormData, desc: e.target.value })}
                                            autoResize
                                            minHeight={80}
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={resetFormModal}
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleConfirmSaveForm}
                                        className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                    >
                                        {editingForm ? 'Save Changes' : 'Add Form'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- Add/Edit Service Modal --- */}
                    {isServiceModalOpen && (
                        <div data-state="open" className="animate-in fade-in-0 fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                            <div data-state="open" className="animate-in fade-in-0 zoom-in-95 w-full max-w-lg rounded-lg bg-white p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                                    <button
                                        onClick={resetServiceModal}
                                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="mt-6 max-h-[70vh] space-y-4 overflow-y-auto pr-2">
                                    <div>
                                        <Label className="mb-2 block text-sm font-medium text-gray-700">Title</Label>
                                        <Input
                                            placeholder="e.g., University Student Portal"
                                            value={serviceFormData.title}
                                            onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block text-sm font-medium text-gray-700">Description</Label>
                                        <Textarea
                                            placeholder="Enter a brief description..."
                                            value={serviceFormData.desc}
                                            onChange={(e) => setServiceFormData({ ...serviceFormData, desc: e.target.value })}
                                            autoResize
                                            minHeight={80}
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block text-sm font-medium text-gray-700">URL (Link)</Label>
                                        <Input
                                            placeholder="https://studentportal.example.com"
                                            value={serviceFormData.href}
                                            onChange={(e) => setServiceFormData({ ...serviceFormData, href: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label className="mb-2 block text-sm font-medium text-gray-700">Icon Name (from lucide-react)</Label>
                                        <Input
                                            placeholder="e.g., User, Calendar, Database"
                                            value={serviceFormData.icon_name}
                                            onChange={(e) => setServiceFormData({ ...serviceFormData, icon_name: e.target.value })}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Find icon names at lucide.dev</p>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={resetServiceModal}
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleConfirmSaveService}
                                        className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                    >
                                        {editingService ? 'Save Changes' : 'Add Service'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default OthersContentSection;
