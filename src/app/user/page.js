"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ComingSoon } from "@/components/coming-soon";
import { FloorMap } from "@/components/floor-map";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import floorPath from "@/data/path.json";

const tab = [
	{ tab: "Kampus 1", href: "#Kampus1" },
	{ tab: "Kampus 2", href: "#Kampus2" },
];

// Jadi ini function TImeDisplay untuk menampilkan waktu sesuai timezone dan locale yang diinginkan dan disini gw pake timezone Asia/Jakarta dan locale en-ID
// dan gw pake useEffect untuk update waktu setiap detik kalo mau ubah intervalnya tinggal ganti di setInterval(updateTime, 1000) ke angka yang diinginkan
// dan gw juga pake useState untuk menyimpan waktu yang ditampilkan
// kalo mau ubah formatnya tinggal ganti di options ke format yang diinginkan
// dan kalo mau ubah timezone dan locale tinggal ganti di propsnya
// Masih gak paham? Singkatnya dan gampangnya ini adalah function untuk menampilkan waktu sesuai timezone dan locale yang diinginkan dan di update setiap detik

const TimeDisplay = ({ timeZone, locale = "en-GB" }) => {
	const [currentTime, setCurrentTime] = useState("");

	useEffect(() => {
		const updateTime = () => {
			const now = new Date();
			const options = {
				timeZone,
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: false,
			};
			const timeString = new Intl.DateTimeFormat(locale, options).format(now);
			setCurrentTime(timeString);
		};

		updateTime();
		const intervalId = setInterval(updateTime, 1000);

		return () => clearInterval(intervalId);
	}, [timeZone, locale]);

	return <span>{currentTime}</span>;
};

export default function Page() {
	const [activeTab, setActiveTab] = useState("Kampus 1");
	const [floorIndex, setFloorIndex] = useState(0);

	const floors = {
		"Kampus 1": Object.keys(floorPath["Kampus 1"] || {}),
		"Kampus 2": Object.keys(floorPath["Kampus 2"] || {}),
	};

	const currentFloorKey = floors[activeTab][floorIndex];
	const currentFloor = floorPath[activeTab][currentFloorKey];

	function changeItems(e) {
		setActiveTab(e.target.id);
		setFloorIndex(0);
	}

	function goPrevFloor() {
		setFloorIndex((prev) =>
			prev > 0 ? prev - 1 : floors[activeTab].length - 1,
		);
	}

	function goNextFloor() {
		setFloorIndex((prev) =>
			prev < floors[activeTab].length - 1 ? prev + 1 : 0,
		);
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 ...">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">U-Reserve</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Reserve Room</BreadcrumbPage>
								</BreadcrumbItem>
								<span className="text-sm text-black ml-2 fixed right-4">
									<TimeDisplay timeZone="Asia/Jakarta" locale="en-ID" />
								</span>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>

				{/* Tabs */}
				<div className="flex flex-row gap-4 p-4 pt-0">
					{tab.map((item) => (
						<a
							onClick={changeItems}
							id={item.tab}
							key={item.tab}
							href={item.href}
							className={`flex-1 flex items-center justify-center text-sm font-semibold text-gray-900 px-2 py-2 rounded-md transition-all
                ${activeTab === item.tab ? "bg-gray-200 shadow-md" : "hover:bg-gray-100"}
                h-10 select-none`}
							style={{ minWidth: 0 }}
						>
							{item.tab}
						</a>
					))}
				</div>

				{/* Show ComingSoon if no floors, otherwise show the floor & rooms */}
				{floors[activeTab].length === 0 ? (
					<div className="flex-1 flex items-center justify-center p-4">
						<ComingSoon />
					</div>
				) : (
					<div
						id="content"
						className="flex-1 flex flex-col items-center gap-4 p-4 pt-0 min-h-min overflow-auto"
					>
						<div className="flex w-full max-w-6xl items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								onClick={goPrevFloor}
								aria-label="Previous floor"
							>
								<ChevronLeft />
							</Button>
							<div className="flex flex-1 gap-1 overflow-x-auto rounded-lg bg-muted p-1">
								{floors[activeTab].map((floorKey, index) => (
									<button
										key={floorKey}
										type="button"
										onClick={() => setFloorIndex(index)}
										aria-current={index === floorIndex ? "true" : undefined}
										className={`flex-1 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
											index === floorIndex
												? "bg-background text-foreground shadow-sm"
												: "text-muted-foreground hover:text-foreground"
										}`}
									>
										{floorKey.replace(/^Floor\s*/i, "Floor ")}
									</button>
								))}
							</div>
							<Button
								variant="outline"
								size="icon"
								onClick={goNextFloor}
								aria-label="Next floor"
							>
								<ChevronRight />
							</Button>
						</div>
						<FloorMap
							className="w-full max-w-6xl"
							floorObject={{
								floorName: currentFloorKey,
								floorImage: currentFloor,
							}}
						/>
					</div>
				)}
			</SidebarInset>
		</SidebarProvider>
	);
}
