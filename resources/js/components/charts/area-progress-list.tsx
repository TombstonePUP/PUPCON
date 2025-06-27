"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"

import { type DocumentStatistics } from "@/types"

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

interface DocumentStatisticsProps {
    data: DocumentStatistics[]
}

const chartConfig = {
    documents: {
        label: "Documents",
    },
    Approved: {
        label: "Approved",
        color: "hsl(var(--chart-1))"
    },
    Pending: {
        label: "Pending",
        color: "hsl(var(--chart-2))",
    },
    Rejected: {
        label: "Rejected",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

export function AreaProgress({ data }: DocumentStatisticsProps) {
    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle>Document Statistics - Bar Chart</CardTitle>
                {/* <CardDescription>Overall Document Statuses</CardDescription> */}
            </CardHeader>
            <CardContent >
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        layout="vertical"
                        margin={{
                            left: 20,
                        }}
                    >
                        <YAxis
                            dataKey="file_status"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]?.label
                            }
                        />
                        <XAxis dataKey="documents" type="number" hide />
                        {data.map((entry) => (
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent hideLabel
                                indicator="line"
                                nameKey={entry?.file_status}
                                color={chartConfig[entry.file_status]?.color}
                                />
                            }
                        />
                        ))}
                        <Bar dataKey="documents" layout="vertical" radius={5}>
                            {data.map((entry) => (
                                <Cell
                                    key={entry.file_status}
                                    fill={chartConfig[entry.file_status]?.color}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Showing all documents
                </div>
                <div className="leading-none text-muted-foreground">
                    Document uploads, approvals, pending, and rejections
                </div>
            </CardFooter>
        </Card>
    )
}
