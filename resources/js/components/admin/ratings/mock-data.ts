import { Program } from '@/types/admin/ratings';

export const MOCK_PROGRAMS: Program[] = [
    {
        id: 1,
        program_name: 'Bachelor of Science in Computer Science',
        accreditation_level: 3,
        campus: 'Main Campus',
        assigned_areas: [
            {
                id: 1,
                area_name: 'Area I: Vision, Mission, Goals and Objectives',
                status: 'pending',
                progress: 0,
                parameters: [
                    {
                        id: 'A',
                        label: 'Program Goals and Objectives',
                        status: 'approved',
                        benchmarks: [
                            {
                                id: 1,
                                category: 'S',
                                text: 'S.4. The Goals are clearly stated, and are consistent with the Mission of the Institution.',
                                pdfUrl: '/docs/goals.pdf',
                            },
                            {
                                id: 2,
                                category: 'S',
                                text: 'S.5. The Objectives of the program clearly state the expected outcomes in terms of competencies (skills and knowledge), values, and other attributes of the graduates which include the development of:',
                                pdfUrl: '/docs/objectives.pdf',
                                children: [
                                    {
                                        id: 3,
                                        category: 'S',
                                        text: 'S.5.1. technical skills in Hotel and Restaurant Management/TM/HM/TrM;',
                                        pdfUrl: '/docs/skills.pdf',
                                    },
                                    {
                                        id: 4,
                                        category: 'S',
                                        text: 'S.5.2. scientific habit thought;',
                                        pdfUrl: '/docs/habit.pdf',
                                    },
                                ],
                            },
                            {
                                id: 5,
                                category: 'I',
                                text: 'I.7. Implementation aligns with institutional goals.',
                                pdfUrl: '/docs/implementation.pdf',
                            },
                            {
                                id: 6,
                                category: 'O',
                                text: 'O.10. Graduates exhibit competencies aligned with program objectives.',
                                pdfUrl: '/docs/outcomes.pdf',
                            },
                        ],
                    },
                ],
            },
            {
                id: 2,
                area_name: 'Area II: Faculty',
                status: 'in_progress',
                progress: 45,
                parameters: [
                    {
                        id: 'A',
                        label: 'Faculty Qualifications',
                        status: 'approved',
                        benchmarks: [
                            { id: 1, category: 'S', text: 'S.2.01. Percentage of faculty with doctoral degrees.', pdfUrl: '/docs/faculty-qualifications.pdf' },
                            { id: 2, category: 'S', text: 'S.3.04. Accreditation compliance for faculty ranks.', pdfUrl: '/docs/accreditation.pdf' },
                        ],
                    },
                ],
            },
        ],
    },
];
