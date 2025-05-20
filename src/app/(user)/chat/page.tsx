import { authOptions } from "@lib/authOptions";
import ChatPage from "@pages/Member/Chat";
import { getServerSession } from "next-auth";

export default async function Chat() {

    const session = await getServerSession(authOptions) as METADATA.ISession;
    console.log('session', session);


    return (
        <>
            <ChatPage session={session} />
        </>
    );
}