
import { authOptions } from "@lib/authOptions";
import ChatIndexPage from "@pages/Member/Chat/Right/ChatIndexPage";
import { ROUTES } from "@routes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { METADATA } from "../../../types/IMetadata";

export default async function ChatNoChatId() {

    const session = await getServerSession(authOptions) as METADATA.ISession;
    if (!session) {
        redirect(ROUTES.AUTH.LOGIN);
    }

    return (
        <>
            <ChatIndexPage session={session} />
        </>
    );
}