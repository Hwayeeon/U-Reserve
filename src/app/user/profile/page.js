"use client";

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getCookies } from "@/lib/cookies";

export default function ProfilePage() {
	const [profileImage, setProfileImage] = useState(
		"/placeholder.svg?height=120&width=120",
	);
	const [showPassword, setShowPassword] = useState(false);
	const fileInputRef = useRef(null);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return null; // Prevent rendering on the server
	}

	const user = getCookies("user");

	const handleImageChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result === "string") {
					setProfileImage(reader.result);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<SidebarProvider>
			<div className="flex h-screen w-screen overflow-hidden">
				{/* Sidebar */}
				<AppSidebar />

				{/* Konten Utama */}
				<SidebarInset>
					<div className="flex flex-col items-center justify-center flex-1 bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
						<Card className="w-full max-w-md shadow-lg">
							<CardHeader className="flex flex-col items-center pb-0 pt-6 space-y-0">
								<div className="relative group">
									<Avatar
										className="w-32 h-32 border-4 border-white shadow-md cursor-pointer transition-transform hover:scale-105"
										onClick={() => fileInputRef.current?.click()}
									>
										<AvatarImage
											src={user.avatar || profileImage}
											alt="Profile"
										/>
										<AvatarFallback className="text-2xl">Alien</AvatarFallback>
									</Avatar>
								</div>
								<input
									type="file"
									accept="image/*"
									ref={fileInputRef}
									onChange={handleImageChange}
									className="hidden"
								/>
								<CardTitle className="mt-4 text-xl font-bold">
									Profile
								</CardTitle>
							</CardHeader>
							<CardContent className="p-6">
								<div className="space-y-4">
									<div className="space-y-2">
										<label
											htmlFor="profile-name"
											className="text-sm font-medium"
										>
											Name
										</label>
										<div className="relative">
											<Input
												id="profile-name"
												type="text"
												value={user.username || "ALIEN"}
												readOnly
												className="pr-10 bg-gray-50"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label
											htmlFor="profile-nim"
											className="text-sm font-medium"
										>
											NIM
										</label>
										<div className="relative">
											<Input
												id="profile-nim"
												type="text"
												value={user.user_id || "000000000"}
												readOnly
												className="pr-10 bg-gray-50"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label
											htmlFor="profile-password"
											className="text-sm font-medium"
										>
											Password
										</label>
										<div className="relative">
											<Input
												id="profile-password"
												type={showPassword ? "text" : "password"}
												value="ureserve2025"
												readOnly
												className="pr-10 bg-gray-50"
											/>
											<Button
												variant="ghost"
												size="icon"
												className="absolute right-0 top-0 h-full"
												onClick={togglePasswordVisibility}
											>
												{showPassword ? (
													<EyeOff size={16} className="text-gray-400" />
												) : (
													<Eye size={16} className="text-gray-400" />
												)}
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
