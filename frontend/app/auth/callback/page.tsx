"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/AuthProvider";
import { CodeLoader } from "@/components/ui/CodeLoader";

const AuthCallback = () => {
    const { supabase } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push("/onboarding");
            } else {
                router.push("/login");
            }
        };
        checkSession();
    }, [supabase, router]);

    return <CodeLoader />;
};

export default AuthCallback;
