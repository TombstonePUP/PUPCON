"use client"

import { type ParameterOutlines } from '@/types';

interface OutlineProps {
    outlines: ParameterOutlines[];
}

function buildOutlineTree({outlines}: OutlineProps) {
    const outlineMap = new Map();
    const rootOutlines = [];
    outlines.forEach((outline) => {
        outlineMap.set(outline.parameter_outline_id, { ...outline, children: [] });
    });
}

export function RecursiveOutline({ outlines }: OutlineProps) {
    return (
        <>
            <ul className="list-disc pl-5">
                {outlines.map((outline) => (
                    <li key={outline.outline_id}>
                        {outline.outline_name}
                        {outline.children && outline.children.length > 0 && (
                            <RecursiveOutline outlines={outline.children} />
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
}
