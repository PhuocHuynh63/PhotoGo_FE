import { authOptions } from "@lib/authOptions";
import ChatPage from "@pages/Member/Chat";
import { ROUTES } from "@routes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Chat() {

    const session = await getServerSession(authOptions) as METADATA.ISession;
    if (!session) {
        redirect(ROUTES.AUTH.LOGIN);
    }

    return (
        <>
            <ChatPage session={session} />
        </>
    );
}