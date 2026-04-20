import { MasterDetailPanel } from '@/components/master-detail-panel';
import { Separator } from '@/components/ui/separator';
import { OtherServices } from '@/types/content';
import { LibrarySquare, Link, MousePointerClick } from 'lucide-react';
import { useEffect, useState } from 'react';
import OtherServicesDialog from '../dialogs/content/other-services-dialog';

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

    const selectedService = servicesList?.find((s) => s.service_id === selectedServiceId) ?? null;

    useEffect(() => {
        setServicesList(services);
    }, [services]);

    const handleAddService = () => {
        setDialogAction('add');
        setSelectedServiceId(null);
        setDialogOpen(true);
    };

    const handleEditService = (id: number | string) => {
        setSelectedServiceId(Number(id));
        setDialogAction('edit');
        setDialogOpen(true);
    };

    const handleDeleteService = (id: number | string) => {
        const service_id = Number(id);
        setServicesList((prevServices) => {
            const updatedServices = prevServices.filter((s) => s.service_id !== service_id);
            if (selectedServiceId === service_id) {
                setSelectedServiceId(null);
            }
            onUpdateServices(updatedServices);
            return updatedServices;
        });
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

    // Derived list items for MasterDetailPanel
    const listItems = servicesList.map((service) => ({
        id: service.service_id,
        label: service.service_name,
    }));

    // Detail panel content
    const detail = selectedService ? (
        <div className="flex h-full flex-col justify-between gap-4">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-foreground text-lg font-semibold break-words">{selectedService.service_name}</h4>
                    {selectedService.service_link && (
                        <a
                            href={selectedService.service_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary flex items-center gap-1 text-xs hover:underline"
                        >
                            <Link className="h-3 w-3" />
                            Visit Link
                        </a>
                    )}
                </div>

                <Separator />

                <div className="border-border bg-muted/30 rounded-md border p-4">
                    <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">Description</p>
                    <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedService.description || 'No description provided.'}
                    </p>
                </div>

                {selectedService.service_link && (
                    <div className="border-border bg-muted/30 rounded-md border p-4">
                        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">Service Link</p>
                        <code className="text-primary text-xs break-all">{selectedService.service_link}</code>
                    </div>
                )}
            </div>
        </div>
    ) : null;

    return (
        <>
            <MasterDetailPanel
                title="Services & Portals"
                items={listItems}
                selectedId={selectedServiceId}
                onSelect={(id) => setSelectedServiceId(Number(id))}
                onAdd={handleAddService}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
                emptyListIcon={LibrarySquare}
                emptyListTitle="No services added"
                addIcon={LibrarySquare}
                addLabel="Add Service"
                detail={detail}
                emptyDetailIcon={MousePointerClick}
                emptyDetailTitle="No service selected"
                emptyDetailDescription="Select a service from the list to view details"
            />

            {dialogOpen && (
                <OtherServicesDialog type={dialogAction} service={selectedService} onClose={() => setDialogOpen(false)} onSave={handleSaveService} />
            )}
        </>
    );
}
