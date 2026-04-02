import { Button } from '@/components/ui/button';
import { OtherServices } from '@/types/content';
import { EditIcon, Link, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import OtherServicesDialog from '../dialogs/content/other-services-dialog';

interface OtherServicesSectionProps {
    services: OtherServices[];
    onUpdateServices: (updatedServices: OtherServices[]) => void;
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

export default function ServicesSection({...props}: OtherServicesSectionProps) {
    const { services, onUpdateServices } = props;
    const [servicesList, setServicesList] = useState<OtherServices[]>(services ?? []);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogAction, setDialogAction] = useState<'add' | 'edit'>('add');

    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
    const selectedService = servicesList?.find((service) => service.service_id === selectedServiceId) || null;

    useEffect(() => {
        setServicesList(services);
    }, [services]);

    const handleAddService = () => {
        setDialogAction('add');
        setDialogOpen(true);
        setSelectedServiceId(null);
    };

    const handleEditService = (services: OtherServices) => {
        setDialogAction('edit');
        setDialogOpen(true);
        setSelectedServiceId(services.service_id);
    };

    const handleSaveService = (service: OtherServices) => {
        setServicesList((prevServices) => {
            let updatedServices;
            if (dialogAction === 'add') {
                updatedServices = [...prevServices, service];
            } else {
                updatedServices = prevServices.map((s) => (s.service_id === service.service_id ? service : s));
            }
            onUpdateServices(updatedServices);
            return updatedServices;
        });
        setDialogOpen(false);
    };

    const handleDeleteService = (service_id: number) => {
        setServicesList((prevServices) => {
            const updatedServices = prevServices.filter((service) => service.service_id !== service_id);
            if (selectedServiceId === service_id) {
                setSelectedServiceId(null);
            }
            onUpdateServices(updatedServices);
            return updatedServices;
        });
    };

    return (
        <>
            <div className="mb-6">
                <h3 className="mb-4 text-base font-semibold text-gray-900">Services & Portals</h3>

                <div className="flex min-h-[300px] rounded-lg border border-gray-200">
                    {/* Left Pane: Service List */}
                    <div className="flex w-2/3 flex-col justify-between border-r border-gray-200 bg-gray-50/50 p-6">
                        <div className="max-h-[300px] overflow-y-auto pr-2">
                            <h4 className="mb-3 text-xs text-gray-500">Select a Service</h4>
                            <div className="grid grid-cols-2 gap-3 space-y-1">
                                {servicesList?.map((service) => (
                                    <div
                                        key={service.service_id}
                                        onClick={() => setSelectedServiceId(service.service_id)}
                                        className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-3 transition-colors ${
                                            service.service_id === selectedServiceId ? 'bg-[#7f1414]/4' : 'bg-white hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 truncate text-sm">
                                            <Link className="h-4 w-4 flex-shrink-0 text-gray-500" />
                                            <span className={` ${service.service_id === selectedServiceId ? 'font-normal text-red-900' : 'text-gray-700'}`}>
                                                {service.service_name}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-0.5">
                                            <ActionButton
                                                onClick={(e) => {
                                                    handleEditService(service);
                                                }}
                                                className="cursor-pointer rounded-md text-gray-400 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </ActionButton>
                                            <ActionButton
                                                onClick={(e) => {
                                                    handleDeleteService(service.service_id);
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
                                onClick={handleAddService}
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
                                    <h4 className="text-lg font-semibold break-words text-gray-900">{selectedService.service_name}</h4>
                                </div>
                                <div>
                                    <h5 className="mb-1 text-sm font-semibold text-gray-700">Description</h5>
                                    <p className="text-sm text-gray-700">{selectedService.description}</p>
                                </div>
                                <div>
                                    <h5 className="mb-1 text-sm font-semibold text-gray-700">URL</h5>
                                    <a
                                        href={selectedService.service_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="truncate text-sm break-all text-blue-600 hover:underline"
                                    >
                                        {selectedService.service_link}
                                    </a>
                                </div>
                                {/* <div>
                                    <h5 className="mb-1 text-sm font-semibold text-gray-700">Icon Name</h5>
                                    <p className="font-mono text-sm text-muted-foreground">{selectedService.icon_name || 'Not set'}</p>
                                </div> */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {dialogOpen && (
                <OtherServicesDialog
                    type={dialogAction}
                    service={selectedService}
                    onClose={() => setDialogOpen(false)}
                    onSave={handleSaveService}
                />
            )}
        </>
    );
}
