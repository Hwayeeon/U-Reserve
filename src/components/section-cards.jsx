import { IconTrendingUp } from "@tabler/icons-react"

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
  const totalJam = 720;
  return (jam / totalJam) * 100;
}

const statusPending = data.filter((item) => item.status === "Pending");

function presentaseInProcess(data) {
  const dataTotal = data.length;
  return ( statusPending.length / dataTotal) * 100;
}

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
            {JSON.stringify(statusPending.length)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {presentaseInProcess(data).toFixed(2)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {presentaseInProcess(data).toFixed(0)}% this period
          </div>
          <div className="text-muted-foreground">
            Mohon segera direspon
          </div>
        </CardFooter>
      </Card>

      {/* Total Peminjaman Disetujui */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Peminjaman Disetujui</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {JSON.stringify(data.filter((item) => item.status === "Approved").length)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {((data.filter((item) => item.status === "Approved").length / data.length) * 100).toFixed(2)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Persetujuan bulan ini <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Dari total permohonan yang masuk
          </div>
        </CardFooter>
      </Card>

      {/* Utilisasi Ruangan */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Utilisasi Ruangan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {JSON.stringify(
              data
                .filter((item) => item.status === "Approved")
                .reduce((acc, item) => acc + item.jam, 0)
            )} Jam
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {hitungPresentase(
                data
                  .filter((item) => item.status === "Approved")
                  .reduce((acc, item) => acc + item.jam, 0)
              ).toFixed(2)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Kapasitas terpakai <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Dari total 720 jam tersedia
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
