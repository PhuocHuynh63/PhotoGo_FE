'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Info, MoreVertical, Loader2 } from 'lucide-react';
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
    onLoadMoreMessages: () => void;
    hasMoreMessages: boolean;
    messagesLoading: boolean;
}

export default function ContentChat({
    activeConversation,
    onSendMessage,
    onLeaveChat,
    toggleSidebar,
    isMobile,
    userId,
    onLoadMoreMessages,
    hasMoreMessages,
    messagesLoading,
}: ContentsChatProps) {
    /**
     * Scroll to bottom when new messages are loaded or conversation changes
     * This effect ensures that the chat scrolls to the bottom when new messages are added
     */
    const scrollAreaViewportRef = useRef<HTMLDivElement | null>(null);
    const previousScrollHeight = useRef(0);
    const previousMessagesLength = useRef(0);
    const isInitialLoadForChat = useRef(true);
    const ignoreNextScrollEvent = useRef(false);
    const userHasScrolledUp = useRef(false);

    useEffect(() => {
        if (!scrollAreaViewportRef.current) return;

        const viewport = scrollAreaViewportRef.current;
        const currentMessagesLength = activeConversation?.messages?.length || 0;
        const oldScrollHeight = previousScrollHeight.current;

        // 1. Trường hợp: Load ban đầu cho chat HOẶC nhận tin nhắn mới từ socket
        // Hoặc user gửi tin nhắn mới (vì handleSendMessage đã cuộn xuống cuối)
        // và không phải đang load tin cũ (tức là messagesLoading là false)
        if (
            (currentMessagesLength > previousMessagesLength.current && !messagesLoading && !userHasScrolledUp.current) ||
            isInitialLoadForChat.current
        ) {
            viewport.scrollTop = viewport.scrollHeight;
            isInitialLoadForChat.current = false; // Reset cờ sau khi cuộn lần đầu
        }
        // 2. Trường hợp: Load thêm tin nhắn cũ (cuộn lên trên)
        // Nếu số lượng tin nhắn tăng lên VÀ đang load (messagesLoading true)
        // VÀ không phải là lần load đầu tiên cho chat này
        else if (currentMessagesLength > previousMessagesLength.current && messagesLoading && !isInitialLoadForChat.current) {
            const newScrollHeight = viewport.scrollHeight;
            const heightDifference = newScrollHeight - oldScrollHeight;

            if (heightDifference > 0) { // Chỉ điều chỉnh nếu chiều cao thực sự tăng
                ignoreNextScrollEvent.current = true; // Bỏ qua sự kiện cuộn tự động sau điều chỉnh
                viewport.scrollTop = viewport.scrollTop + heightDifference;
            }
        }

        // Luôn cập nhật các ref ở cuối effect
        previousScrollHeight.current = viewport.scrollHeight;
        previousMessagesLength.current = currentMessagesLength;
    }, [activeConversation?.messages, activeConversation?.id, messagesLoading, userId]);


    useEffect(() => {
        isInitialLoadForChat.current = true;
        previousScrollHeight.current = 0;
        previousMessagesLength.current = 0;
        ignoreNextScrollEvent.current = false;
        userHasScrolledUp.current = false; // Rất quan trọng: Reset cờ này khi đổi chat
    }, [activeConversation?.id]);

    const handleScroll = () => {
        if (!scrollAreaViewportRef.current) return;

        const viewport = scrollAreaViewportRef.current;
        const { scrollTop, scrollHeight, clientHeight } = viewport;

        if (ignoreNextScrollEvent.current) {
            ignoreNextScrollEvent.current = false;
            return;
        }

        // Cập nhật cờ userHasScrolledUp
        // Nếu người dùng cuộn lên trên 100px từ đáy, thì đang cuộn lên
        // Ngược lại, nếu ở gần đáy, thì không phải cuộn lên (mà có thể đang theo dõi tin nhắn mới)
        userHasScrolledUp.current = (scrollHeight - scrollTop - clientHeight) > 100;


        // Kiểm tra nếu người dùng cuộn lên gần đầu (ví dụ: scrollTop <= 50px)
        // và không đang load và còn tin nhắn để load
        if (scrollTop <= 50 && !messagesLoading && hasMoreMessages) {
            onLoadMoreMessages();
        }
    };
    //---------------------End---------------------//

    /**
     * Handle input value
     */
    const [inputValue, setInputValue] = useState('');

    const handleSendMessage = () => {
        if (!inputValue.trim() || !activeConversation) return;
        onSendMessage(inputValue);
        setInputValue('');
        if (scrollAreaViewportRef.current) {
            scrollAreaViewportRef.current.scrollTop = scrollAreaViewportRef.current.scrollHeight;
        }
    };
    //---------------------End---------------------//

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

                    <ScrollArea className="flex-1 p-4"
                        viewportRef={scrollAreaViewportRef}
                        onScroll={handleScroll}
                    >
                        <div className="space-y-3">
                            {messagesLoading && (
                                <div className="flex justify-center py-2">
                                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                                </div>
                            )}
                            {!hasMoreMessages && (
                                <div className="text-center text-gray-500 text-sm py-2">
                                    Đã tải tất cả tin nhắn.
                                </div>
                            )}
                            {activeConversation?.messages?.map((message: any) => (
                                <div
                                    key={message.senderId + message.timestamp}
                                    className={cn('flex', message.senderId === userId ? 'justify-end' : 'justify-start')}
                                >
                                    {message.senderId !== userId && (
                                        <Avatar className="h-12 w-12 mr-3"
                                            src={activeConversation.user.avatarUrl}
                                            alt={activeConversation.user.fullName}
                                        />
                                    )}
                                    <div
                                        className={cn(
                                            'max-w-[70%] rounded-2xl p-3',
                                            message.senderId === userId
                                                ? 'bg-blue-500 text-white rounded-tr-none'
                                                : 'bg-gray-200 rounded-tl-none'
                                        )}
                                    >
                                        <p>{message.text}</p>
                                        <div className=" makeover flex items-center justify-end mt-1">
                                            <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                                            {message.senderId === userId && (
                                                <span className="ml-1 text-xs">{message.read ? '✓✓' : '✓'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
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