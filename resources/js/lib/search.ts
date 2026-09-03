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

        const parameterName = o.area_parameter?.parameter_name;
        // Structural label e.g. "parameter a" so typo'd domain keywords ("paramater a")
        // can still resolve to the right parameter.
        const parameterLabel = `parameter ${parameterName ?? ''}`.trim().toLowerCase();

        const outlineParts = [
            o.outline_description,
            o.outline_number,
            o.outline_name,
            parameterName,
            o.area_parameter?.parameter_description,
            ...programAliases(degreeType, programName),
            ...areaAliases(areaNumber, areaName, numeral),
            // Domain keywords so fuzzy matching tolerates typos on structural
            // words like "parameter", "benchmark", "area", "program", "outline".
            parameterLabel,
            'parameter benchmark outline area program level',
        ];

        return {
            id: o.parameter_outline_id,
            parameterId: o.area_parameter_id,
            program: programName,
            area: areaName,
            parameter: parameterName,
            outline: o.outline_description,
            level: o.area_parameter?.areas?.levels?.level,
            programId: o.area_parameter?.areas?.levels?.programs?.program_id,
            areaId: o.area_parameter?.areas?.area_id,
            parameterLabel,
            haystack: outlineParts.filter(Boolean).join(' ').toLowerCase(),
        };
    });
}

export function searchOutlines(index: ReturnType<typeof buildSearchIndex>, query: string): SearchResult[] {
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    return index
        .filter((item) => item.programId != null && item.areaId != null)
        .map((item) => {
            let usedFuzzy = false;
            const matches = tokens.every((token) => {
                const { exact, fuzzy } = matchToken(item.haystack, token);
                if (fuzzy && !exact) usedFuzzy = true;
                return exact || fuzzy;
            });
            return matches ? { item, usedFuzzy, score: relevanceScore(item, query) } : null;
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
        .sort((a, b) => {
            if (a.usedFuzzy !== b.usedFuzzy) return a.usedFuzzy ? 1 : -1;
            return b.score - a.score;
        })
        .map(({ item }) => ({
            outline: item.outline,
            outlineId: item.id,
            parameterId: item.parameterId,
            program: item.program,
            area: item.area,
            parameter: item.parameter,
            level: item.level,
            program_id: item.programId,
            area_id: item.areaId,
        }));
}

interface TokenMatch {
    exact: boolean;
    fuzzy: boolean;
}

function matchToken(haystack: string, token: string): TokenMatch {
    const exact = haystack.includes(token);
    if (exact) return { exact, fuzzy: false };

    // Skip fuzzy matching for very short tokens to avoid noisy matches.
    if (token.length < 3) return { exact: false, fuzzy: false };

    const tolerance = token.length <= 5 ? 1 : 2;
    const words = haystack.split(/\s+/).filter(Boolean);
    const fuzzy = words.some((word) => levenshtein(token, word) <= tolerance);

    return { exact: false, fuzzy };
}

function levenshtein(a: string, b: string): number {
    if (a === b) return 0;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    let prev = Array.from({ length: b.length + 1 }, (_, j) => j);

    for (let i = 1; i <= a.length; i++) {
        const curr = [i];
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
        }
        prev = curr;
    }

    return prev[b.length];
}

function relevanceScore(item: ReturnType<typeof buildSearchIndex>[number], query: string): number {
    const q = query.toLowerCase().trim();

    const fields: string[] = [
        item.outline ?? '',
        item.parameter ?? '',
        item.area ?? '',
        item.program ?? '',
        `${item.program ?? ''} ${item.area ?? ''} ${item.parameter ?? ''}`,
        item.parameterLabel ?? '',
    ];

    let score = 0;
    for (const field of fields) {
        const value = field.toLowerCase();

        if (value.startsWith(q)) score += 100;
        else if (new RegExp(`(^|\\s)${escapeRegExp(q)}`).test(value)) score += 60;

        if (value.includes(q)) score += 30;
    }

    score += Math.max(0, 50 - (item.outline?.length ?? 0)) / 10;

    return score;
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
