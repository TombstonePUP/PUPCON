import * as React from "react";
import { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart, XAxis, YAxis } from "recharts";
import { type DocumentStatistics, type FrequencyUploads, type OverallUploads } from "@/types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PolarViewBox } from "recharts/types/util/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DocumentsAnalyticsProps {
  frequencyUploads: FrequencyUploads[];
  overallUploads?: OverallUploads[];
  documentStatistics: DocumentStatistics[];
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers & shared UI
// ---------------------------------------------------------------------------

function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full rounded-xl" style={{ height }} />
      <div className="flex items-center justify-center gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

/** Reusable card shell identical to LogsAnalytics style */
function AnalyticsCard({
  title,
  description,
  filter,
  children,
  contentClassName,
}: {
  title: string;
  description: string;
  filter?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between bg-muted/50 py-4 px-6 rounded-t-lg border-b">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        {filter}
      </div>
      <div className={contentClassName ?? "p-6"}>{children}</div>
    </Card>
  );
}

/** Small pill-style days filter */
const TIME_OPTIONS = [
  { label: "3D", value: "3d" },
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
];

function TimeFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {TIME_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 text-xs rounded-md transition-colors ${value === opt.value
            ? "bg-primary text-primary-foreground font-medium"
            : "text-muted-foreground hover:bg-muted"
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function filterByRange(data: FrequencyUploads[], range: string): FrequencyUploads[] {
    const days = range === "3d" ? 3 : range === "7d" ? 7 : 30;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);

    return data.filter((item) => new Date(item.activity_date) >= cutoff);
}

// ---------------------------------------------------------------------------
// Chart configs
// ---------------------------------------------------------------------------

const areaChartConfig = {
  activity: {
    label: "Activity",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const pieChartConfig = {
  "Area Files": { color: "var(--chart-1)" },
  "Area Forms": { color: "var(--chart-2)" },
  "Exhibit Files": { color: "var(--chart-3)" },
  "Missing Files": { color: "var(--chart-5)" },
} satisfies ChartConfig;

const barChartConfig = {
  documents: { label: "Documents" },
  Approved: { label: "Approved", color: "var(--chart-1)" },
  Pending: { label: "Pending", color: "var(--chart-2)" },
  Rejected: { label: "Rejected", color: "var(--chart-3)" },
} satisfies ChartConfig;

// ---------------------------------------------------------------------------
// Helpers for OverallProgress
// ---------------------------------------------------------------------------

const colorMap: Record<string, string> = {
  area_files: "var(--chart-1)",
  area_forms: "var(--chart-2)",
  exhibit_files: "var(--chart-3)",
};

function toTitleCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function DocumentsAnalytics({
  frequencyUploads,
  overallUploads = [],
  documentStatistics,
  loading,
}: DocumentsAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("7d");

  // --- Area chart data ---
  const filteredFrequency = useMemo(
    () => filterByRange(frequencyUploads, timeRange),
    [frequencyUploads, timeRange],
  );

  // --- Pie chart data ---
  const pieData = useMemo(() => {
    let missing = 0;
    const main = overallUploads.flatMap((item) => {
      const key = item.document_type.toLowerCase();
      missing += item.outlines || 0;
      return [{ name: toTitleCase(key), value: item.documents, fill: colorMap[key] ?? "var(--muted)" }];
    });
    if (missing > 0) main.push({ name: "Missing Files", value: missing, fill: "var(--chart-5)" });
    return main;
  }, [overallUploads]);

  const pieTotal = pieData
    .filter((e) => e.name !== "Missing Files")
    .reduce((acc, cur) => acc + cur.value, 0);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="grid grid-cols-2 gap-4">

      {/* 1 ─ Upload Frequency (area) — spans full width on xl, 2 cols on md */}
      <div className="md:col-span-2 xl:col-span-1">
        <AnalyticsCard
          title="Document Activity Trend"
          description={`Overall upload frequency — last ${timeRange === "3d" ? "3 days" :
              timeRange === "7d" ? "7 days" :
                "30 days"
            }`}
          filter={<TimeFilter value={timeRange} onChange={setTimeRange} />}
          contentClassName="px-2 py-4 sm:px-6 sm:py-6"
        >
          {loading ? (
            <ChartSkeleton height={220} />
          ) : (
            <ChartContainer
              config={areaChartConfig}
              className="w-full max-h-[240px] min-h-[210px]"
            >
              <AreaChart data={filteredFrequency}>
                <defs>
                  <linearGradient id="fillActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="activity_date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  minTickGap={40}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis hide domain={[0, "dataMax + 1"]} />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                      indicator="line"
                    />
                  }
                />
                {/* <ChartLegend content={<ChartLegendContent />} /> */}
                <Area
                  dataKey="activity"
                  type="bump"
                  connectNulls={false}
                  fill="url(#fillActivity)"
                  stroke="var(--chart-1)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          )}
        </AnalyticsCard>
      </div>

      {/* 2 ─ Overall Progress (pie / donut) */}
      <AnalyticsCard
        title="Document Uploads"
        description="Uploaded vs outlines with no documents"
        contentClassName="px-2 py-4 sm:px-6"
      >
        {loading ? (
          <ChartSkeleton height={220} />
        ) : (
          <ChartContainer
            config={pieChartConfig}
            className="mx-auto aspect-square min-h-[150px] max-h-[220px]"
          >
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="line" />} />
              <Pie data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={100}
                strokeWidth={10}
                startAngle={180}
                endAngle={0}
                cy={140}>
                {pieData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.fill ?? "var(--muted)"} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox) return null;
                    const { cx, cy } = viewBox as PolarViewBox;
                    return (
                      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={cx} y={cy} className="fill-foreground text-3xl font-bold">
                          {pieTotal.toLocaleString()}
                        </tspan>
                        <tspan x={cx} y={(cy || 0) + 24} className="fill-muted-foreground text-xs">
                          Documents
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
              <ChartLegend
                content={() => (
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
                    {pieData.map((entry) => (
                      <span key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                        {entry.name}
                      </span>
                    ))}
                  </div>
                )}
              />
            </PieChart>

          </ChartContainer>
        )}
      </AnalyticsCard>

      {/* 3 ─ Document Approval Status (horizontal bar) */}
      {/* <AnalyticsCard
        title="Document Approval Status"
        description="Overall document approval, pending, and rejections"
        contentClassName="px-2 py-4 sm:px-6 sm:py-6"
      >
        {loading ? (
          <ChartSkeleton height={220} />
        ) : (
          <ChartContainer
            config={barChartConfig}
            className="mx-auto aspect-square min-h-[150px] max-h-[220px]"
          >
            <BarChart
              accessibilityLayer
              data={documentStatistics}
              layout="vertical"
              margin={{ left: 20 }}
            >
              <YAxis
                dataKey="file_status"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  barChartConfig[value as keyof typeof barChartConfig]?.label ?? value
                }
              />
              <XAxis dataKey="documents" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel indicator="line" />}
              />
              <Bar dataKey="documents" layout="vertical" radius={5}>
                {documentStatistics.map((entry) => (
                  <Cell
                    key={entry.file_status}
                    fill={barChartConfig[entry.file_status as keyof typeof barChartConfig]?.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </AnalyticsCard> */}

    </div>
  );
}