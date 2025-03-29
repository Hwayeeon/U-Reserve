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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
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

const chartData = [
  { date: "2024-04-01", pemesan: 222, namaRuangan: 150 },
  { date: "2024-04-02", pemesan: 97, namaRuangan: 180 },
  { date: "2024-04-03", pemesan: 167, namaRuangan: 120 },
  { date: "2024-06-30", pemesan: 446, namaRuangan: 400 },
]

const chartConfig = {
  pemesananRuangan: {
    label: "Pemesanan Ruangan",
  },
  pemesan: {
    label: "Pemesan",
    color: "var(--primary)",
  },
  namaRuangan: {
    label: "Nama Ruangan",
    color: "var(--primary)",
  },
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
        <CardTitle>Pemesanan Ruangan</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total pemesanan untuk {timeRange === "90d" ? "3" : timeRange === "30d" ? "30" : "7"} hari terakhir
          </span>
          <span className="@[540px]/card:hidden">
            {timeRange === "90d" ? "3 bulan terakhir" : timeRange === "30d" ? "30 hari terakhir" : "7 hari terakhir"}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
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
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPemesan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-pemesan)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-pemesan)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillNamaRuangan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-namaRuangan)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-namaRuangan)" stopOpacity={0.1} />
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
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="namaRuangan"
              type="natural"
              fill="url(#fillNamaRuangan)"
              stroke="var(--color-namaRuangan)"
              stackId="a"
            />
            <Area
              dataKey="pemesan"
              type="natural"
              fill="url(#fillPemesan)"
              stroke="var(--color-pemesan)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}