"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encrypt } from "@/lib/crypt";
import { createClient } from "@/utils/supabase/server";

export async function login(credentials) {
	const supabase = await createClient();

	const { data: user, error } = await supabase
		.from("users")
		.select("email")
		.eq("user_id", credentials["user_id"])
		.single();

	if (error) {
		// user_id not found in database
		return { status: 401 };
	}

	const cookieStore = await cookies();
	const { data: userData, error: userError } =
		await supabase.auth.signInWithPassword({
			email: user.email,
			password: credentials["password_hash"],
		});

	if (userError) {
		return { status: 401 };
	}

	// Update user online status
	await supabase
		.from("users")
		.update({ is_online: true, last_seen: new Date().toISOString() })
		.eq("user_id", credentials["user_id"]);

	const encryptedData = encrypt(JSON.stringify(userData.user.user_metadata));
	cookieStore.set("user", encryptedData, { maxAge: 60 * 60, path: "/" });
	if (userData.user.user_metadata.role === "admin") {
		redirect("/admin");
	} else if (userData.user.user_metadata.role === "student") {
		redirect("/user");
	} else {
		return { status: 401 };
	}
}
