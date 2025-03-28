'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";
import { useRouter } from 'next/navigation'
import studentData from '../data/dummy.json'
import adminData from '../data/dummy2.json'

// Buat yang gak paham ini apa? Ini adalah komponen form login yang akan menampilkan form login kepada pengguna.
// Jadi, ketika pengguna membuka aplikasi, pengguna akan melihat form login ini.
// Form login ini akan meminta pengguna untuk memasukkan NIM dan password untuk masuk ke aplikasi.
// Form login ini juga akan menampilkan pesan error jika NIM atau password yang dimasukkan salah.

export function LoginForm({
  className,
  ...props
}) {
  const router = useRouter()

  async function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
    const d = new Date();
    d.setTime(d.getTime() + (60*60*1000));
    let expireTime = d.toUTCString();
    if (email in studentData || email in adminData) {
      if (studentData[email]?.password === password) {
        document.cookie = `role=student; path=/; expires=${expireTime};`;
        router.push('/user')
      } else if (adminData[email]?.password === password) {
        document.cookie = `role=admin; path=/; expires=${expireTime};`;
        router.push('/admin')
      } else {
        // Password does not match
        document.getElementById('error').classList.remove('hidden')
      }
    } else {
      document.getElementById('error').classList.remove('hidden')
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your U-Reserve Account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">NIM</Label>
                <Input name="email" id="email" type="string" placeholder="XXXXXXXXX" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input name="password" id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div id="error" className="text-red-500 text-sm hidden">
                Invalid NIM or password. Please try again.
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://media.tenor.com/aSkdq3IU0g0AAAAM/laughing-cat.gif"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
      <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link href="/dashboard">Terms of Service</Link>{" "}
        and <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}
