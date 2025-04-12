import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const allowedOrigins = ["https://www.logikxmind.com"];

const corsOptions = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Origin": "*",
};

const protectedRoutes = ["/dashboard", "/settings", "/profile", "/roadmap"];
const authRoutes = ["/login", "/signup"];
const redirectAfterLogin = "/profile";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const requestUrl = new URL(request.url);

    // CORS Handling
    const origin = request.headers.get("origin") ?? "";
    const isAllowedOrigin = allowedOrigins.includes(origin);

    if (request.method === "OPTIONS") {
        const preflightHeaders = {
            ...(isAllowedOrigin ? { "Access-Control-Allow-Origin": origin } : {}),
            ...corsOptions,
        };
        return new NextResponse(null, { headers: preflightHeaders });
    }

    if (isAllowedOrigin) {
        response.headers.set("Access-Control-Allow-Origin", origin);
    }

    Object.entries(corsOptions).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    // Authentication Handling
    if (requestUrl.pathname === "/not-found") {
        return response;
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name: string) => request.cookies.get(name)?.value,
                set: (name: string, value: string, options: CookieOptions) => {
                    response.cookies.set({ name, value, ...options });
                },
                remove: (name: string, options: CookieOptions) => {
                    response.cookies.set({ name, value: "", ...options });
                },
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();
    const isProtectedRoute = protectedRoutes.some(route => requestUrl.pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => requestUrl.pathname.startsWith(route));

    if (session && requestUrl.pathname === "/auth/callback") {
        return NextResponse.redirect(new URL(redirectAfterLogin, request.url));
    }

    if (!session && isProtectedRoute) {
        if (requestUrl.pathname === "/login") {
            return response;
        }
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("redirectTo", requestUrl.pathname);
        return NextResponse.redirect(redirectUrl);
    }

    if (session) {
        const { data: { user } } = await supabase.auth.getUser();

        if (isAuthRoute && user) {  // Add check if user exists
            // Check if user_metadata exists before accessing it
            const isOnboarded = user.user_metadata?.onboarded;

            if (!isOnboarded && requestUrl.pathname !== "/onboarding") {
                return NextResponse.redirect(new URL("/onboarding", request.url));
            }

            if (isOnboarded && requestUrl.pathname === "/onboarding") {
                return NextResponse.redirect(new URL(redirectAfterLogin, request.url));
            }

            if (requestUrl.pathname === redirectAfterLogin) {
                return response;
            }

            return NextResponse.redirect(new URL(redirectAfterLogin, request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        "/api/:path*",
        "/((?!_next/static|_next/image|favicon.ico|public|_error|not-found).*)",
    ],
};
