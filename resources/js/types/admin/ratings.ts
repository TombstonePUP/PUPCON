export interface Benchmark {
    id: number | string;
    category: string;
    text: string;
    pdfUrl: string;
    children?: Benchmark[];
}

export interface Parameter {
    id: string;
    label: string;
    status: string;
    benchmarks: Benchmark[];
}

export interface AccreditationArea {
    id: number;
    area_name: string;
    status: string;
    progress: number;
    parameters: Parameter[];
}

export interface Program {
    id: number;
    program_name: string;
    accreditation_level: number;
    campus: string;
    assigned_areas: AccreditationArea[];
}
