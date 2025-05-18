"use client"

import { useRef, useState, useEffect } from "react"
import { Send, Search, Info, MoreVertical } from "lucide-react"
import Input from "@components/Atoms/Input"
import { ScrollArea } from "@components/Atoms/ui/scroll-area"
import { cn } from "@utils/helpers/CN"
import { Avatar } from "@components/Atoms/ui/avatar"
import { Button } from "@components/Atoms/ui/button"


type User = {
    id: string
    name: string
    avatar: string
    status: "online" | "offline"
    lastSeen?: Date
}

type Message = {
    id: string
    content: string
    sender: string
    timestamp: Date
    read: boolean
}

type Conversation = {
    id: string
    user: User
    messages: Message[]
    unreadCount: number
    lastMessage?: Message
}

// Sample data
const conversations: Conversation[] = [
    {
        id: "1",
        user: {
            id: "u1",
            name: "Nguyễn Văn A",
            avatar: "A",
            status: "online",
        },
        messages: [
            {
                id: "m1",
                content: "Chào bạn, bạn khỏe không?",
                sender: "u1",
                timestamp: new Date(Date.now() - 1000 * 60 * 5),
                read: true,
            },
            {
                id: "m2",
                content: "Mình khỏe, còn bạn thì sao?",
                sender: "me",
                timestamp: new Date(Date.now() - 1000 * 60 * 4),
                read: true,
            },
            {
                id: "m3",
                content: "Mình cũng khỏe. Hôm nay bạn làm gì vậy?",
                sender: "u1",
                timestamp: new Date(Date.now() - 1000 * 60 * 3),
                read: true,
            },
        ],
        unreadCount: 0,
        lastMessage: {
            id: "m3",
            content: "Mình cũng khỏe. Hôm nay bạn làm gì vậy?",
            sender: "u1",
            timestamp: new Date(Date.now() - 1000 * 60 * 3),
            read: true,
        },
    },
    {
        id: "2",
        user: {
            id: "u2",
            name: "Trần Thị B",
            avatar: "B",
            status: "online",
        },
        messages: [
            {
                id: "m4",
                content: "Bạn đã làm xong bài tập chưa?",
                sender: "u2",
                timestamp: new Date(Date.now() - 1000 * 60 * 30),
                read: false,
            },
        ],
        unreadCount: 1,
        lastMessage: {
            id: "m4",
            content: "Bạn đã làm xong bài tập chưa?",
            sender: "u2",
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            read: false,
        },
    },
    {
        id: "3",
        user: {
            id: "u3",
            name: "Lê Văn C",
            avatar: "C",
            status: "offline",
            lastSeen: new Date(Date.now() - 1000 * 60 * 120),
        },
        messages: [
            {
                id: "m5",
                content: "Hẹn gặp lại bạn vào cuối tuần nhé!",
                sender: "me",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
                read: true,
            },
        ],
        unreadCount: 0,
        lastMessage: {
            id: "m5",
            content: "Hẹn gặp lại bạn vào cuối tuần nhé!",
            sender: "me",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            read: true,
        },
    },
    {
        id: "4",
        user: {
            id: "u4",
            name: "Phạm Thị D",
            avatar: "D",
            status: "offline",
            lastSeen: new Date(Date.now() - 1000 * 60 * 45),
        },
        messages: [
            {
                id: "m6",
                content: "Cảm ơn bạn đã giúp đỡ!",
                sender: "u4",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
                read: true,
            },
        ],
        unreadCount: 0,
        lastMessage: {
            id: "m6",
            content: "Cảm ơn bạn đã giúp đỡ!",
            sender: "u4",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
            read: true,
        },
    },
    {
        id: "5",
        user: {
            id: "u5",
            name: "Hoàng Văn E",
            avatar: "E",
            status: "online",
        },
        messages: [
            {
                id: "m7",
                content: "Bạn có rảnh không? Mình cần hỏi một chút.",
                sender: "u5",
                timestamp: new Date(Date.now() - 1000 * 60 * 10),
                read: false,
            },
        ],
        unreadCount: 1,
        lastMessage: {
            id: "m7",
            content: "Bạn có rảnh không? Mình cần hỏi một chút.",
            sender: "u5",
            timestamp: new Date(Date.now() - 1000 * 60 * 10),
            read: false,
        },
    },
]

