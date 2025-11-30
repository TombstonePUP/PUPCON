import { useState } from 'react';
import { Mail } from 'lucide-react';

export interface Faculty {
  id: number;
  name: string;
  photo: string;
  position: string;
  email?: string; // <- now optional
}

interface Props {
  faculty: Faculty;
  isLoading?: boolean;
  index?: number;
}

export default function FacultyCard({ faculty, isLoading = false }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);

  if (isLoading) {
    return (
      <div className="group relative w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col space-y-3">
          <div className="aspect-square w-full animate-pulse rounded-xl bg-gray-300" />
          <div className="mx-auto h-5 w-3/4 animate-pulse rounded bg-gray-300" />
          <div className="mx-auto h-3 w-1/2 animate-pulse rounded bg-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 transition-all duration-500 hover:scale-[1.02] hover:border-[#7f1414]">
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7f1414] via-[#9a1a1a] to-[#7f1414] opacity-60 group-hover:opacity-0" />

      <div className="flex flex-col space-y-3">
        {/* Image */}
        <div className="relative overflow-hidden">
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 ring-2 ring-[#7f1414]/10 transition-all duration-300 group-hover:ring-[#7f1414]/30">
            {!imgLoaded && (
              <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-gray-200">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#7f1414] border-t-transparent" />
              </div>
            )}
            <img
              src={faculty.photo}
              alt={faculty.name}
              className={`h-full w-full object-cover transition-all duration-200 group-hover:scale-110 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImgLoaded(true)}
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  faculty.name
                )}&background=7f1414&color=fff&size=400&format=svg`;
                setImgLoaded(true);
              }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1 pt-1 text-center h-25 flex flex-col justify-center">
          <h3 className="text-base font-bold text-gray-900 group-hover:text-[#7f1414]">
            {faculty.name}
          </h3>
          <p className="mt-1 text-xs font-medium text-gray-600">{faculty.position}</p>

          {/* Email – only show if present */}
          {faculty.email && (
            <div className="border-t border-gray-100 pt-2">
              <a
                href={`mailto:${faculty.email}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#7f1414]/5 px-2.5 py-1.5 text-xs text-gray-600 transition-all duration-200 hover:bg-[#7f1414] hover:text-white"
              >
                <Mail className="h-3 w-3" />
                <span className="max-w-[140px] truncate">{faculty.email}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
