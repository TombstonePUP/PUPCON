"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Cell } from "recharts"

import { type OverallUploads } from "@/types"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface OverallProgressProps {
    data?: OverallUploads[]
}

const chartConfig = {
    "Area Documents": { color: "hsl(var(--chart-1))" },
    "Exhibit Documents": { color: "hsl(var(--chart-2))" },
    "Area Outlines": { color: "hsl(var(--chart-5))" },
    "Exhibit Outlines": { color: "hsl(var(--chart-4))" },
} satisfies ChartConfig

function toTitleCase(str: string) {
    return str
        .replace(/_/g, " ")         // snake_case → words
        .replace(/\bfile\b/gi, "")  // remove 'file'
        .replace(/\s+/g, " ")       // remove extra spaces
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function OverallProgress({ data = [] }: OverallProgressProps) {
    const pieData = React.useMemo(() => {
        return data.flatMap((item) => {
            const docLabel = `${toTitleCase(item.document_type)} Documents`
            const outlineLabel = `${toTitleCase(item.document_type)} Outlines`
            return [
                { name: docLabel, value: item.documents },
                { name: outlineLabel, value: item.outlines },
            ]
        })
    }, [data])


    const total = pieData.reduce((acc, cur) => acc + cur.value, 0)

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0 border-b">
                <CardTitle>Document Uploads</CardTitle>
                {/* <CardDescription>Document Uploaded and Outline with no Documents</CardDescription> */}
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel
                                indicator="line"
                            />}
                        />
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            {pieData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={chartConfig[entry.name]?.color ?? "#ccc"}
                                />
                            ))}
                            <Label
                                content={({ viewBox }) => {
                                    if (!viewBox) return null
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                                {total.toLocaleString()}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                            >
                                                Documents
                                            </tspan>
                                        </text>
                                    )
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Document Upload Progress
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing Document Uploads of Area and Exhibit files
                </div>
            </CardFooter>
        </Card>
    )
}

