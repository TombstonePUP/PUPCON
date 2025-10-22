import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import React from 'react';

const handleSave = () => {
    console.log('Saving Vision & Mission section...');
};

const handlePreview = () => {
    window.open('/about/vision-mission-goals', '_blank');
};

const VmgoContentSection: React.FC = () => {
    return (
        <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Vision, Mission, and Goals</h2>
                    <p className="text-sm text-gray-600">Configure content</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Introduction</label>
                        <Textarea placeholder="Enter your page introduction..." autoResize minHeight={100} maxHeight={250} />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                        <Textarea placeholder="Enter your page desciption..." autoResize minHeight={100} maxHeight={250} />
                    </div>
                </div>
                <Separator className="my-10 bg-gray-200" />
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">University Vision</label>
                        <Textarea placeholder="Enter vision..." autoResize minHeight={100} maxHeight={250} />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">University Mission</label>
                        <Textarea placeholder="Enter mission..." autoResize minHeight={100} maxHeight={250} />
                    </div>
                </div>
            </div>

            <SectionFooter onSave={handleSave} onPreview={handlePreview} />
        </div>
    );
};

export default VmgoContentSection;
