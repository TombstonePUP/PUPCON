"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { type FrequencyUploads } from "@/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProgressChartProps {
    data: FrequencyUploads[]
}

const chartConfig = {
  documents: {
    label: "Documents",
  },
  uploads: {
    label: "Uploads",
    color: "hsl(var(--chart-1))",
  },
  approved: {
    label: "Approved",
    color: "hsl(var(--chart-2))",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-3))",
  }, } satisfies ChartConfig

const getTimeRangeLabel = (range: string) => {
  switch (range) {
    case "7d":
      return "last 7 days"
    case "30d":
      return "last 30 days"
    case "90d":
    default:
      return "last 3 months"
  }
}

export function ProgressChart( { data }: ProgressChartProps) {
  console.log("ProgressChart data", data)
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = data.filter((item) => {
    const date = new Date(item.activity_date)
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>File Activity Frequency</CardTitle>
          <CardDescription>
            Showing document activity for the {getTimeRangeLabel(timeRange)}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[275px] w-full"
        >
          <defs>
            <clipPath id="clip">
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillUploads" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-uploads)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-uploads)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-approved)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-approved)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRejected" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-rejected)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-rejected)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="activity_date"
              tickLine={false}
              allowDataOverflow={true}
              axisLine={false}
              tickMargin={10}
              minTickGap={40}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              hide={true}
              domain={[0, "dataMax + 1"]}
            /> <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="line"
                />
              }
            />
            <Area
              dataKey="uploads"
              type="bump"
              connectNulls={false}
              fill="url(#fillUploads)"
              stroke="var(--color-uploads)"
              stackId="a"
            />
            <Area
              dataKey="approved"
              type="bump"
              connectNulls={false}
              fill="url(#fillApproved)"
              stroke="var(--color-approved)"
              stackId="b"
            />
            <Area
              dataKey="rejected"
              type="bump"
              connectNulls={false}
              fill="url(#fillRejected)"
              stroke="var(--color-rejected)"
              stackId="c"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
