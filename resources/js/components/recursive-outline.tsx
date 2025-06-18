"use client"

import { type ParameterOutlines } from '@/types';
import { Link } from '@inertiajs/react';

interface OutlineProps {
    outlines: ParameterOutlines[];
}

function sortOutlinesByNumber(outlines) {
    return outlines.slice().sort((a, b) => {
        const aParts = a.outline_number.split('.').map(Number);
        const bParts = b.outline_number.split('.').map(Number);
        const len = Math.max(aParts.length, bParts.length);
        for (let i = 0; i < len; i++) {
            const aVal = aParts[i] ?? 0;
            const bVal = bParts[i] ?? 0;
            if (aVal !== bVal) return aVal - bVal;
        }
        return 0;
    });
}

export function buildOutlineTree({outlines}: OutlineProps) {
    const sortedOutlines = sortOutlinesByNumber(outlines);
    const outlineMap = new Map();
    const rootOutlines = [];

    sortedOutlines.forEach((outline) => {
        outlineMap.set(outline.parameter_outline_id, { ...outline, children: [] });
    });

    sortedOutlines.forEach(outline => {
        if (outline.parent_outline_id) {
            const parent = outlineMap.get(outline.parent_outline_id);
            if (parent) {
                parent.children.push(outlineMap.get(outline.parameter_outline_id));
            }
        } else {
            rootOutlines.push(outlineMap.get(outline.parameter_outline_id));
        }
    });
    return rootOutlines;
}

export function RecursiveOutline({ outlines }: OutlineProps) {
    return (
        <>
            <ul className="pl-[1vw]">
                {outlines.map((outline) => (
                    <li key={outline.parameter_outline_id}>
                        <Link>
                            {outline.initial}.
                            {outline.outline_number}.
                            {outline.outline_description}
                        </Link>
                        {outline.children && outline.children.length > 0 && (
                            <RecursiveOutline outlines={outline.children} />
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
}
