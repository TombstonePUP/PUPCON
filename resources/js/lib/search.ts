import type { OutlineSearchSource, SearchResult } from '@/components/guest/mobile-menu';

function toRoman(num: number | undefined): string {
    if (!num) return '';
    const map: [number, string][] = [
        [1000, 'M'],
        [900, 'CM'],
        [500, 'D'],
        [400, 'CD'],
        [100, 'C'],
        [90, 'XC'],
        [50, 'L'],
        [40, 'XL'],
        [10, 'X'],
        [9, 'IX'],
        [5, 'V'],
        [4, 'IV'],
        [1, 'I'],
    ];
    let n = num;
    let out = '';
    for (const [value, symbol] of map) {
        while (n >= value) {
            out += symbol;
            n -= value;
        }
    }
    return out;
}

const STOPWORDS = new Set(['of', 'and', 'in', 'the', 'for', 'a', 'an', 'on', 'at', 'to']);

function initials(words: string | undefined): string {
    if (!words) return '';
    return words
        .split(/\s+/)
        .filter((w) => w && /[a-zA-Z0-9]/.test(w) && !STOPWORDS.has(w.toLowerCase()))
        .map((w) => w[0])
        .join('');
}

function programAliases(degreeType: string | undefined, programName: string | undefined): string[] {
    const aliases: string[] = [];
    if (programName) aliases.push(programName);
    if (degreeType) aliases.push(degreeType);

    const degreeAbbr = initials(degreeType); // e.g. BS
    const programInitials = initials(programName); // e.g. IT
    const full = `${degreeType} in ${programName}`;
    if (full) aliases.push(full);
    if (degreeAbbr) aliases.push(degreeAbbr); // BS
    if (programInitials) aliases.push(programInitials); // IT
    if (degreeAbbr && programInitials) {
        aliases.push(`${degreeAbbr}${programInitials}`); // BSIT
        aliases.push(`${degreeAbbr} ${programInitials}`); // BS IT
    }

    return aliases.filter(Boolean).map((a) => a.toLowerCase());
}

function areaAliases(areaNumber: string | undefined, areaName: string | undefined, numeral: string): string[] {
    const aliases: string[] = [];
    if (areaNumber) {
        aliases.push(`area ${areaNumber}`);
    }
    if (numeral) {
        aliases.push(`area ${numeral}`);
    }
    if (areaName) aliases.push(areaName);
    return aliases.filter(Boolean).map((a) => a.toLowerCase());
}

export function buildSearchIndex(outlines: OutlineSearchSource[]) {
    return outlines.map((o) => {
        const degreeType = o.area_parameter?.areas?.levels?.programs?.degree_type;
        const programName = o.area_parameter?.areas?.levels?.programs?.program_name;
        const areaName = o.area_parameter?.areas?.area_name;
        const areaNumber = o.area_parameter?.areas?.area_number;
        const numeral = toRoman(Number(areaNumber));

        const outlineParts = [
            o.outline_description,
            o.outline_number,
            o.outline_name,
            o.area_parameter?.parameter_name,
            o.area_parameter?.parameter_description,
            ...programAliases(degreeType, programName),
            ...areaAliases(areaNumber, areaName, numeral),
        ];

        return {
            id: o.parameter_outline_id,
            parameterId: o.area_parameter_id,
            program: programName,
            area: areaName,
            parameter: o.area_parameter?.parameter_name,
            outline: o.outline_description,
            level: o.area_parameter?.areas?.levels?.level,
            programId: o.area_parameter?.areas?.levels?.programs?.program_id,
            areaId: o.area_parameter?.areas?.area_id,
            haystack: outlineParts.filter(Boolean).join(' ').toLowerCase(),
        };
    });
}

export function searchOutlines(index: ReturnType<typeof buildSearchIndex>, query: string): SearchResult[] {
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    return index
        .filter((item) => tokens.every((token) => item.haystack.includes(token)))
        .filter((item) => item.programId != null && item.areaId != null)
        .map(
            (item): SearchResult => ({
                outline: item.outline,
                outlineId: item.id,
                parameterId: item.parameterId,
                program: item.program,
                area: item.area,
                parameter: item.parameter,
                level: item.level,
                program_id: item.programId,
                area_id: item.areaId,
            }),
        );
}
