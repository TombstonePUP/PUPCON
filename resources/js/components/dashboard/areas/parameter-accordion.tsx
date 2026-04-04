'use client';
import { buildOutlineTree, RecursiveOutlineForm } from '@/components/recursive-outline';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Area, AreaFormCategory, type AreaParameters, type ParameterOutlineCategory, ParameterOutlines, Program } from '@/types';
import { usePage } from '@inertiajs/react';
import { FolderPlus, Pencil, PlusCircle, Trash2 } from 'lucide-react';

const alphaRegex = new RegExp('^[A-Za-z]');

interface DocDialogParams {
  type: 'view' | 'upload' | 'delete' | 'rejected';
  benchmark: ParameterOutlines;
}

interface BenchDialogParams {
  type: 'add' | 'edit' | 'delete';
  benchmark?: ParameterOutlines;
  parameter?: AreaParameters;
}

interface ParamDialogParams {
  type: 'add' | 'import' | 'edit' | 'delete';
  parameter: AreaParameters;
}

interface ParameterAccordionProps {
  area: Area;
  program: Program;
  areaParameters?: AreaParameters[];
  parameterOutlineCategories?: ParameterOutlineCategory[];
  resolveDocDialog: (params: DocDialogParams) => void;
  resolveBenchDialog: (params: BenchDialogParams) => void;
  resolveParamDialog: (params: ParamDialogParams) => void;
}

export default function ParameterAccordion({
  area,
  program,
  areaParameters,
  parameterOutlineCategories,
  resolveDocDialog,
  resolveBenchDialog,
  resolveParamDialog,
}: ParameterAccordionProps) {
  const { auth } = usePage().props;
  const role = auth.user.roles.role_name;
  const canShowActions =
    (role === 'Admin' || role === 'Coordinator') &&
    program.levels[0]?.is_active &&
    program.levels[0]?.remarks === 'Ongoing Survey' &&
    !area.archive === true;

  return (
    <>
      <Accordion type="single" collapsible className="flex w-full flex-col gap-4">
        {areaParameters?.length > 0 ? (
          areaParameters?.map((parameter) => (
            <AccordionItem
              value={`item-${parameter.area_parameter_id}`}
              className="group bg-card"
              key={parameter.area_parameter_id}
            >
              <AccordionTrigger className="flex flex-row items-center justify-between group-hover:cursor-pointer">
                <div className="flex w-full flex-row items-center justify-between pr-4">
                  <h1 className="font-bold text-[#7f1414] group-hover:text-[#a01818]">
                    {!parameter.parameter_name?.trim()
                      ? `${parameter.parameter_description}`
                      : `Parameter ${parameter.parameter_name.toUpperCase()[0]}`
                    }
                  </h1>
                  <p className="text-sm text-muted-foreground hidden lg:inline">
                    {parameter.parameter_name?.trim() ? parameter.parameter_description : ''}
                  </p>
                </div>
                {canShowActions && (
                  <div className="flex justify-center gap-3">
                    <Button
                      className="border-none text-xs"
                      onClick={() => resolveParamDialog({ type: 'edit', parameter: parameter })}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="hidden xl:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-xs"
                      onClick={() => resolveParamDialog({ type: 'delete', parameter: parameter })}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden xl:inline">Remove</span>
                    </Button>
                  </div>
                )}
              </AccordionTrigger>
              <AccordionContent>
                {parameter.parameter_outlines?.length > 0 ? (
                  parameterOutlineCategories.map((category) => {
                    const outlines =
                      parameter.parameter_outlines?.filter(
                        (outline) =>
                          outline.parameter_outline_category_id ===
                          category.parameter_outline_category_id,
                      ) || [];
                    if (outlines.length === 0) return null;

                    outlines.map((outline) => {
                      outline.initial =
                        category.category_name === 'No Category'
                          ? parameter.parameter_name === ''
                            ? ''
                            : parameter.parameter_name.toUpperCase().match(alphaRegex)
                          : category.category_name.match(alphaRegex);
                    });

                    const sortedOutlines = buildOutlineTree({ outlines });

                    return (
                      <div
                        key={category.parameter_outline_category_id}
                        className="rounded bg-muted p-[2vw]"
                      >
                        <h1 className="mb-2.5 text-[1vw] font-semibold">
                          {category.category_name === 'No Category' ? '' : category.category_name}
                        </h1>
                        <RecursiveOutlineForm
                          outlines={sortedOutlines}
                          program={program}
                          area={area}
                          outlineCategory={parameterOutlineCategories}
                          resolveDocDialog={resolveDocDialog}
                          resolveBenchDialog={resolveBenchDialog}
                        />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground">
                    No outlines available for this parameter.
                  </p>
                )}

                {canShowActions && (
                  <Button
                    className="w-fit cursor-pointer text-xs"
                    variant="outline"
                    onClick={() => {
                      setTimeout(() => resolveBenchDialog({ type: 'add', parameter: parameter }), 50);
                    }}
                  >
                    <PlusCircle />
                    Add Benchmark
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderPlus />
              </EmptyMedia>
              <EmptyTitle>Content Not Available</EmptyTitle>
              <EmptyDescription>No available parameters in this area.</EmptyDescription>
            </EmptyHeader>
            {canShowActions && (
              <EmptyContent>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => resolveParamDialog({ type: 'import' })}>
                    Import
                  </Button>
                  <Button onClick={() => resolveParamDialog({ type: 'add' })}>Add Parameter</Button>
                </div>
              </EmptyContent>
            )}
          </Empty>
        )}
      </Accordion>
    </>
  );
}