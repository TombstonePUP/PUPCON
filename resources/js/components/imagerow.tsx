// components/ImageRow.tsx
"use client";
import { useState } from 'react';

interface ImageItem {
  id: number;
  src: string;
  alt: string;
}

interface ImageRowProps {
  images: ImageItem[];
  height?: string;  // e.g., "h-64"
}

const ImageRow = ({ images, height = "h-64" }: ImageRowProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={`flex items-center justify-center ${height} gap-4 p-4`}>
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`relative h-full overflow-hidden rounded-lg transition-all duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
            hoveredIndex === index 
              ? 'w-74 flex-[2_2_0%]' 
              : 'w-42 flex-[1_1_0%]'
          }`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageRow;
