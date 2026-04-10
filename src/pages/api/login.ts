import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals, redirect, cookies }) => {
	const formData = await request.formData();
	const password = formData.get("password") as string;
	const envPassword = locals.runtime.env.PASSWORD;
	const redirectTo = (formData.get("redirect") as string | null) ?? "/";
	const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/";

	if (!envPassword) {
		return redirect(safeRedirect);
	}

	if (password === envPassword) {
		const isSecure = new URL(request.url).protocol === "https:";
		cookies.set("auth_token", envPassword, {
			path: "/",
			httpOnly: true,
			secure: isSecure,
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7,
		});
		return redirect(safeRedirect);
	}

	return redirect("/login?error=1");
};
