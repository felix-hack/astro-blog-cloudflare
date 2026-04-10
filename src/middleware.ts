import { defineMiddleware } from "astro:middleware";

const PUBLIC_PATHS = ["/login", "/api/login"];

export const onRequest = defineMiddleware(
	async ({ locals, url, cookies, redirect }, next) => {
		if (PUBLIC_PATHS.includes(url.pathname)) {
			return next();
		}

		const password = locals.runtime.env.PASSWORD;

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
