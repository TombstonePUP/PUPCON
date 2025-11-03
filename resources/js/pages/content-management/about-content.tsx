import ImageUploader from '@/components/imageuploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { EditIcon, Plus, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';

// --- All this logic was extracted from AboutContent.tsx ---

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

type Organization = {
    id: number;
    type_id: number;
    name: string;
    affiliation: string;
};

type OrgType = {
    id: number;
    name: string;
};

const initialOrgTypes: OrgType[] = [
    { id: 1, name: 'Academic Organizations' },
    { id: 2, name: 'Non-Academic Organizations' },
];

const initialOrganizations: Organization[] = [
    { id: 101, type_id: 1, name: 'Governing League of Information Technology Challengers', affiliation: 'BS Information Technology' },
    { id: 201, type_id: 2, name: 'Commission on Athletics and Sports', affiliation: 'Athletics & Sports Club' },
];

const getNewId = (arr: { id: number }[]) => (arr.length > 0 ? Math.max(...arr.map((item) => item.id)) + 1 : 1);

const OrganizationsSection = () => {
    const [orgTypes, setOrgTypes] = useState<OrgType[]>(initialOrgTypes);
    const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
    const [selectedOrgTypeId, setSelectedOrgTypeId] = useState<number | null>(initialOrgTypes[0]?.id || null);

    const [isOrgTypeModalOpen, setIsOrgTypeModalOpen] = useState(false);
    const [editingOrgType, setEditingOrgType] = useState<OrgType | null>(null);
    const [orgTypeName, setOrgTypeName] = useState('');

    const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
    const [orgFormData, setOrgFormData] = useState({ name: '', affiliation: '' });

    const selectedOrgType = orgTypes.find((t) => t.id === selectedOrgTypeId);
    const filteredOrganizations = organizations.filter((org) => org.type_id === selectedOrgTypeId);

    const resetOrgTypeForm = () => {
        setEditingOrgType(null);
        setOrgTypeName('');
        setIsOrgTypeModalOpen(false);
    };

    const handleShowAddOrgTypeModal = () => {
        resetOrgTypeForm();
        setIsOrgTypeModalOpen(true);
    };

    const handleShowEditOrgTypeModal = (type: OrgType) => {
        setEditingOrgType(type);
        setOrgTypeName(type.name);
        setIsOrgTypeModalOpen(true);
    };

    const handleConfirmSaveOrgType = () => {
        if (!orgTypeName.trim()) return alert('Type name cannot be empty.');
        if (editingOrgType) {
            setOrgTypes(orgTypes.map((t) => (t.id === editingOrgType.id ? { ...t, name: orgTypeName } : t)));
        } else {
            const newType: OrgType = { id: getNewId(orgTypes), name: orgTypeName };
            setOrgTypes([...orgTypes, newType]);
            setSelectedOrgTypeId(newType.id);
        }
        resetOrgTypeForm();
    };

    const handleDeleteOrgType = (id: number) => {
        if (window.confirm('Are you sure? This will also delete all organizations inside it.')) {
            setOrgTypes(orgTypes.filter((t) => t.id !== id));
            setOrganizations(organizations.filter((org) => org.type_id !== id));
            if (selectedOrgTypeId === id) {
                setSelectedOrgTypeId(orgTypes[0]?.id || null);
            }
        }
    };

    const resetOrgForm = () => {
        setEditingOrg(null);
        setOrgFormData({ name: '', affiliation: '' });
        setIsOrgModalOpen(false);
    };

    const handleShowAddOrgModal = () => {
        resetOrgForm();
        setIsOrgModalOpen(true);
    };

    const handleShowEditOrgModal = (org: Organization) => {
        setEditingOrg(org);
        setOrgFormData({ name: org.name, affiliation: org.affiliation });
        setIsOrgModalOpen(true);
    };

    const handleConfirmSaveOrg = () => {
        if (!orgFormData.name.trim()) return alert('Organization name cannot be empty.');
        if (editingOrg) {
            setOrganizations(organizations.map((org) => (org.id === editingOrg.id ? { ...org, ...orgFormData } : org)));
        } else {
            const newOrg: Organization = {
                id: getNewId(organizations),
                type_id: selectedOrgTypeId!,
                ...orgFormData,
            };
            setOrganizations([...organizations, newOrg]);
        }
        resetOrgForm();
    };

    const handleDeleteOrg = (id: number) => {
        if (window.confirm('Delete this organization?')) {
            setOrganizations(organizations.filter((org) => org.id !== id));
        }
    };

    return (
        <>
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Campus Organizations</h2>
                <p className="text-sm text-gray-600">Manage academic and non-academic organizations</p>
            </div>

            {/* --- Master Layout for Orgs --- */}
            <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                {/* Left Pane: Org Type List */}
                <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                    <h4 className="mb-3 text-xs text-gray-500">Select an Organization Type</h4>
                    <div className="space-y-1">
                        {orgTypes.map((type) => (
                            <div
                                key={type.id}
                                onClick={() => setSelectedOrgTypeId(type.id)}
                                className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 transition-colors ${
                                    type.id === selectedOrgTypeId ? 'bg-[#7f1414]/4' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className={`truncate text-sm ${type.id === selectedOrgTypeId ? 'font-normal text-red-900' : 'text-gray-700'}`}>
                                    {type.name}
                                </span>
                                <div
                                    className={`flex items-center space-x-0.5 transition-opacity ${type.id === selectedOrgTypeId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                >
                                    <ActionButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShowEditOrgTypeModal(type);
                                        }}
                                        className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                    >
                                        <EditIcon className="h-4 w-4" />
                                    </ActionButton>
                                    <ActionButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteOrgType(type.id);
                                        }}
                                        className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </ActionButton>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <Button
                            onClick={handleShowAddOrgTypeModal}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add New Type
                        </Button>
                    </div>
                </div>

                {/* Right Pane: Organization List */}
                <div className="w-2/3 p-6">
                    {!selectedOrgType ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                            <X className="mb-2 h-8 w-8" />
                            <p className="font-medium">No Type Selected</p>
                            <p className="text-sm">Select a type on the left or add a new one.</p>
                        </div>
                    ) : (
                        <>
                            <h4 className="mb-6 truncate text-lg font-medium text-gray-900">{selectedOrgType.name}</h4>
                            <div className="max-h-[300px] space-y-3 overflow-y-auto pr-2">
                                {filteredOrganizations.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">No organizations added to this type yet.</p>
                                ) : (
                                    filteredOrganizations.map((org) => (
                                        <div
                                            key={org.id}
                                            className="group flex items-start justify-between rounded-md border border-gray-100 bg-white p-3 px-6 transition-all hover:border-red-200"
                                        >
                                            <div>
                                                <span className="block text-sm font-medium text-gray-900">{org.name}</span>
                                                <span className="text-xs text-gray-500">{org.affiliation}</span>
                                            </div>
                                            <div className="flex flex-shrink-0 items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <ActionButton onClick={() => handleShowEditOrgModal(org)}>
                                                    <EditIcon className="h-4 w-4" />
                                                </ActionButton>
                                                <ActionButton onClick={() => handleDeleteOrg(org.id)} className="hover:text-red-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mt-6">
                                <Button
                                    onClick={handleShowAddOrgModal}
                                    className="flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                >
                                    <Plus className="h-4 w-4" />
                                    New Organization
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* --- MODAL FOR ORGANIZATIONS --- */}
            {isOrgTypeModalOpen && (
                <div className="animate-in fade-in-0 fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="animate-in fade-in-0 zoom-in-95 w-full max-w-md rounded-lg bg-white p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{editingOrgType ? 'Edit Type' : 'Add New Type'}</h3>
                            <button onClick={resetOrgTypeForm} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="mt-6">
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Type Name</Label>
                            <Input
                                placeholder="e.g., Academic Organizations"
                                value={orgTypeName}
                                onChange={(e) => setOrgTypeName(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetOrgTypeForm}
                                className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSaveOrgType}
                                className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                            >
                                {editingOrgType ? 'Save Changes' : 'Add Type'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Organization Modal --- */}
            {isOrgModalOpen && (
                <div data-state="open" className="animate-in fade-in-0 fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div data-state="open" className="animate-in fade-in-0 zoom-in-95 y w-full max-w-md transform rounded-lg bg-white p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{editingOrg ? 'Edit Organization' : 'Add New Organization'}</h3>
                            <button onClick={resetOrgForm} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">
                                Adding to: <span className="font-medium text-[#7f1414]">{selectedOrgType?.name}</span>
                            </p>
                        </div>
                        <div className="mt-6 space-y-4">
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Organization Name</Label>
                                <Input
                                    placeholder="Enter organization name"
                                    value={orgFormData.name}
                                    onChange={(e) => setOrgFormData({ ...orgFormData, name: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Affiliation</Label>
                                <Input
                                    placeholder="e.g., BS Information Technology"
                                    value={orgFormData.affiliation}
                                    onChange={(e) => setOrgFormData({ ...orgFormData, affiliation: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetOrgForm}
                                className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSaveOrg}
                                className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                            >
                                {editingOrg ? 'Save Changes' : 'Add Organization'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const AboutPageSection = () => {
    const [aboutData, setAboutData] = useState({
        welcome_title: '',
        welcome_subtitle: '',
        address: '',
        phone_number: '',
    });
    const [bannerFile, setBannerFile] = useState(null);

    const handleChange = (field, value) => {
        setAboutData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        console.log('Saving About Page Section...', { aboutData, bannerFile });
    };

    const handlePreview = () => {
        window.open('/about', '_blank');
    };

    return (
        <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">About Page</h2>
                    <p className="text-sm text-gray-600">Configure main about page content</p>
                </div>

                {/* Welcome Title & Subtitle */}
                <div className="mb-10 grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                        <Input
                            type="text"
                            value={aboutData.welcome_title}
                            onChange={(e) => handleChange('welcome_title', e.target.value)}
                            placeholder="Enter welcome title..."
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle</label>
                        <Input
                            type="text"
                            value={aboutData.welcome_subtitle}
                            onChange={(e) => handleChange('welcome_subtitle', e.target.value)}
                            placeholder="Enter welcome subtitle..."
                        />
                    </div>
                </div>

                {/* Banner Image Upload */}
                <div className="mb-8">
                    <h3 className="mb-2 text-sm font-medium text-gray-700">Welcome Banner</h3>
                    <ImageUploader
                        initialImage="/images/sample-banner.png"
                        onImageChange={(file) => setBannerFile(file)}
                        uploadText="Upload welcome banner"
                        changeText="Change banner"
                        sizeText="PNG, JPG up to 5MB"
                    />
                </div>

                <Separator className="my-10 bg-gray-200" />

                <div className="mb-10">
                    <OrganizationsSection />
                </div>

                <Separator className="my-10 bg-gray-200" />

                {/* Contact & Office Hours */}
                <div className="space-y-4 text-sm">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Contact & Office Hours</h2>
                        <p className="text-sm text-gray-600">Configure campus basic contact information</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
                            <Input
                                type="text"
                                value={aboutData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                placeholder="Enter campus address..."
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Phone number</label>
                            <Input
                                type="text"
                                value={aboutData.phone_number}
                                onChange={(e) => handleChange('phone_number', e.target.value)}
                                placeholder="Enter phone number..."
                            />
                        </div>
                    </div>
                </div>
            </div>
            <SectionFooter onSave={handleSave} onPreview={handlePreview} />
        </div>
    );
};

export default AboutPageSection;
