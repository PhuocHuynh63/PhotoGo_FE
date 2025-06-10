'use client';

import { useChat } from '@utils/hooks/useChatSocket';
import { PAGES } from '../../../types/IPages';
import SidebarChat from './Left/Sidebar';
import ContentChat from './Right/Content';

export default function ChatPage(session: PAGES.IChatProps) {
    const userId = session.session?.user?.id;
    const token = session.session?.accessToken;

    const {
        isMobile,
        conversations,
        activeConversation,
        showSidebar,
        handleSelectConversation,
        handleSendMessage,
        handleLeaveChat,
        toggleSidebar,
    } = useChat(userId, token);

    return (
        <div className="flex w-full h-screen">
            <SidebarChat
                conversations={conversations}
                activeConversation={activeConversation}
                onSelectConversation={handleSelectConversation}
                showSidebar={showSidebar}
                isMobile={isMobile}
            />
            <div className="flex-1 flex flex-col h-full">
                <ContentChat
                    activeConversation={activeConversation}
                    onSendMessage={handleSendMessage}
                    onLeaveChat={handleLeaveChat}
                    toggleSidebar={toggleSidebar}
                    isMobile={isMobile}
                    userId={userId}
                />
            </div>
        </div>
    );
}
