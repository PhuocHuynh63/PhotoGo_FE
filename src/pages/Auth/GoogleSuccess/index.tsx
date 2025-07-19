'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import LoadingPage from "@components/Organisms/Loading";
import { ROUTES } from "@routes";
import { ROLE } from "@constants/common";
import { METADATA } from "../../../types/IMetadata";

const GoogleCompletePage = () => {
    const router = useRouter();

    useEffect(() => {
        const handleGoogleAuth = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");
            const userRaw = params.get("user");

            if (!token || !userRaw) {
                router.push(ROUTES.AUTH.LOGIN);
                return;
            }

            const user = JSON.parse(decodeURIComponent(userRaw));

            const res = await signIn("credentials", {
                redirect: false,
                email: user.email,
                password: "__google__",
                accessToken: token,
            });

            console.log("Google sign-in response:", res);

            //#region Handle response
            const status = res?.status;

            //#region Handle success
            if (status === 200) {
                const session = await getSession() as unknown as METADATA.ISession;
                console.log("Session after Google sign-in:", session);
                console.log("User role:", session?.user?.role?.name);


                switch (session?.user?.role?.name) {
                    case ROLE.CUSTOMER:
                        router.push(ROUTES.PUBLIC.HOME);
                        break;
                    case ROLE.ADMIN:
                        router.push(ROUTES.ADMIN.DASHBOARD);
                        break;
                    case ROLE.STAFF:
                        router.push(ROUTES.STAFF.DASHBOARD);
                        break;
                    case ROLE.VENDOR_OWNER:
                        router.push(ROUTES.VENDOR.PROFILE);
                        break;
                    default:
                        break;
                }
                router.refresh();
                return;
            }
            //#endregion
        };

        handleGoogleAuth();
    }, [router]);

    return (
        <LoadingPage />
    )
};

export default GoogleCompletePage;