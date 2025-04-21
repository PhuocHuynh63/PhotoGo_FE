'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import LoadingPage from "@components/Organisms/Loading";

const GoogleCompletePage = () => {
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const userRaw = params.get("user");

        if (!token || !userRaw) {
            router.push("/auth/login");
            return;
        }

        const user = JSON.parse(decodeURIComponent(userRaw));

        signIn("credentials", {
            redirect: false,
            email: user.email,
            password: "__google__",
            accessToken: token,
        }).then((res) => {
            if (res?.ok) {
                router.push("/");
            } else {
                router.push("/auth/login");
            }
        });
    }, [router]);

    return (
        <LoadingPage />
    )
};

export default GoogleCompletePage;