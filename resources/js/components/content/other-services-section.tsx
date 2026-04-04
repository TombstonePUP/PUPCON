import { Button } from '@/components/ui/button';
import { OtherServices } from '@/types/content';
import { EditIcon, Link, Plus, Trash2, X, MousePointerClick, LibrarySquare } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import OtherServicesDialog from '../dialogs/content/other-services-dialog';
import { Separator } from '@/components/ui/separator';
import { LucideIcon } from 'lucide-react';

type EmptyStateProps = {
    icon?: LucideIcon;
    title: string;
    description?: string;
};

export function EmptyState({ icon: Icon = MousePointerClick, title, description }: EmptyStateProps) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <div className="rounded-full bg-muted p-4">
                <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground/80">{title}</p>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
        </div>
    );
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-muted-foreground transition-colors hover:text-foreground ${className}`} type="button" {...props}>
        {children}
    </button>
);

interface OtherServicesSectionProps {
    services: OtherServices[];
    onUpdateServices: (updatedServices: OtherServices[]) => void;
}

export default function ServicesSection({ ...props }: OtherServicesSectionProps) {
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

    const handleEditService = (service: OtherServices) => {
        setSelectedServiceId(service.service_id);
        setDialogAction('edit');
        setDialogOpen(true);
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
                <h3 className="mb-4 text-base font-semibold text-foreground">Services & Portals</h3>

                <div className="flex min-h-[400px] rounded-lg border border-border">
                    {/* Left Pane: Service List (1/3) */}
                    <div className="flex w-1/3 flex-col border-r border-border bg-muted/30 p-4">
                        <h4 className="mb-3 text-xs text-muted-foreground">Select a Service</h4>
                        <div className="flex-1 overflow-y-auto space-y-1">
                            {servicesList?.length === 0 ? (
                                <div className="h-[200px]">
                                    <EmptyState icon={LibrarySquare} title="No services added" />
                                </div>
                            ) : (
                                servicesList?.map((service) => (
                                    <div
                                        key={service.service_id}
                                        onClick={() => setSelectedServiceId(service.service_id)}
                                        className={`group flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 transition-colors ${service.service_id === selectedServiceId
                                            ? 'border-primary/30 bg-primary/10 text-primary/95'
                                            : 'border-border bg-background text-foreground hover:border-primary/20 hover:bg-primary/5'
                                            }`}
                                    >
                                        <div className="flex min-w-0 items-center gap-2">
                                            <span className="truncate text-sm">{service.service_name}</span>
                                        </div>
                                        <div className="flex shrink-0 items-center space-x-0.5 opacity-0 group-hover:opacity-100">
                                            <ActionButton
                                                onClick={(e) => { e.stopPropagation(); handleEditService(service); }}
                                                className="cursor-pointer rounded-md hover:bg-muted hover:text-foreground"
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </ActionButton>
                                            <ActionButton
                                                onClick={(e) => { e.stopPropagation(); handleDeleteService(service.service_id); }}
                                                className="cursor-pointer rounded-md hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </ActionButton>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-4 border-t border-border pt-4">
                            <Button onClick={handleAddService} variant="default" className="w-full text-xs">
                                <Plus className="h-4 w-4" />
                                <span className="hidden xl:inline">Add Service</span>
                            </Button>
                        </div>
                    </div>

                    {/* Right Pane: Detail View (2/3) */}
                    <div className="w-2/3 p-6">
                        {selectedService ? (
                            <div className="flex h-full flex-col justify-between gap-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="break-words text-lg font-semibold text-foreground">{selectedService.service_name}</h4>
                                        {selectedService.service_link && (
                                            <a
                                                href={selectedService.service_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline text-xs flex items-center gap-1"
                                            >
                                                <Link className="h-3 w-3" />
                                                Visit Link
                                            </a>
                                        )}
                                    </div>
                                    <Separator />
                                    <div className="rounded-md border border-border bg-muted/30 p-4">
                                        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</p>
                                        <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                                            {selectedService.description || "No description provided."}
                                        </p>
                                    </div>
                                    {selectedService.service_link && (
                                        <div className="rounded-md border border-border bg-muted/30 p-4">
                                            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Service Link</p>
                                            <code className="text-xs text-primary break-all">{selectedService.service_link}</code>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <EmptyState
                                icon={MousePointerClick}
                                title="No service selected"
                                description="Select a service from the list to view details"
                            />
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
