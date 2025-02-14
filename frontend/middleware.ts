import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/settings"];
const authRoutes = ["/login", "/signup"];
const redirectAfterLogin = "/dashboard";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const requestUrl = new URL(request.url);

    // Explicitly exclude the "not-found" page
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

    // Redirect unauthenticated users to login
    if (!session && isProtectedRoute) {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("redirectTo", requestUrl.pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from auth routes, but only on first login
    if (session && isAuthRoute) {
        const redirectTo = requestUrl.searchParams.get("redirectTo") || redirectAfterLogin;
        return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public|_error|not-found).*)",
    ],
};
