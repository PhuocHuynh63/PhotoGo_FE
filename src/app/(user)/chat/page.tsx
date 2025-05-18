import { authOptions } from "@lib/authOptions";
import ChatPage from "@pages/Member/Chat";
import { getServerSession } from "next-auth";

export default async function Chat() {    

    return (
        <>
            <ChatPage />
        </>
    );
}