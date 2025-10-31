import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import React from 'react';

const handleSave = () => {
    console.log('Saving Vision, Mission, Intro, etc...');
};

const handlePreview = () => {
    window.open('/about/vision-mission-goals', '_blank');
};

const HistoryContentSection: React.FC = () => {
    return (
        <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">History Page</h2>
                    <p className="text-sm text-gray-600">Configure content</p>
                </div>

                <div className="mb-10 grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                        <Input type="text" placeholder="Enter welcome title..." />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle</label>
                        <Input type="text" placeholder="Enter welcome subtitle..." />
                    </div>
                </div>
            </div>
                        <SectionFooter onSave={handleSave} onPreview={handlePreview} />

        </div>
    );
};

export default HistoryContentSection;
