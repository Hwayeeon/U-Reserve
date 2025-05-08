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

export const chartData = [
  { date: "2025-01-01", pemesan: 101, namaRuangan: 522 },
  { date: "2025-01-02", pemesan: 215, namaRuangan: 321 },
  { date: "2025-01-03", pemesan: 498, namaRuangan: 392 },
  { date: "2025-01-04", pemesan: 306, namaRuangan: 512 },
  { date: "2025-01-05", pemesan: 192, namaRuangan: 195 },
  { date: "2025-01-06", pemesan: 489, namaRuangan: 601 },
  { date: "2025-01-07", pemesan: 158, namaRuangan: 292 },
  { date: "2025-01-08", pemesan: 399, namaRuangan: 123 },
  { date: "2025-01-09", pemesan: 284, namaRuangan: 507 },
  { date: "2025-01-10", pemesan: 216, namaRuangan: 560 },
  { date: "2025-01-11", pemesan: 336, namaRuangan: 215 },
  { date: "2025-01-12", pemesan: 185, namaRuangan: 293 },
  { date: "2025-01-13", pemesan: 428, namaRuangan: 499 },
  { date: "2025-01-14", pemesan: 117, namaRuangan: 224 },
  { date: "2025-01-15", pemesan: 457, namaRuangan: 333 },
  { date: "2025-01-16", pemesan: 201, namaRuangan: 498 },
  { date: "2025-01-17", pemesan: 385, namaRuangan: 531 },
  { date: "2025-01-18", pemesan: 323, namaRuangan: 503 },
  { date: "2025-01-19", pemesan: 130, namaRuangan: 231 },
  { date: "2025-01-20", pemesan: 276, namaRuangan: 330 },
  { date: "2025-01-21", pemesan: 105, namaRuangan: 516 },
  { date: "2025-01-22", pemesan: 491, namaRuangan: 338 },
  { date: "2025-01-23", pemesan: 420, namaRuangan: 230 },
  { date: "2025-01-24", pemesan: 320, namaRuangan: 466 },
  { date: "2025-01-25", pemesan: 483, namaRuangan: 604 },
  { date: "2025-01-26", pemesan: 411, namaRuangan: 110 },
  { date: "2025-01-27", pemesan: 388, namaRuangan: 452 },
  { date: "2025-01-28", pemesan: 223, namaRuangan: 509 },
  { date: "2025-01-29", pemesan: 498, namaRuangan: 227 },
  { date: "2025-01-30", pemesan: 394, namaRuangan: 573 },
  { date: "2025-01-31", pemesan: 145, namaRuangan: 143 },
  { date: "2025-02-01", pemesan: 466, namaRuangan: 615 },
  { date: "2025-02-02", pemesan: 233, namaRuangan: 524 },
  { date: "2025-02-03", pemesan: 296, namaRuangan: 388 },
  { date: "2025-02-04", pemesan: 345, namaRuangan: 271 },
  { date: "2025-02-05", pemesan: 162, namaRuangan: 300 },
  { date: "2025-02-06", pemesan: 176, namaRuangan: 560 },
  { date: "2025-02-07", pemesan: 108, namaRuangan: 491 },
  { date: "2025-02-08", pemesan: 321, namaRuangan: 444 },
  { date: "2025-02-09", pemesan: 212, namaRuangan: 530 },
  { date: "2025-02-10", pemesan: 397, namaRuangan: 552 },
  { date: "2025-02-11", pemesan: 160, namaRuangan: 404 },
  { date: "2025-02-12", pemesan: 298, namaRuangan: 374 },
  { date: "2025-02-13", pemesan: 472, namaRuangan: 599 },
  { date: "2025-02-14", pemesan: 136, namaRuangan: 134 },
  { date: "2025-02-15", pemesan: 213, namaRuangan: 275 },
  { date: "2025-02-16", pemesan: 185, namaRuangan: 417 },
  { date: "2025-02-17", pemesan: 461, namaRuangan: 501 },
  { date: "2025-02-18", pemesan: 418, namaRuangan: 375 },
  { date: "2025-02-19", pemesan: 194, namaRuangan: 262 },
  { date: "2025-02-20", pemesan: 268, namaRuangan: 556 },
  { date: "2025-02-21", pemesan: 179, namaRuangan: 234 },
  { date: "2025-02-22", pemesan: 306, namaRuangan: 598 },
  { date: "2025-02-23", pemesan: 239, namaRuangan: 160 },
  { date: "2025-02-24", pemesan: 101, namaRuangan: 439 },
  { date: "2025-02-25", pemesan: 463, namaRuangan: 462 },
  { date: "2025-02-26", pemesan: 149, namaRuangan: 403 },
  { date: "2025-02-27", pemesan: 386, namaRuangan: 144 },
  { date: "2025-02-28", pemesan: 301, namaRuangan: 550 },
  { date: "2025-02-29", pemesan: 455, namaRuangan: 213 },
  { date: "2025-03-01", pemesan: 256, namaRuangan: 328 },
  { date: "2025-03-02", pemesan: 385, namaRuangan: 490 },
  { date: "2025-03-03", pemesan: 332, namaRuangan: 255 },
  { date: "2025-03-04", pemesan: 493, namaRuangan: 595 },
  { date: "2025-03-05", pemesan: 421, namaRuangan: 482 },
  { date: "2025-03-06", pemesan: 251, namaRuangan: 161 },
  { date: "2025-03-07", pemesan: 298, namaRuangan: 316 },
  { date: "2025-03-08", pemesan: 415, namaRuangan: 512 },
  { date: "2025-03-09", pemesan: 139, namaRuangan: 282 },
  { date: "2025-03-10", pemesan: 380, namaRuangan: 434 },
  { date: "2025-03-11", pemesan: 214, namaRuangan: 259 },
  { date: "2025-03-12", pemesan: 194, namaRuangan: 301 },
  { date: "2025-03-13", pemesan: 126, namaRuangan: 566 },
  { date: "2025-03-14", pemesan: 449, namaRuangan: 174 },
  { date: "2025-03-15", pemesan: 360, namaRuangan: 384 },
  { date: "2025-03-16", pemesan: 353, namaRuangan: 129 },
  { date: "2025-03-17", pemesan: 408, namaRuangan: 420 },
  { date: "2025-03-18", pemesan: 478, namaRuangan: 598 },
  { date: "2025-03-19", pemesan: 263, namaRuangan: 171 },
  { date: "2025-03-20", pemesan: 122, namaRuangan: 248 },
  { date: "2025-03-21", pemesan: 380, namaRuangan: 456 },
  { date: "2025-03-22", pemesan: 495, namaRuangan: 362 },
  { date: "2025-03-23", pemesan: 245, namaRuangan: 172 },
  { date: "2025-03-24", pemesan: 438, namaRuangan: 359 },
  { date: "2025-03-25", pemesan: 273, namaRuangan: 516 },
  { date: "2025-03-26", pemesan: 432, namaRuangan: 286 },
  { date: "2025-03-27", pemesan: 318, namaRuangan: 231 },
  { date: "2025-03-28", pemesan: 157, namaRuangan: 610 },
  { date: "2025-03-29", pemesan: 229, namaRuangan: 425 },
  { date: "2025-03-30", pemesan: 101, namaRuangan: 363 },
  { date: "2025-03-31", pemesan: 256, namaRuangan: 515 },
  { date: "2025-04-01", pemesan: 339, namaRuangan: 216 },
  { date: "2025-04-02", pemesan: 414, namaRuangan: 153 },
  { date: "2025-04-03", pemesan: 320, namaRuangan: 343 },
  { date: "2025-04-04", pemesan: 284, namaRuangan: 596 },
  { date: "2025-04-05", pemesan: 136, namaRuangan: 170 },
  { date: "2025-04-06", pemesan: 492, namaRuangan: 414 },
  { date: "2025-04-07", pemesan: 390, namaRuangan: 183 },
  { date: "2025-04-08", pemesan: 225, namaRuangan: 331 },
  { date: "2025-04-09", pemesan: 181, namaRuangan: 219 },
  { date: "2025-04-10", pemesan: 310, namaRuangan: 477 },
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

  const timeRangeText = timeRange === "90d" ? "3 Bulan" : timeRange === "30d" ? "30 Hari" : "7 Hari"

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date(Date.now())
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
            Total pemesanan untuk {timeRangeText} terakhir
          </span>
          <span className="@[540px]/card:hidden">
            {timeRangeText} terakhir
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