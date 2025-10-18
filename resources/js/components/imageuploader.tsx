import { Button } from '@/components/ui/button';
import { Edit2, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
    initialImage?: string;
    onImageChange: (file: File | null) => void;
    accept?: string;
    maxSizeMB?: number;
    uploadText?: string;
    changeText?: string;
    sizeText?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    initialImage = '/images/placeholder.png',
    onImageChange,
    accept = 'image/png, image/jpeg',
    maxSizeMB = 5,
    uploadText = 'Upload program banner',
    changeText = 'Change program banner',
    sizeText = 'PNG, JPG up to 5MB',
}) => {
    const [image, setImage] = useState<string | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File) => {
        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(`File size exceeds ${maxSizeMB}MB limit`);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target?.result as string);
            onImageChange(file);
            setShowDialog(false);
        };
        reader.readAsDataURL(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageChange(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageChange(e.dataTransfer.files[0]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        setImage(null);
        onImageChange(null);
    };

    return (
        <div className="mt-5 flex flex-col gap-3">
            <input type="file" ref={fileInputRef} className="hidden" accept={accept} onChange={handleFileSelect} />

            {!image ? (
                <div
                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12 text-center transition-all duration-300 hover:border-[#7f1414]/70"
                    onClick={() => setShowDialog(true)}
                >
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                            <div className="rounded-fullopacity-20 absolute inset-0 animate-pulse"></div>
                            <div className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-dashed transition-transform duration-300 group-hover:scale-105">
                                <Upload className="h-6 w-6 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <p className="mb-1 text-lg font-semibold text-gray-700">{uploadText}</p>
                            <p className="text-sm text-gray-500">{sizeText}</p>
                        </div>
                        <div className="mt-2 flex gap-2">
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">PNG</span>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">JPG</span>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">Max {maxSizeMB}MB</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white transition-all duration-300">
                    <div
                        className="group relative flex h-64 w-full items-center justify-center rounded-lg bg-cover bg-center"
                        style={{ backgroundImage: `url(${image})` }}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="flex h-full items-center justify-center gap-3">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="h-12 w-12 rounded-full bg-white p-0 transition-transform duration-200 hover:scale-110 hover:bg-white"
                                    onClick={() => setShowDialog(true)}
                                >
                                    <Edit2 className="h-5 w-5 text-gray-700" />
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="h-12 w-12 rounded-full bg-white p-0 transition-transform duration-200 hover:scale-110 hover:bg-red-50"
                                    onClick={handleRemoveImage}
                                >
                                    <Trash2 className="h-5 w-5 text-red-600" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Upload Dialog */}
            {showDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="animate-in fade-in zoom-in relative w-full max-w-lg duration-200">
                        <div className="rounded-2xl bg-white">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-full bg-red-100">
                                        <ImageIcon className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Upload Image</h2>
                                        <p className="text-sm text-gray-500">Choose an image file to upload</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div
                                    className={`relative overflow-hidden rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200 ${
                                        dragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-red-400'
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="grid h-16 w-16 place-items-center rounded-full bg-[#7f1414]">
                                            <Upload className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <p className="mb-2 text-base font-medium text-gray-700">Drag and drop your image here</p>
                                            <p className="text-sm text-gray-500">or</p>
                                        </div>
                                        <Button onClick={triggerFileInput} className="bg-[#7f1414] px-6 py-2 font-medium transition-all duration-200">
                                            Browse Files
                                        </Button>
                                        <div className="mt-2 flex flex-wrap justify-center gap-2">
                                            <span className="rounded-full border-1 bg-white px-3 py-1 text-xs font-medium text-gray-600">PNG</span>
                                            <span className="rounded-full border-1 bg-white px-3 py-1 text-xs font-medium text-gray-600">JPG</span>
                                            <span className="rounded-full border-1 bg-white px-3 py-1 text-xs font-medium text-gray-600">
                                                Max {maxSizeMB}MB
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="rounded-b-2xl border-t border-gray-200 bg-gray-50 px-6 py-4">
                                <div className="flex justify-end">
                                    <Button variant="ghost" onClick={() => setShowDialog(false)} className="hover:bg-gray-200">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
