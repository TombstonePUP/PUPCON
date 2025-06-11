import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button"

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File size exceeds ${maxSizeMB}MB limit`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        onImageChange(file);
      };
      reader.readAsDataURL(file);
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
      <input
        id="programBanner"
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        onChange={handleImageChange}
      />

      {!image ? (
        // Initial upload state
        <div className="hover:bg-accent w-full rounded border p-7 text-center transition-colors duration-300">
          <label
            htmlFor="programBanner"
            className="flex cursor-pointer flex-col items-center justify-center gap-3 text-[#858585]"
          >
            <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-dashed border-[#B4B4B4]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B4B4B4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v12" />
                <path d="m17 8-5-5-5 5" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              </svg>
            </div>
            <div>
              <p className="text-[#B4B4B4]">{uploadText}</p>
              <p className="text-muted-foreground text-sm">{sizeText}</p>
            </div>
          </label>
        </div>
      ) : (
        // Uploaded state with hover effect
        <div className="flex h-[10vw] w-full justify-center overflow-hidden rounded border p-1 text-center">
          <div
            className="group relative flex w-full items-center justify-center rounded bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div
              className={`absolute inset-0 flex items-center justify-center gap-4 transition-opacity duration-300 ${
                isHovering ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Button
                variant="ghost"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-black shadow-md hover:bg-white"
                onClick={triggerFileInput}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-black shadow-md hover:bg-white"
                onClick={handleRemoveImage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;