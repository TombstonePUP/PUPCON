import { Head, Link } from '@inertiajs/react';
import Layout from '@/layouts/landing-layout';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion"
import {
    Area,
    PerProgram,
    ParameterOutlineCategory
} from '@/types';
import { buildOutlineTree, RecursiveOutline } from '@/components/recursive-outline';

interface AreaProps {
    program: PerProgram;
    area: Area;
    categories: ParameterOutlineCategory[];
}

export default function AreaPage({ program, area, categories }: AreaProps) {
    // area.area_parameters = area.area_parameters.sor
    return (
        <>
            <Head
                title={
                    area.area_numeral != ' ' ? `Area ${area.area_numeral} - ${program.program_name}` : `${area.area_name} - ${program.program_name}`
                }
            >
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Layout>
                <div className='flex flex-row w-full justify-center gap-[1vw] h-[18vw] p-[2vw]'>
                    <div className='bg-[#7f1414] w-[25%] rounded-tl-[1vw] rounded-bl-[1vw] rounded-tr-[1vw] flex flex-col justify-center px-[4vw]'>
                        <p className='text-white text-[1vw]'>
                            {area.area_numeral != ' ' ? `Area ${area.area_numeral}` : `Area ${area.area_number}`}
                        </p>
                        <h1 className='text-white font-bold text-[1.7vw] leading-[1.7vw]'>Mission, Goals, and Objectives</h1>
                    </div>
                    <img className='object-cover w-[45%] rounded-tl-[1vw] rounded-br-[1vw] rounded-tr-[1vw]' src="/images/placeholder.png" alt="placeholder" />
                </div>
                <div className='flex justify-center'>
                    <p className='indent-[2vw] text-justify w-[68%] py-[1.5vw] px-[3vw] border rounded-[1vw] border-[#7f1414]/25 hover:border-[#7f1414] transition duration-300'>
                        {area.area_description || 'No area description available.'}
                    </p>
                </div>
                <div className='w-full flex justify-center py-[2vw]'>
                    <Accordion type="single" collapsible className='w-[68%] flex flex-col gap-[1vw]'>
                        {area.area_parameters?.length > 0 ? (
                            area.area_parameters?.map((parameter, index) => (
                                <AccordionItem className='group transition duration-300' value={`parameter-${index}`} key={index}>
                                    <AccordionTrigger className='flex flex-row justify-between group-hover:cursor-pointer  my-1 '>
                                        <div className="flex flex-row justify-between w-full">
                                            <h1 className='text-[#7f1414] group-hover:text-[#a01818] font-bold'>
                                                { parameter.parameter_name != ' ' ? `Parameter ${parameter.parameter_name.toUpperCase()[0]}` : parameter.parameter_name }
                                            </h1>
                                            <p>{parameter.parameter_description}</p>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {categories.map((category) => {
                                            const outlines = parameter.parameter_outlines?.filter(
                                                outline => outline.parameter_outline_category_id === category.parameter_outline_category_id
                                            ) || [];
                                            if (outlines.length === 0) return null;
                                            {outlines.map((outline) => (
                                                outline.initial = category.category_name == 'No Category' ?
                                                    parameter.parameter_name == ' ' ? '' : parameter.parameter_name.toUpperCase().match(/^[A-Za-z]/)
                                                    : category.category_name.match(/^[A-Za-z]/)
                                            ))}

                                            const sortedOutlines = buildOutlineTree({ outlines });

                                            return (
                                                <div key={category.parameter_outline_category_id} className='bg-[#D9D9D9]/25 p-[2vw] rounded'>
                                                    <h1 className='font-bold'>{category.category_name == 'No Category' ? '' : category.category_name}</h1>
                                                    <RecursiveOutline outlines={sortedOutlines} />
                                                </div>
                                            );
                                        })}
                                    </AccordionContent>
                                </AccordionItem>
                            ))
                        ) : (
                            <p className='text-center text-gray-500'>No parameters available for this area.</p>
                        )}
                    </Accordion>
                </div>
            </Layout>
        </>
    )
}
