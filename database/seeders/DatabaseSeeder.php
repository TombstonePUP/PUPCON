<?php

namespace Database\Seeders;

use App\Models\AccreditationLevels;
use App\Models\AreaFormCategory;
use App\Models\Areas;
use App\Models\AreaParameters;
use App\Models\Exhibits;
use App\Models\Facilities;
use App\Models\FileStatus;
use App\Models\ParameterOutlineCategory;
use App\Models\ProgramGallery;
use App\Models\ProgramObjectives;
use App\Models\Programs;
use App\Models\ParameterOutlines;
use App\Models\Roles;
use App\Models\User;
use App\Models\ContentPages;
use App\Models\UserAreaRoles;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $faker = Faker::create();

        $roles = [
            [
                'role_name' => 'Admin'
            ],
            [
                'role_name' => 'Coordinator'
            ],
            [
                'role_name' => 'Chairman'
            ],
            [
                'role_name' => 'Accreditor'
            ],
            /* [
                'role_id' => 5,
                'role_name' => 'Unassigned'
            ], */
        ];
        foreach ($roles as $attributes) {
            Roles::factory()->create($attributes);
        }
        $role1 = Roles::where('role_name', 'Admin')->first();
        $role2 = Roles::where('role_name', 'Coordinator')->first();
        $role3 = Roles::where('role_name', 'Chairman')->first();
        $role4 = Roles::where('role_name', 'Accreditor')->first();
        $users = [
            [
                'user_id' => 11111,
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'johndoe@admin.com',
                'role_id' => $role1->role_id, // Admin
                'password' => bcrypt('admin@123'),
            ],
            [
                'user_id' => 22222,
                'first_name' => 'Keith',
                'last_name' => 'Lee',
                'email' => 'keithlee@chairman.com',
                'role_id' => $role3->role_id, // Chairman
                'password' => bcrypt('chairman@123'),
            ],
            [
                'user_id' => 33333,
                'first_name' => 'Jane',
                'last_name' => 'Doe',
                'email' => 'janedoe@accreditor.com',
                'role_id' => $role4->role_id, // Accreditor
                'password' => bcrypt('accreditor@123'),
            ],
        ];
        foreach ($users as $attributes) {
            User::factory()->create($attributes);
        }

        // UserRoles::factory(10)->create();
        $programs = [
            [
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Information Technology',
                'program_description' => 'The Bachelor of Science in Information Technology (BSIT) program is a four-year degree program which focuses on the study of computer utilization and computer software to plan, install, customize, operate, manage, administer and maintain information technology infrastructure. It likewise deals with the design and development of computer-based information systems for real-world business solutions.',
                'under_survey' => true,
                'color' => 'blue',
            ],
            [
                'degree_type' => 'Bachelor of Arts',
                'program_name' => 'Communication',
                'program_description' => 'The Bachelor of Arts in Communication (ABComm) program is a four-year degree program that aims to develop students\' skills in various forms of communication, including interpersonal, group, and public communication. The program also emphasizes the importance of media literacy and critical thinking in today\'s information-rich society.',
                'under_survey' => false,
                'color' => 'red',
            ],
            [
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Business Administration',
                'program_description' => 'The Bachelor of Science in Business Administration (BSBA) program is a four-year degree program that provides students with a comprehensive understanding of business principles and practices. The program covers various aspects of business, including management, marketing, finance, and entrepreneurship.',
                'under_survey' => false,
                'color' => 'green',
            ],
            [
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Psychology',
                'program_description' => 'The Bachelor of Science in Psychology (BSP) program is a four-year degree program that focuses on the scientific study of human behavior and mental processes. The program provides students with a strong foundation in psychological theories, research methods, and practical applications.',
                'under_survey' => true,
                'color' => 'pink',
            ],
            [
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Accountancy',
                'under_survey' => false,
                'program_description' => 'A Bachelor of Science in Accounting (BSA) is a 4-year degree that prepares students for entry-level professional positions in public, private, or government accounting. Some schools may also refer to a comparable degree as a Bachelor of Accountancy. Upon graduation, students can qualify for placement in graduate or professional schools to prepare for CPA licensure.',
                'color' => 'yellow',
            ],
            [
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Entrepreneurship',
                'under_survey' => false,
                'program_description' => 'The Bachelor of Science in Entrepreneurship (BSENT) is a four-year course offered in the College of Business, designed to provide undergraduate students an in-depth understanding and appreciation of new venture operations in small business enterprises. It aims to equip young students with entrepreneurial spirit to realize a vibrant and developing economy in the hands of the Filipinos and develop desirable qualities of leadership, social concern and moral values among them.',
                'color' => 'lightgreen',
            ],
            [
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Education Major in English',
                'under_survey' => false,
                'program_description' => 'The Bachelor of Science in Education program (BSEd) is a four-year course leading to the degree of Bachelor in Secondary Education, major in English. It is an excellent preparation for the teaching career and for advancement in any field in which communication skills are important.',
                'color' => 'lightblue',
            ],
            [
                'degree_type' => 'Bachelor of Science',
                'program_name' => 'Hospitality Management',
                'under_survey' => false,
                'program_description' => 'The Bachelor of Science in Information Technology (BSIT) program is a four-year course that aims to provide students with the knowledge and skills to apply the principles and methodologies utilized in the field of information technology. The program equips students with the ability to design, implement, and manage information systems.',
                'color' => 'lightred',
            ],
            [
                'degree_type' => 'Bachelor of Science in Business Administration',
                'program_name' => 'Financial Management',
                'under_survey' => false,
                'program_description' => 'The Bachelor of Science in Business Administration major in Financial Management (BSBA-FM) program is designed to provide students with a strong foundation in financial management, banking, and related financial services. The program is designed to prepare students for careers in banking, corporate finance, investment management, and financial services.',
                'color' => 'lightpink',
            ],
        ];
        foreach ($programs as $attributes) {
            Programs::factory()->create($attributes);
        }

        $program1 = Programs::where('program_name', 'Information Technology')->first();
        $program2 = Programs::where('program_name', 'Communication')->first();
        $program3 = Programs::where('program_name', 'Business Administration')->first();
        $program4 = Programs::where('program_name', 'Psychology')->first();
        $program5 = Programs::where('program_name', 'Accountancy')->first();
        $program6 = Programs::where('program_name', 'Entrepreneurship')->first();
        $program7 = Programs::where('program_name', 'Education Major in English')->first();
        $program8 = Programs::where('program_name', 'Hospitality Management')->first();
        $program9 = Programs::where('program_name', 'Financial Management')->first();

        $levels = [
            [
                // 'accreditation_level_id' => 1,
                'program_id' => $program1->program_id,
                'level' => 2,
                'remarks' => 'Passed',
                'is_active' => false,
                'survey_date' => '2022-05-15',
            ],
            [
                // 'accreditation_level_id' => 2,
                'program_id' => $program1->program_id,
                'level' => 3,
                'remarks' => 'Passed',
                'is_active' => true,
                'survey_date' => '2024-03-20',
            ],
            [
                // 'accreditation_level_id' => 3,
                'program_id' => $program4->program_id,
                'level' => 3,
                'remarks' => 'Ongoing Survey',
                'is_active' => true,
            ],
        ];
        foreach ($levels as $attributes) {
            AccreditationLevels::factory()->create($attributes);
        }

        $programGallery = [];
        $programsGalleryName = [
            ['id' => $program1->program_id, 'folder' => 'it', 'count' => 6],
            ['id' => $program4->program_id, 'folder' => 'psych', 'count' => 6],
        ];

        foreach ($programsGalleryName as $program) {
            for ($i = 1; $i <= $program['count']; $i++) {
                $programGallery[] = [
                    'program_id' => $program['id'],
                    'image_name' => $i . '.jpg',
                    'image_path' => "/images/gallery/{$program['folder']}/{$i}.jpg",
                ];
            }
        }

        // foreach ($programGallery as $attributes) {
        //     ProgramGallery::factory()->create($attributes);
        // }

        $level1 = AccreditationLevels::where('program_id', $program1->program_id)
            ->where('level', 2)->first();
        $level2 = AccreditationLevels::where('program_id', $program1->program_id)
            ->where('level', 3)->first();
        $level3 = AccreditationLevels::where('program_id', $program4->program_id)
            ->where('level', 3)->first();

        $areas = [
            [
                // 'area_id' => 1,
                'accreditation_level_id' => $level2->accreditation_level_id,
                'area_number' => 1,
                'area_name' => 'Mission, Goals, and Objectives',
                'area_description' => 'The area of Vision, Mission, Goals, and Objectives is the most fundamental of all the (10) areas to be surveyed. Everything in the Institution is justified only to the extent that it realizes its vision and mission. It is essential therefore, for the Institution to formulate the vision and mission which should be the bases of all its operations. The Institution is judged by the degree to which these are attained, not in comparison with others.',
            ],
            [
                // 'area_id' => 2,
                'accreditation_level_id' => $level2->accreditation_level_id,
                'area_number' => 2,
                'area_name' => 'Faculty',
                'area_description' => 'The standard or quality of an institution or program is greatly measured by the qualifications of its faculty. In this light, the faculty should be composed of competent members in terms of academic qualifications, experience and professional expertise. In addition, they should manifest desirable personal qualities and high level of professionalism. To be effective, faculty members should be properly compensated and taken care of. They must be given opportunities for continuous personal and professional development. A policy of fair and equitable distribution of teaching assignments and workload should be practiced. Likewise, objective and clear promotion criteria/ scheme should be adopted by the institution.',
            ],
            [
                // 'area_id' => 3,
                'accreditation_level_id' => $level2->accreditation_level_id,
                'area_number' => 3,
                'area_name' => 'Curriculum and Instruction',
                'area_description' => 'Curriculum and instruction occupy center stage in any educational program. These seek to research, develop, and implement curriculum changes that enhance student achievement within and outside of institutions. How students learn and the best ways to educate deserve much consideration.',
            ],
            [
                // 'area_id' => 4,
                'accreditation_level_id' => $level2->accreditation_level_id,
                'area_number' => 4,
                'area_name' => 'Support to Students',
                'area_description' => "Students are the raison d' etre for the establishment of learning institutions. Thus, the school has the responsibility to support the family and other social institutions in the development of the total personality of the student. Towards this end a program of student services is designed as an integral part of institutional effectiveness. All activities should be well planned and implemented to assist the student to attain his/her maximum potential and become a worthy contributor in his/her social environment. Student support and services complement the Academic Program.",
            ],
            [
                // 'area_id' => 5,
                'accreditation_level_id' => $level2->accreditation_level_id,
                'area_number' => 5,
                'area_name' => 'Research',
                'area_description' => 'Research is an avenue through which new knowledge is discovered, applied or verified and through which appropriate technologies are generated. Thus, it is a basic requirement for an educational institution to have a firmly established research and development program. Its thrusts and priorities should be congruent with those identified in the development plans of regional and national R and D-oriented agencies such as NEDA, DOST, CHED, etc. The institutional leadership in research should be proactive and developmental in orientation. It must provide adequate and sustained budget allocation annually for the academic Unit. Adequate physical facilities, laboratory equipment and supplies for research should be provided. The Academic unit has to maintain strong research linkages with various R and D agencies locally and internationally.',
            ],
            [
                // 'area_id' => 6,
                'accreditation_level_id' => $level2->accreditation_level_id,
                'area_number' => 6,
                'area_name' => 'Extension and Community Involvement',
                'area_description' => "The extension function makes the institution's presence felt in the community. It involves the application of existing and new knowledge and technology and those generated in the Institution to improve the quality of life of the people. Through the extension program, people are empowered with appropriate knowledge, attitudes and skills. Thus, extension services cater to various aspects of the community life, e.g., economic growth, promotion of health, environmental management, and social transformation. The Institution plans and implements an extension program that is need and client-based. This program should have a budgetary support and other resource allocation. The faculty members may serve as experts, consultants, organizers, facilitators, coordinators, service providers, and change agents in the community as forms of extension and community involvement. Careful planning and coordination with other community outreach agencies should be considered to avoid duplication of services offered to the clientele.",
            ],
            [
                // 'area_id' => 7,
                'accreditation_level_id' => $level2->accreditation_level_id,
                'area_number' => 7,
                'area_name' => 'Library',
                'area_description' => 'The library is the heart of any learning institution. It is a synergy of people, hardware and software whose purpose is to assist clients in using knowledge and technology to transform and improve their lives. Information and knowledge are essential to the attainment of institutional goals. The ways in which they are selected, acquired, stored, accessed and distributed within the Institution will, in large measure, determine the success of teaching, research and other academic endeavors. The Institution thrives on clear policies concerning access to, and provision of, information. Thus, the library must take an active role in the development and implementation of these policies. Each institution has a unique vision, mission, goals and objectives. These are influenced by its philosophy, geographical location and social responsibility. Similarly, as a subsystem of the Institution, the library has a unique role to perform.',
            ],
            [
                // 'area_id' => 8,
                'accreditation_level_id' => $level2->accreditation_level_id,
                'area_number' => 8,
                'area_name' => 'Library',
                'area_description' => 'The library is the heart of any learning institution. It is a synergy of people, hardware and software whose purpose is to assist clients in using knowledge and technology to transform and improve their lives. Information and knowledge are essential to the attainment of institutional goals. The ways in which they are selected, acquired, stored, accessed and distributed within the Institution will, in large measure, determine the success of teaching, research and other academic endeavors. The Institution thrives on clear policies concerning access to, and provision of, information. Thus, the library must take an active role in the development and implementation of these policies. Each institution has a unique vision, mission, goals and objectives. These are influenced by its philosophy, geographical location and social responsibility. Similarly, as a subsystem of the Institution, the library has a unique role to perform.',
            ],
            [
                // 'area_id' => 9,
                'accreditation_level_id' => $level2->accreditation_level_id,
                'area_number' => 9,
                'area_name' => 'Laboratories',
                'area_description' => 'Laboratories are included in the support systems for any academic program. Broadly defined, they cover science laboratories, speech laboratories, demonstration farms, shops, and other facilities for practicum activities essential to the successful implementation of curricular programs inclusive of their use and functions.',
            ],
            [
                // 'area_id' => 10,
                'accreditation_level_id' => $level2->accreditation_level_id,
                'area_number' => 10,
                'area_name' => 'Administration',
                'area_description' => 'The administration is the engine of the institution in the attainment of its vision, mission, goals and objectives. It is concerned with the general affairs of the institution and its organizational performance. Thus, the administration adopts institutional processes and ensures that said processes are satisfactorily implemented.',
            ],
            [
                // 'area_id' => 11,
                'accreditation_level_id' => $level3->accreditation_level_id,
                'area_number' => 1,
                'area_name' => 'Mission, Goals, and Objectives',
                'area_description' => 'The area of Vision, Mission, Goals, and Objectives is the most fundamental of all the (10) areas to be surveyed. Everything in the Institution is justified only to the extent that it realizes its vision and mission. It is essential therefore, for the Institution to formulate the vision and mission which should be the bases of all its operations. The Institution is judged by the degree to which these are attained, not in comparison with others.',
            ],
            [
                // 'area_id' => 12,
                'accreditation_level_id' => $level3->accreditation_level_id,
                'area_number' => 2,
                'area_name' => 'Faculty',
                'area_description' => 'The standard or quality of an institution or program is greatly measured by the qualifications of its faculty. In this light, the faculty should be composed of competent members in terms of academic qualifications, experience and professional expertise. In addition, they should manifest desirable personal qualities and high level of professionalism. To be effective, faculty members should be properly compensated and taken care of. They must be given opportunities for continuous personal and professional development. A policy of fair and equitable distribution of teaching assignments and workload should be practiced. Likewise, objective and clear promotion criteria/ scheme should be adopted by the institution.',
            ],
            [
                // 'area_id' => 13,
                'accreditation_level_id' => $level3->accreditation_level_id,
                'area_number' => 3,
                'area_name' => 'Curriculum and Instruction',
                'area_description' => 'Curriculum and instruction occupy center stage in any educational program. These seek to research, develop, and implement curriculum changes that enhance student achievement within and outside of institutions. How students learn and the best ways to educate deserve much consideration.',
            ],
            [
                // 'area_id' => 14,
                'accreditation_level_id' => $level3->accreditation_level_id,
                'area_number' => 4,
                'area_name' => 'Support to Students',
                'area_description' => "Students are the raison d' etre for the establishment of learning institutions. Thus, the school has the responsibility to support the family and other social institutions in the development of the total personality of the student. Towards this end a program of student services is designed as an integral part of institutional effectiveness. All activities should be well planned and implemented to assist the student to attain his/her maximum potential and become a worthy contributor in his/her social environment. Student support and services complement the Academic Program.",
            ],
            [
                // 'area_id' => 15,
                'accreditation_level_id' => $level3->accreditation_level_id,
                'area_number' => 5,
                'area_name' => 'Research',
                'area_description' => 'Research is an avenue through which new knowledge is discovered, applied or verified and through which appropriate technologies are generated. Thus, it is a basic requirement for an educational institution to have a firmly established research and development program. Its thrusts and priorities should be congruent with those identified in the development plans of regional and national R and D-oriented agencies such as NEDA, DOST, CHED, etc. The institutional leadership in research should be proactive and developmental in orientation. It must provide adequate and sustained budget allocation annually for the academic Unit. Adequate physical facilities, laboratory equipment and supplies for research should be provided. The Academic unit has to maintain strong research linkages with various R and D agencies locally and internationally.',
            ],
            [
                // 'area_id' => 16,
                'accreditation_level_id' => $level3->accreditation_level_id,
                'area_number' => 6,
                'area_name' => 'Extension and Community Involvement',
                'area_description' => "The extension function makes the institution's presence felt in the community. It involves the application of existing and new knowledge and technology and those generated in the Institution to improve the quality of life of the people. Through the extension program, people are empowered with appropriate knowledge, attitudes and skills. Thus, extension services cater to various aspects of the community life, e.g., economic growth, promotion of health, environmental management, and social transformation. The Institution plans and implements an extension program that is need and client-based. This program should have a budgetary support and other resource allocation. The faculty members may serve as experts, consultants, organizers, facilitators, coordinators, service providers, and change agents in the community as forms of extension and community involvement. Careful planning and coordination with other community outreach agencies should be considered to avoid duplication of services offered to the clientele.",
            ],
            [
                // 'area_id' => 17,
                'accreditation_level_id' => $level3->accreditation_level_id,
                'area_number' => 7,
                'area_name' => 'Library',
                'area_description' => 'The library is the heart of any learning institution. It is a synergy of people, hardware and software whose purpose is to assist clients in using knowledge and technology to transform and improve their lives. Information and knowledge are essential to the attainment of institutional goals. The ways in which they are selected, acquired, stored, accessed and distributed within the Institution will, in large measure, determine the success of teaching, research and other academic endeavors. The Institution thrives on clear policies concerning access to, and provision of, information. Thus, the library must take an active role in the development and implementation of these policies. Each institution has a unique vision, mission, goals and objectives. These are influenced by its philosophy, geographical location and social responsibility. Similarly, as a subsystem of the Institution, the library has a unique role to perform.',
            ],
            [
                // 'area_id' => 18,
                'accreditation_level_id' => $level3->accreditation_level_id,
                'area_number' => 8,
                'area_name' => 'Library',
                'area_description' => 'The library is the heart of any learning institution. It is a synergy of people, hardware and software whose purpose is to assist clients in using knowledge and technology to transform and improve their lives. Information and knowledge are essential to the attainment of institutional goals. The ways in which they are selected, acquired, stored, accessed and distributed within the Institution will, in large measure, determine the success of teaching, research and other academic endeavors. The Institution thrives on clear policies concerning access to, and provision of, information. Thus, the library must take an active role in the development and implementation of these policies. Each institution has a unique vision, mission, goals and objectives. These are influenced by its philosophy, geographical location and social responsibility. Similarly, as a subsystem of the Institution, the library has a unique role to perform.',
            ],
            [
                // 'area_id' => 19,
                'accreditation_level_id' => $level3->accreditation_level_id,
                'area_number' => 9,
                'area_name' => 'Laboratories',
                'area_description' => 'Laboratories are included in the support systems for any academic program. Broadly defined, they cover science laboratories, speech laboratories, demonstration farms, shops, and other facilities for practicum activities essential to the successful implementation of curricular programs inclusive of their use and functions.',
            ],
            [
                // 'area_id' => 20,
                'accreditation_level_id' => $level3->accreditation_level_id,
                'area_number' => 10,
                'area_name' => 'Administration',
                'area_description' => 'The administration is the engine of the institution in the attainment of its vision, mission, goals and objectives. It is concerned with the general affairs of the institution and its organizational performance. Thus, the administration adopts institutional processes and ensures that said processes are satisfactorily implemented.',
            ],
        ];
        foreach ($areas as $attributes) {
            Areas::factory()->create($attributes);
        }
        $user1 = User::where('user_id', 22222)->first();
        $areaRole1 = Areas::where('area_name', 'Administration')->first();
        $areaRole2 = Areas::where('area_name', 'Laboratories')->first();
        // dd($areaRole1->get());
        $userAreaRoles = [
            [
                'user_id' => $user1->user_id,
                'area_id' => $areaRole1->area_id,
            ],
            [
                'user_id' => $user1->user_id,
                'area_id' => $areaRole2->area_id,
            ],
            /* [
                'user_id' => 33333,
                'area_id' => 12,
            ],
            [
                'user_id' => 33333,
                'area_id' => 1,
            ], */
        ];
        foreach ($userAreaRoles as $attributes) {
            UserAreaRoles::factory()->create($attributes);
        }
        Facilities::factory(10)->create();

        $objectives = [
            [
                'program_id' => $program1->program_id,
                'objective_description' => "Conduct a self-assessment to determine the level of entrepreneurial competencies",
            ],
            [
                'program_id' => $program1->program_id,
                'objective_description' => "Prepare and comply with requirements for business operation",
            ],
            [
                'program_id' => $program1->program_id,
                'objective_description' => "Prepare a business plan",
            ],
            [
                'program_id' => $program1->program_id,
                'objective_description' => "Mobilize the necessary human, financial, logistical and technical resources to implement the business plan",
            ],
            [
                'program_id' => $program4->program_id,
                'objective_description' => "Mobilize the necessary human, financial, logistical and technical resources to implement the business plan",
            ],
            [
                'program_id' => $program4->program_id,
                'objective_description' => "Prepare and comply with requirements for business operation",
            ],
            [
                'program_id' => $program4->program_id,
                'objective_description' => "Prepare a business plan",
            ],
            [
                'program_id' => $program4->program_id,
                'objective_description' => "Mobilize the necessary human, financial, logistical and technical resources to implement the business plan",
            ],
        ];
        foreach ($objectives as $attributes) {
            ProgramObjectives::factory()->create($attributes);
        }

        $area1 = Areas::where('area_name', 'Mission, Goals, and Objectives')
            ->where('accreditation_level_id', $level2->accreditation_level_id)->first();
        $area4 = Areas::where('area_name', 'Support to Students')
            ->where('accreditation_level_id', $level2->accreditation_level_id)->first();
        $areaparameter = [
            [
                // 'area_parameter_id' => 1,
                'area_id' => $area1->area_id,
                'parameter_name' => 'A',
                'parameter_description' => 'Statement of Vision, Mission, Goals, and Objectives'
            ],
            [
                // 'area_parameter_id' => 2,
                'area_id' => $area1->area_id,
                'parameter_name' => 'B',
                'parameter_description' => 'Dissemination and Acceptability'
            ],
            [
                // 'area_parameter_id' => 3,
                'area_id' => $area4->area_id,
                'parameter_name' => 'A',
                'parameter_description' => 'Statement of Vision, Mission, Goals, and Objectives'
            ],
            [
                // 'area_parameter_id' => 4,
                'area_id' => $area4->area_id,
                'parameter_name' => 'B',
                'parameter_description' => 'Dissemination and Acceptability'
            ],
        ];
        foreach ($areaparameter as $attributes) {
            AreaParameters::factory()->create($attributes);
        }

        $parameterCategory = [
            [
                'category_name' => 'No Category',
                'parameter_outline_category_id' => 1
            ],
            [
                'category_name' => 'Systems - Inputs and Processes',
                'parameter_outline_category_id' => 2
            ],
            [
                'category_name' => 'Implementation',
                'parameter_outline_category_id' => 3
            ],
            [
                'category_name' => 'Outcome/s',
                'parameter_outline_category_id' => 4
            ],
        ];
        foreach ($parameterCategory as $attributes) {
            ParameterOutlineCategory::factory()->create($attributes);
        }

        $parameter1 = AreaParameters::where('area_id', $area1->area_id)
            ->where('parameter_name', 'A')->first();
        $parameter3 = AreaParameters::where('area_id', $area4->area_id)
            ->where('parameter_name', 'A')->first();
        $parameterOutlines = [
            [
                'area_parameter_id' => $parameter1->area_parameter_id,
                'parameter_outline_category_id' => 2,
                'outline_number' => '1.1',
                'outline_description' => 'The institution has a system of determining the Vision and Mission.',
                'container' => false
            ],
            [
                'area_parameter_id' => $parameter1->area_parameter_id,
                'parameter_outline_category_id' => 2,
                'outline_number' => '1.2',
                'outline_description' => 'The Vision clearly reflects what the Institution hopes to become in the future.',
                // 'container' => false
            ],
            [
                'area_parameter_id' => $parameter1->area_parameter_id,
                'parameter_outline_category_id' => 3,
                'outline_number' => '1.1',
                'outline_description' => 'The Institution/College conducts review on the statement of the Vision and Mission as well as its goals and program objectives for the approval of authorities concerned.',
                'container' => false
            ],
            [
                'area_parameter_id' => $parameter1->area_parameter_id,
                'parameter_outline_category_id' => 3,
                'outline_number' => '1.2',
                'outline_description' => 'The College/Academic Unit follows a system of formulating its goals and the objectives of the program.',
                'container' => false
            ],
            [
                'area_parameter_id' => $parameter1->area_parameter_id,
                'parameter_outline_category_id' => 4,
                'outline_number' => '1',
                'outline_description' => 'The VMGO are crafted and duly approved by BOR/BOT.',
                'container' => false
            ], [
                'area_parameter_id' => $parameter3->area_parameter_id,
                'parameter_outline_category_id' => 2,
                'outline_number' => '1.1',
                'outline_description' => 'The institution has a system of determining the Vision and Mission.',
                'container' => false
            ],
            [
                'area_parameter_id' => $parameter3->area_parameter_id,
                'parameter_outline_category_id' => 2,
                'outline_number' => '1.2',
                'outline_description' => 'The Vision clearly reflects what the Institution hopes to become in the future.',
                'container' => false
            ],
            [
                'area_parameter_id' => $parameter3->area_parameter_id,
                'parameter_outline_category_id' => 3,
                'outline_number' => '1.1',
                'outline_description' => 'The Institution/College conducts review on the statement of the Vision and Mission as well as its goals and program objectives for the approval of authorities concerned.',
                'container' => false
            ],
            [
                'area_parameter_id' => $parameter3->area_parameter_id,
                'parameter_outline_category_id' => 3,
                'outline_number' => '1.1',
                'outline_description' => 'The Institution/College conducts review on the statement of the Vision and Mission as well as its goals and program objectives for the approval of authorities concerned.',
                'container' => false
            ],
            [
                'area_parameter_id' => $parameter3->area_parameter_id,
                'parameter_outline_category_id' => 3,
                'outline_number' => '1.2',
                'outline_description' => 'The College/Academic Unit follows a system of formulating its goals and the objectives of the program.',
                'container' => false
            ],
            [
                'area_parameter_id' => $parameter3->area_parameter_id,
                'parameter_outline_category_id' => 3,
                'outline_number' => '1',
                'outline_description' => 'The VMGO are crafted and duly approved by BOR/BOT.',
                'container' => false
            ],
        ];
        foreach ($parameterOutlines as $attributes) {
            ParameterOutlines::factory()->create($attributes);
        }
        // AreaForms::factory(20)->create();
        // AreaFiles::factory(200)->create();
        Exhibits::factory(10)->create();
        // ExhibitOutlines::factory(10)->create();
        // ExhibitFiles::factory(10)->create();

        $bsitFaculties = [
            'Elias Austria',
            'Alfeo Mendoza',
            'Alfred Pagalilawan',
        ];

        $psychFaculties = [
            'Angeline Pabilona',
            'Anna Madonna Arellano',
            'Ian Llenares'
        ];

        $fullTime = [
            'Elias Austria',
            'Alfred Pagalilawan',
            'Rogie Delena',
            'Peter Biason',
            'Lemuel Damole',
            'Ronette Espiritu',
            'Anna Madonna Arellano',
            'Cecilia Reyes Alagon',
            'Ian Saguindan',
            'Erwin Dela Cruz',
            'Maria Carina Corpuz',
            'Meckmack Nartea',
            'Rizza Valdez Devera',
            'Angeline Pabilona',
            'Jane Mendoza',
        ];

        $file_status = [
            ['status_name' => 'Approved'],
            ['status_name' => 'Pending'],
            ['status_name' => 'Rejected'],
        ];
        foreach ($file_status as $attributes) {
            FileStatus::factory()->create($attributes);
        }
        $area_forms_category = [
            ['category_name' => 'Program Performance Profile'],
            ['category_name' => 'Self-Survey'],
            ['category_name' => 'Compliance Report']
        ];
        foreach ($area_forms_category as $attributes) {
            AreaFormCategory::factory()->create($attributes);
        }
        // AreaForms::factory(20)->create();
        // AreaFiles::factory(200)->create();
        Exhibits::factory(10)->create();
        // ExhibitOutlines::factory(10)->create();
        // ExhibitFiles::factory(10)->create();

        $bsitFaculties = [
            'Elias Austria',
            'Alfeo Mendoza',
            'Alfred Pagalilawan',
        ];

        $psychFaculties = [
            'Angeline Pabilona',
            'Anna Madonna Arellano',
            'Ian Llenares'
        ];

        $fullTime = [
            'Elias Austria',
            'Alfred Pagalilawan',
            'Rogie Delena',
            'Peter Biason',
            'Lemuel Damole',
            'Ronette Espiritu',
            'Anna Madonna Arellano',
            'Cecilia Reyes Alagon',
            'Ian Saguindan',
            'Erwin Dela Cruz',
            'Maria Carina Corpuz',
            'Meckmack Nartea',
            'Rizza Valdez Devera',
            'Angeline Pabilona',
            'Jane Mendoza',
        ];

        $directory = public_path('images/adfa-new/faculty'); // Folder location
        $files = File::files($directory); // Get all files

        $faculties = [];

        foreach ($files as $file) {
            $fileName = $file->getFilename(); // e.g. "Jose-Rizal.jpg"
            $extension = $file->getExtension();

            // Remove extension and split by hyphen
            $nameParts = explode('-', pathinfo($fileName, PATHINFO_FILENAME));

            if (count($nameParts) >= 2) {
                $lastName = array_pop($nameParts);
                $firstName = implode(' ', $nameParts);
            } else {
                $firstName = $nameParts[0];
                $lastName = '';
            }

            $fullName = Str::title(trim(str_replace('-', ' ', "{$firstName} {$lastName}")));

            // Determine program based on name
            if (in_array($fullName, $psychFaculties)) {
                $programId = $program4->program_id; // Psychology
            } elseif (in_array($fullName, $bsitFaculties)) {
                $programId = $program1->program_id; // BSIT
            } else {
                $programId = null;
            }

            if (in_array($fullName, $fullTime)) {
                $facultyStatus = 'Full Time';
            } else {
                $facultyStatus = 'Part Time';
            }

            $faculties[] = [
                'first_name' => Str::title(str_replace('-', ' ', $firstName)),
                'last_name' => Str::title(str_replace('-', ' ', $lastName)),
                'personnel_type' => 'Faculty',
                'status' => $facultyStatus,
                'program_id' => $programId,
                'program_coordinator' => false,
                /* 'image_name' => $fileName,
                'image_path' => '/images/adfa-new/faculty/' . $fileName, */
            ];
        }


        // Insert all entries at once
        DB::table('faculty_staff')->insert($faculties);
        $content = [
            [
                'page' => 'Facilities',
            ],
            [
                'page' => 'Administration',
            ],
            [
                'page' => 'About',
            ],
            [
                'page' => 'Local Task Force',
            ],
            [
                'page' => 'Faculty & Staff',
            ],
            [
                'page' => 'History',
            ],
            [
                'page' => 'Vision, Mission & Goals',
            ],
            [
                'page' => 'Other Services',
            ],
        ];
        foreach ($content as $attributes) {
            ContentPages::factory()->create($attributes);
        }
    }

}
