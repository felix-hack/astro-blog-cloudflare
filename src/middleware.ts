import { defineMiddleware } from "astro:middleware";

const PUBLIC_PATHS = ["/login", "/api/login"];

export const onRequest = defineMiddleware(
	async ({ url, cookies, redirect }, next) => {
		if (PUBLIC_PATHS.includes(url.pathname)) {
			return next();
		}

		const password = import.meta.env.PASSWORD;

		if (!password) {
			return next();
		}

		const authToken = cookies.get("auth_token");

		if (authToken?.value === password) {
			return next();
		}

		return redirect(`/login?redirect=${encodeURIComponent(url.pathname)}`);
	},
);
