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
    "Area Files": { color: "hsl(var(--chart-1))" },
    "Area Forms": { color: "hsl(var(--chart-2))" },
    "Exhibit Files": { color: "hsl(var(--chart-3))" },
    "Missing Files": { color: "hsl(var(--chart-5))" },
} satisfies ChartConfig

function toTitleCase(str: string) {
    return str
        .replace(/_/g, " ")         // snake_case → words
        // .replace(/\bfile\b/gi, "")  // remove 'file'
        .replace(/\s+/g, " ")       // remove extra spaces
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function OverallProgress({ data = [] }: OverallProgressProps) {
    const pieData = React.useMemo(() => {
        let missing = 0
        const mainData = data.flatMap((item) => {
            const label = `${toTitleCase(item.document_type)}`
            missing += item.outlines || 0
            return [{ name: label, value: item.documents }]
        })

        if (missing > 0) {
            mainData.push({ name: "Missing Files", value: missing })
        }

        return mainData
    }, [data])

    const total = pieData
        .filter((entry) => entry.name !== "Missing Files")
        .reduce((acc, cur) => acc + cur.value, 0)


    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Document Uploads</CardTitle>
                <CardDescription>Uploaded and Outline with no Documents</CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 ">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square min-h-[150px]"
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
                            strokeWidth={10}
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
           <CardFooter className="flex-col items-start gap-2 text-sm ">
                <div className="flex gap-2 font-medium leading-none">
                    Showing averall progress
                </div>
                <div className="leading-snug text-muted-foreground">
                 Total count of documents currently uploaded
                </div>
            </CardFooter>
        </Card>
    )
}

