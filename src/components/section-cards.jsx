import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import data from "@/data/data.json"

function hitungPresentase(jam) {
  const totalJam = 730; // 24 jam * 30 hari atau 1 bulan
  return (jam / totalJam) * 100; // 100% adalah total jam dalam sebulan
}

const statusP = data.filter((item) => item.status === "In Process")
function presentaseInProcess(data) {
  const dataTotal = data.length;;
  const totalPresentase = ((dataTotal - statusP.length) / dataTotal) * 100;
  return totalPresentase;
}

// Buat function di atas sini

export function SectionCards() {
  return (
    <div
      className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

      {/* Total Peminjaman Ruangan */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Peminjaman Ruangan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {JSON.stringify(data.length)} 
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {hitungPresentase(data.length).toFixed(2)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 1 months
          </div>
        </CardFooter>
      </Card>

      {/* Permohonan Peminjaman Ruangan */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Permohonan Peminjaman Ruangan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {JSON.stringify(statusP.length)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              {/* Masukkan logika kamu di sini */}
              {presentaseInProcess(data).toFixed(2)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {presentaseInProcess(data).toFixed(0)}% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Mohon segera direspon
          </div>
        </CardFooter>
      </Card>

      {/* Active Account ??? */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Comming Soon
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +???%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Walawe <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>

      {/* ??? */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>???</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ???
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +???%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            ??? <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Sedang tidak baik baik saja paman</div>
        </CardFooter>
      </Card>
    </div>
  );
}
