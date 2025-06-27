import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/archive',
    },
];

export default function Archive() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Archive" />

            <SettingsLayout>
                <div className="space-y-6">
                    archive
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
