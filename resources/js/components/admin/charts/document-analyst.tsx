import { Card, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { type DocumentStatistics, type FrequencyUploads, type OverallUploads } from '@/types';
import { TrendingDown, TrendingUp } from 'lucide-react';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Cell, Label, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { PolarViewBox } from 'recharts/types/util/types';

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
    trend,
    children,
    contentClassName,
}: {
    title: string;
    description: string;
    filter?: React.ReactNode;
    trend?: React.ReactNode;
    children: React.ReactNode;
    contentClassName?: string;
}) {
    return (
        <Card className="h-full">
            <div className="bg-muted/50 flex items-center justify-between border-b px-6 py-4">
                <div>
                    <div className="flex items-center gap-3">
                        <CardTitle className="text-foreground font-semibold">{title}</CardTitle>
                        {trend}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">{description}</p>
                </div>
                {filter}
            </div>
            <div className={contentClassName ?? 'p-6'}>{children}</div>
        </Card>
    );
}

/** Small pill-style days filter */
const TIME_OPTIONS = [
    { label: '3D', value: '3d' },
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
];

function TimeFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div className="flex items-center gap-1">
            {TIME_OPTIONS.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                        value === opt.value ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:bg-muted'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

function filterByRange(data: FrequencyUploads[], range: string): FrequencyUploads[] {
    const days = range === '3d' ? 3 : range === '7d' ? 7 : 30;

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
        label: 'Activity',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig;

const pieChartConfig = {
    'Area Files': { color: 'var(--chart-1)' },
    'Area Forms': { color: 'var(--chart-2)' },
    'Exhibit Files': { color: 'var(--chart-3)' },
    'Missing Files': { color: 'var(--chart-5)' },
} satisfies ChartConfig;

// ---------------------------------------------------------------------------
// Helpers for OverallProgress
// ---------------------------------------------------------------------------

const colorMap: Record<string, string> = {
    area_files: 'var(--chart-1)',
    area_forms: 'var(--chart-2)',
    exhibit_files: 'var(--chart-3)',
};

function toTitleCase(str: string) {
    return str
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function DocumentsAnalytics({ frequencyUploads, overallUploads = [], loading }: DocumentsAnalyticsProps) {
    const [timeRange, setTimeRange] = useState('7d');

    // --- Area chart data ---
    const filteredFrequency = useMemo(() => filterByRange(frequencyUploads, timeRange), [frequencyUploads, timeRange]);

    // --- Activity trend computation ---
    const activityTrend = useMemo(() => {
        const current = filteredFrequency;
        const currentTotal = current.reduce((sum, d) => sum + d.upload_count, 0);

        const days = timeRange === '3d' ? 3 : timeRange === '7d' ? 7 : 30;
        const prevCutoff = new Date();
        prevCutoff.setDate(prevCutoff.getDate() - days * 2);
        const currCutoff = new Date();
        currCutoff.setDate(currCutoff.getDate() - days);

        const prevPeriod = frequencyUploads.filter((d) => {
            const date = new Date(d.activity_date);
            return date >= prevCutoff && date < currCutoff;
        });
        const prevTotal = prevPeriod.reduce((sum, d) => sum + d.upload_count, 0);

        const pctChange = prevTotal > 0 ? Math.round(((currentTotal - prevTotal) / prevTotal) * 100) : currentTotal > 0 ? 100 : 0;

        return { currentTotal, pctChange };
    }, [filteredFrequency, frequencyUploads, timeRange]);

    // --- Pie chart data ---
    const pieData = useMemo(() => {
        let missing = 0;
        const main = overallUploads.flatMap((item) => {
            const key = item.document_type.toLowerCase();
            missing += item.outlines || 0;
            return [{ name: toTitleCase(key), value: item.documents, fill: colorMap[key] ?? 'var(--muted)' }];
        });
        if (missing > 0) main.push({ name: 'Missing Files', value: missing, fill: 'var(--chart-5)' });
        return main;
    }, [overallUploads]);

    const pieTotal = pieData.filter((e) => e.name !== 'Missing Files').reduce((acc, cur) => acc + cur.value, 0);
    const pieMissing = pieData.find((e) => e.name === 'Missing Files')?.value ?? 0;
    const pieGrandTotal = pieTotal + pieMissing;
    const completionPct = pieGrandTotal > 0 ? Math.round((pieTotal / pieGrandTotal) * 100) : 0;

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------

    return (
        <div className="grid grid-cols-3 gap-4">
            {/* 1 ─ Upload Frequency (area) — spans full width on xl, 2 cols on md */}
            <div className="col-span-2 xl:col-span-2">
                <AnalyticsCard
                    title="Document Activity Trend"
                    description={`Overall upload frequency — last ${timeRange === '3d' ? '3 days' : timeRange === '7d' ? '7 days' : '30 days'}`}
                    filter={<TimeFilter value={timeRange} onChange={setTimeRange} />}
                    contentClassName="px-2 py-4 sm:px-6 sm:py-6"
                    trend={
                        <span
                            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                activityTrend.pctChange >= 0
                                    ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                            }`}
                        >
                            {activityTrend.pctChange >= 0 ? (
                                <TrendingUp className="size-3" />
                            ) : (
                                <TrendingDown className="size-3" />
                            )}
                            {activityTrend.pctChange >= 0 ? '+' : ''}
                            {activityTrend.pctChange}%
                        </span>
                    }
                >
                    {loading ? (
                        <ChartSkeleton height={220} />
                    ) : (
                        <ChartContainer config={areaChartConfig} className="max-h-[240px] min-h-[210px] w-full">
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
                                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis hide domain={[0, 'dataMax + 1']} />
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            labelFormatter={(value) =>
                                                new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                            }
                                            indicator="line"
                                        />
                                    }
                                />
                                {/* <ChartLegend content={<ChartLegendContent />} /> */}
                                <Area
                                    dataKey="upload_count"
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
            <div className="col-span-2 xl:col-span-1">
                <AnalyticsCard
                    title="Document Uploads"
                    description="Uploaded vs outlines with no documents"
                    contentClassName="px-2 py-4 sm:px-6"
                    trend={
                        <span
                            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                completionPct >= 75
                                    ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                                    : completionPct >= 50
                                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                      : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                            }`}
                        >
                            {completionPct}% complete
                        </span>
                    }
                >
                    {loading ? (
                        <ChartSkeleton height={220} />
                    ) : (
                        <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[220px] min-h-[150px]">
                            <PieChart>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="line" />} />
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={50}
                                    outerRadius={100}
                                    strokeWidth={10}
                                    startAngle={180}
                                    endAngle={0}
                                    cy={140}
                                >
                                    {pieData.map((entry, i) => (
                                        <Cell key={`cell-${i}`} fill={entry.fill ?? 'var(--muted)'} />
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
                                        <div className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1">
                                            {pieData.map((entry) => (
                                                <span key={entry.name} className="text-muted-foreground flex items-center gap-1.5 text-xs">
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
            </div>
        </div>
    );
}
