import { AlignLeft } from 'lucide-react';
import { RefObject, useEffect, useRef, useState } from 'react';

interface Section {
  id: string;
  label: string;
  ref: RefObject<HTMLDivElement | null>;
}

interface TableOfContentsProps {
  sections: Section[];
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '');
  const [scrollLock, setScrollLock] = useState(false);

  const scrollToSection = (ref: RefObject<HTMLDivElement | null>, sectionId: string) => {
    setScrollLock(true);
    setActiveSection(sectionId);

    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    let timeout: ReturnType<typeof setTimeout>;
    const handleScrollEnd = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setScrollLock(false);
        window.removeEventListener('scroll', handleScrollEnd);
      }, 150);
    };

    window.addEventListener('scroll', handleScrollEnd);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollLock) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );

    sections
      .filter((s) => s.ref?.current !== null)
      .forEach((s) => observer.observe(s.ref.current!));

    return () => {
      sections
        .filter((s) => s.ref?.current !== null)
        .forEach((s) => observer.unobserve(s.ref.current!));
    };
  }, [sections, scrollLock]);

  return (
    <div className="sticky top-6 hidden shrink-0 self-start rounded-lg p-6 xl:inline">
      <h2 className="mb-4 font-semibold text-muted-foreground font-montserrat">
        <AlignLeft className="mr-2 ml-1.5 inline-block size-5" />
        On this page
      </h2>
      <nav className="ml-2 space-y-1 border-l border-border">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.ref, section.id)}
            className={`my-4 block w-full border-l-3 px-4 text-left text-sm transition-all duration-150 ${activeSection === section.id
                ? 'border-primary'
                : 'border-transparent font-normal text-muted-foreground hover:border-border hover:text-foreground'
              }`}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  );
}