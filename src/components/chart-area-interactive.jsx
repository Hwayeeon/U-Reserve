"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  {
    date: "2024-04-01",
    mobile: "E305",
    mobile: "user"
  },
  {
    date: "2024-04-02",
    desktop: "E306",
    mobile: "lecturer"
  },
  {
    date: "2024-04-03",
    desktop: "4EPW1",
    mobile: "admin"
  },
  {
    date: "2024-04-04",
    desktop: "E305",
    mobile: "user"
  },
  {
    date: "2024-04-05",
    desktop: "E306",
    mobile: "lecturer"
  },
  {
    date: "2024-04-06",
    desktop: "4EPW1",
    mobile: "admin"
  },
  {
    date: "2024-04-07",
    desktop: "E305",
    mobile: "user"
  },
  {
    date: "2024-04-08",
    desktop: "E306",
    mobile: "lecturer"
  },
  {
    date: "2024-04-09",
    desktop: "4EPW1",
    mobile: "admin"
  },
  {
    date: "2024-04-10",
    desktop: "E305",
    mobile: "user"
  },
  {
    date: "2024-04-11",
    desktop: "E306",
    mobile: "lecturer"
  },
  {
    date: "2024-04-12",
    desktop: "4EPW1",
    mobile: "admin"
  },
  {
    date: "2024-04-13",
    desktop: "E305",
    mobile: "user"
  },
  {
    date: "2024-04-14",
    desktop: "E306",
    mobile: "lecturer"
  },
  {
    date: "2024-04-15",
    desktop: "4EPW1",
    mobile: "admin"
  },
  {
    date: "2024-04-16",
    desktop: "E305",
    mobile: "user"
  },
  {
    date: "2024-04-17",
    desktop: "E306",
    mobile: "lecturer"
  },
  {
    date: "2024-04-18",
    desktop: "4EPW1",
    mobile: "admin"
  },
  {
    date: "2024-04-19",
    desktop: "E305",
    mobile: "user"
  },
  {
    date: "2024-04-20",
    desktop: "E306",
    mobile: "lecturer"
  }
]

const chartConfig = {
  visitors: {
    label: "Peminjam Ruangan",
  },

  desktop: {
    label: "Ruangan",
    color: "var(--primary)",
  },

  mobile: {
    label: "Peminjam",
    color: "var(--primary)",
  }
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
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
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex">
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value">
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
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }} />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot" />
              } />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a" />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
