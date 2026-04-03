import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';
import { Edit2, Trash2, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  uploadText?: string;
  changeText?: string;
  sizeText?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageChange,
  accept = 'image/png, image/jpeg',
  maxSizeMB = 5,
  uploadText = 'Upload program banner',
  changeText = 'Change program banner',
  sizeText = 'PNG, JPG up to 5MB',
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      setIsDialogOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageChange(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleImageChange(e.dataTransfer.files[0]);
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
          className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-muted/30 p-12 text-center transition-all duration-300 hover:border-primary/50 hover:bg-muted/50"
          onClick={() => setIsDialogOpen(true)}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-border transition-transform duration-300 group-hover:scale-105">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="mb-1 text-base font-semibold text-foreground">{uploadText}</p>
              <p className="text-sm text-muted-foreground">{sizeText}</p>
            </div>
            <div className="mt-2 flex gap-2">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">PNG</span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">JPG</span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Max {maxSizeMB}MB</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300">
          <div
            className="group relative flex h-64 w-full items-center justify-center rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className={`absolute inset-0 bg-foreground/60 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex h-full items-center justify-center gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-12 w-12 rounded-full bg-background p-0 transition-transform duration-200 hover:scale-110 hover:bg-background"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Edit2 className="h-5 w-5 text-foreground" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-12 w-12 rounded-full bg-background p-0 transition-transform duration-200 hover:scale-110 hover:bg-destructive/10"
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader />
          <div className="py-2">
            <div
              className={`relative overflow-hidden rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-muted/30 hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-primary">
                  <Upload className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <p className="mb-2 text-base font-medium text-foreground">Drag and drop your image here</p>
                  <p className="text-sm text-muted-foreground">or</p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()} className="px-6 py-2 font-medium">
                  Browse Files
                </Button>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">PNG</span>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">JPG</span>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">Max {maxSizeMB}MB</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUploader;