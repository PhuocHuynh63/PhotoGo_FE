'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Info, MoreVertical } from 'lucide-react';
import Input from '@components/Atoms/Input';
import { ScrollArea } from '@components/Atoms/ui/scroll-area';
import { cn } from '@utils/helpers/CN';
import { Button } from '@components/Atoms/ui/button';
import { Avatar } from '@components/Molecules/Avatar';

interface ContentsChatProps {
    activeConversation: any | null;
    onSendMessage: (content: string) => void;
    onLeaveChat: () => void;
    toggleSidebar: () => void;
    isMobile: boolean;
    userId?: string;
}

export default function ContentChat({
    activeConversation,
    onSendMessage,
    onLeaveChat,
    toggleSidebar,
    isMobile,
    userId,
}: ContentsChatProps) {
    /**
     * Handle input value
     */
    const [inputValue, setInputValue] = useState('');

    const handleSendMessage = () => {
        if (!inputValue.trim() || !activeConversation) return;
        onSendMessage(inputValue);
        setInputValue('');
    };
    //---------------------End---------------------//

    console.log('Active Conversation:', activeConversation);

    /**
     * Format time
     * @param date 
     * @returns 
     */
    const formatTime = (date: string) => {
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
     * Scroll to bottom
     */
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeConversation?.messages]);
    //---------------------End---------------------//

    return (
        <>
            {activeConversation ? (
                <>
                    <div
                        className="flex items-center justify-between p-3 border-b"
                        style={{ backgroundColor: 'rgba(246, 172, 105, 0.21)' }}
                    >
                        <div className="flex items-center">
                            {isMobile && (
                                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
                                    <MoreVertical className="h-5 w-5" />
                                </Button>
                            )}
                            <Avatar className="h-12 w-12 mr-3"
                                src={activeConversation.user.avatarUrl}
                                alt={activeConversation.user.fullName}
                            />
                            <div>
                                <h2 className="font-semibold">{activeConversation.user.fullName}</h2>
                                <p className="text-xs text-gray-500">
                                    {activeConversation.user.status === 'online'
                                        ? 'Đang hoạt động'
                                        : activeConversation.user.lastSeen
                                            ? `Hoạt động ${formatTime(activeConversation.user.lastSeen)}`
                                            : 'Không hoạt động'}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={onLeaveChat}>
                                <Info className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-3">
                            {activeConversation?.messages?.map((message: any) => (
                                <div
                                    key={message.sender_id + message.timestamp}
                                    className={cn('flex', message.sender_id === userId ? 'justify-end' : 'justify-start')}
                                >
                                    {message.sender_id !== userId && (
                                        <Avatar className="h-12 w-12 mr-3"
                                            src={activeConversation.user.avatarUrl}
                                            alt={activeConversation.user.fullName}
                                        />
                                    )}
                                    <div
                                        className={cn(
                                            'max-w-[70%] rounded-2xl p-3',
                                            message.sender_id === userId
                                                ? 'bg-blue-500 text-white rounded-tr-none'
                                                : 'bg-gray-200 rounded-tl-none'
                                        )}
                                    >
                                        <p>{message.text}</p>
                                        <div className=" makeover flex items-center justify-end mt-1">
                                            <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                                            {message.sender_id === userId && (
                                                <span className="ml-1 text-xs">{message.read ? '✓✓' : '✓'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    <div
                        className="p-3 border-t flex items-center"
                        style={{ backgroundColor: 'rgba(246, 172, 105, 0.21)' }}
                    >
                        <Input
                            value={inputValue}
                            onChange={(e: any) => setInputValue(e.target.value)}
                            placeholder="Aa"
                            className="flex-1 mr-2 rounded-full"
                            onKeyDown={(e: any) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                        <Button
                            onClick={handleSendMessage}
                            size="icon"
                            className="rounded-full cursor-pointer bg-primary"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">Chọn một cuộc trò chuyện</h2>
                        <p className="text-gray-500">Chọn một người bạn từ danh sách để bắt đầu trò chuyện</p>
                    </div>
                </div>
            )
            }
        </>
    );
}