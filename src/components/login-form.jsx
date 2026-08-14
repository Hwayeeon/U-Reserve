"use client";
import Link from "next/link";
import { useState } from "react";
import { login } from "@/app/login/action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function LoginForm({ className, ...props }) {
	const [failedAttempts, setFailedAttempts] = useState(0);
	const [isLocked, setIsLocked] = useState(false);
	const [resetTimeout, setResetTimeout] = useState(null);
	const MAX_FAILED_ATTEMPTS = 3;

	async function handleSubmit(event) {
		event.preventDefault();

		if (isLocked) return; // Prevent further attempts if locked

		const formData = new FormData(event.currentTarget);
		const NIM = formData.get("NIM");
		const password = formData.get("password");

		const response = await login({ user_id: NIM, password_hash: password });

		if (response.status === 401) {
			handleFailedAttempt();
			return;
		} else if (response.status === 500) {
			console.log("There was an error on the server");
			console.error("Server error");
			handleFailedAttempt();
			return;
		}

		function handleFailedAttempt() {
			setFailedAttempts((prev) => {
				const newCount = prev + 1;
				if (newCount >= MAX_FAILED_ATTEMPTS) {
					setIsLocked(true);
				}
				return newCount;
			});

			// Clear any existing timeout and set a new one to reset the counter
			if (resetTimeout) {
				clearTimeout(resetTimeout);
			}
			setResetTimeout(
				setTimeout(() => {
					setFailedAttempts(0);
					setIsLocked(false);
				}, 10 * 1000),
			); // 10 seconds lockout for demonstration purposes

			document.getElementById("error").classList.remove("hidden");
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
								<Label htmlFor="NIM">NIM</Label>
								<Input
									name="NIM"
									id="NIM"
									type="string"
									placeholder="XXXXXXXXX"
									required
								/>
							</div>
							<div className="grid gap-3">
								<div className="flex items-center">
									<Label htmlFor="password">Password</Label>
									<Link
										href="#"
										className="ml-auto text-sm underline-offset-2 hover:underline"
									>
										Forgot your password?
									</Link>
								</div>
								<Input name="password" id="password" type="password" required />
							</div>
							<Button type="submit" className="w-full" disabled={isLocked}>
								{isLocked ? "Locked" : "Login"}
							</Button>
							<div id="error" className="text-red-500 text-sm hidden">
								{isLocked
									? "Too many failed attempts. Please try again later."
									: "Invalid NIM or password. Please try again."}
							</div>
						</div>
					</form>
					<div className="bg-muted relative hidden md:block">
						<img
							src="favicon.ico"
							alt="Image"
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
						/>
					</div>
				</CardContent>
			</Card>
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				By clicking continue, you agree to our{" "}
				<Link href="/dashboard">Terms of Service</Link> and{" "}
				<Link href="#">Privacy Policy</Link>.
			</div>
		</div>
	);
}
