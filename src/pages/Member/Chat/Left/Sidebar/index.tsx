'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import Input from '@components/Atoms/Input';
import { ScrollArea } from '@components/Atoms/ui/scroll-area';
import { cn } from '@utils/helpers/CN';
import { Avatar } from '@components/Molecules/Avatar';


interface SidebarChatProps {
    listChatOfUser: any[];
    activeConversation: string;
    onSelectActiveConversation: (conversationId: string) => void;
    onSelectConversation: (conversation: any) => void;
    showSidebar: boolean;
    isMobile: boolean;
}

export default function SidebarChat({
    listChatOfUser,
    activeConversation,
    onSelectActiveConversation,
    onSelectConversation,
    showSidebar,
    isMobile,
}: SidebarChatProps) {

    const [searchValue, setSearchValue] = useState('');

    const filteredConversations = listChatOfUser?.filter((conv) =>
        conv.user.fullName.toLowerCase().includes(searchValue.toLowerCase())
    );

    /**
     * Format time
     * @param date 
     * @returns 
     */
    const formatTime = (date: string | undefined) => {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();

        if (d.toDateString() === now.toDateString()) {
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) {
            return `Hôm qua, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        if (diff < 7 * 24 * 60 * 60 * 1000) {
            const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
            return `${days[d.getDay()]}, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        return `${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };
    //---------------------End---------------------//

    /**
     * Handle select conversation
     * @param conversation 
     */
    const handleSelectConversation = (conversation: any) => {
        onSelectActiveConversation(conversation.id);
        onSelectConversation(conversation);
    };
    //---------------------End---------------------//
    console.log('Filtered Conversations:', filteredConversations);


    return (
        <>
            {(showSidebar || !isMobile) && (
                <div className={`${isMobile ? 'absolute z-10 w-full md:w-80' : 'w-80'} h-full border-r bg-white flex flex-col`}>
                    <div className="p-4 border-b" style={{ backgroundColor: 'rgba(246, 172, 105, 0.21)' }}>
                        <h2 className="font-bold text-xl mb-2">Trò chuyện</h2>
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Tìm kiếm"
                                className="pl-8"
                                value={searchValue}
                                onChange={(e: any) => setSearchValue(e.target.value)}
                            />
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        {filteredConversations?.map((conversation) => (
                            <div
                                key={conversation.id}
                                className={cn(
                                    'flex items-center p-3 cursor-pointer hover:bg-gray-100',
                                    activeConversation === conversation.id && 'bg-gray-100'
                                )}
                                onClick={() => handleSelectConversation(conversation)}
                            >
                                <div className="relative">
                                    <Avatar className="h-12 w-12 mr-3"
                                        src={conversation.user.avatarUrl}
                                        alt={conversation.user.fullName}
                                    />
                                    {conversation.user.status === 'online' && (
                                        <span className="absolute bottom-0 right-3 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold truncate">{conversation.user.fullName}</h3>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p
                                            className={cn(
                                                'text-sm truncate line-clamp-1 w-52',
                                                conversation.unreadCount > 0 ? 'font-semibold text-black' : 'text-gray-500'
                                            )}
                                        >
                                            {/* {conversation.lastMessage?.sender_id === userId ? 'Bạn: ' : ''} */}
                                            {conversation.lastMessageText}
                                        </p>
                                        {conversation.unreadCount > 0 && (
                                            <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
                                                {conversation.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            )}
        </>
    );
}