export function ContentChat() {
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(conversations[0])
    const [inputValue, setInputValue] = useState("")
    const [allConversations, setAllConversations] = useState<Conversation[]>(conversations)
    const [showSidebar, setShowSidebar] = useState(true)
    const [isMobile, setIsMobile] = useState(false)

    // Check if it's mobile view
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        // Initial check
        checkIsMobile()

        // Add event listener
        window.addEventListener('resize', checkIsMobile)

        // Cleanup
        return () => {
            window.removeEventListener('resize', checkIsMobile)
        }
    }, [])

    const handleSendMessage = () => {
        if (!inputValue.trim() || !activeConversation) return

        const newMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            sender: "me",
            timestamp: new Date(),
            read: true,
        }

        const updatedConversations = allConversations.map((conv) => {
            if (conv.id === activeConversation.id) {
                return {
                    ...conv,
                    messages: [...conv.messages, newMessage],
                    lastMessage: newMessage,
                }
            }
            return conv
        })

        setAllConversations(updatedConversations)
        setActiveConversation((prev) => {
            if (!prev) return null
            return {
                ...prev,
                messages: [...prev.messages, newMessage],
                lastMessage: newMessage,
            }
        })
        setInputValue("")
    }

    const formatTime = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()

        // Today - show time only
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }

        // Yesterday
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)
        if (date.toDateString() === yesterday.toDateString()) {
            return `Hôm qua, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        }

        // Within a week
        if (diff < 7 * 24 * 60 * 60 * 1000) {
            const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"]
            return `${days[date.getDay()]}, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        }

        // Older - show full date and time
        return `${date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    }

    const toggleSidebar = () => {
        setShowSidebar((prev) => !prev)
    }

    return (
        <>
            {activeConversation ? (
                <>
                    {/* Chat header */}
                    <div
                        className="flex items-center justify-between p-3 border-b"
                        style={{ backgroundColor: "rgba(246, 172, 105, 0.21)" }}
                    >
                        <div className="flex items-center">
                            {isMobile && (
                                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
                                    <MoreVertical className="h-5 w-5" />
                                </Button>
                            )}
                            <Avatar className="h-10 w-10 mr-3">
                                <div className="bg-orange-300 h-full w-full flex items-center justify-center text-white font-semibold">
                                    {activeConversation.user.avatar}
                                </div>
                            </Avatar>
                            <div>
                                <h2 className="font-semibold">{activeConversation.user.name}</h2>
                                <p className="text-xs text-gray-500">
                                    {activeConversation.user.status === "online"
                                        ? "Đang hoạt động"
                                        : activeConversation.user.lastSeen
                                            ? `Hoạt động ${formatTime(activeConversation.user.lastSeen)}`
                                            : "Không hoạt động"}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                                <Info className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Chat messages */}
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-3">
                            {activeConversation.messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn("flex", message.sender === "me" ? "justify-end" : "justify-start")}
                                >
                                    {message.sender !== "me" && (
                                        <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                                            <div className="bg-orange-300 h-full w-full flex items-center justify-center text-white font-semibold">
                                                {activeConversation.user.avatar}
                                            </div>
                                        </Avatar>
                                    )}
                                    <div
                                        className={cn(
                                            "max-w-[70%] rounded-2xl p-3",
                                            message.sender === "me"
                                                ? "bg-blue-500 text-white rounded-tr-none"
                                                : "bg-gray-200 rounded-tl-none",
                                        )}
                                    >
                                        <p>{message.content}</p>
                                        <div className="flex items-center justify-end mt-1">
                                            <span className="text-xs opacity-70">
                                                {message.timestamp.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                            {message.sender === "me" && <span className="ml-1 text-xs">{message.read ? "✓✓" : "✓"}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    {/* Chat input */}
                    <div className="p-3 border-t flex items-center" style={{ backgroundColor: "rgba(246, 172, 105, 0.21)" }}>
                        <Input
                            value={inputValue}
                            onChange={(e: any) => setInputValue(e.target.value)}
                            placeholder="Aa"
                            className="flex-1 mr-2 rounded-full"
                            onKeyDown={(e: any) => {
                                if (e.key === "Enter") {
                                    handleSendMessage()
                                }
                            }}
                        />
                        <Button
                            onClick={handleSendMessage}
                            size="icon"
                            className="rounded-full"
                            style={{ backgroundColor: "#F6AC69" }}
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
            )}
        </>
    )
}