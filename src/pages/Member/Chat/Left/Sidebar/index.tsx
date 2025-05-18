"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import Input from "@components/Atoms/Input"
import { ScrollArea } from "@components/Atoms/ui/scroll-area"
import { cn } from "@utils/helpers/CN"
import { Avatar } from "@components/Atoms/ui/avatar"


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

export function SidebarChat(
    { }
) {
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(conversations[0])
    const [searchValue, setSearchValue] = useState("")
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

    const filteredConversations = allConversations.filter((conv) =>
        conv.user.name.toLowerCase().includes(searchValue.toLowerCase()),
    )

    const handleSelectConversation = (conversation: Conversation) => {
        // Mark messages as read
        const updatedConversations = allConversations.map((conv) => {
            if (conv.id === conversation.id) {
                const updatedMessages = conv.messages.map((msg) => ({
                    ...msg,
                    read: true,
                }))
                return {
                    ...conv,
                    messages: updatedMessages,
                    unreadCount: 0,
                }
            }
            return conv
        })

        setAllConversations(updatedConversations)
        setActiveConversation(conversation)

        if (isMobile) {
            setShowSidebar(false)
        }
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

    return (
        <>
            {/* Sidebar with conversations */}
            {(showSidebar || !isMobile) && (
                <div className={`${isMobile ? "absolute z-10 w-full md:w-80" : "w-80"} h-full border-r bg-white flex flex-col`}>
                    <div className="p-4 border-b" style={{ backgroundColor: "rgba(246, 172, 105, 0.21)" }}>
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
                        {filteredConversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                className={cn(
                                    "flex items-center p-3 cursor-pointer hover:bg-gray-100",
                                    activeConversation?.id === conversation.id && "bg-gray-100",
                                )}
                                onClick={() => handleSelectConversation(conversation)}
                            >
                                <div className="relative">
                                    <Avatar className="h-12 w-12 mr-3">
                                        <div className="bg-orange-300 h-full w-full flex items-center justify-center text-white font-semibold">
                                            {conversation.user.avatar}
                                        </div>
                                    </Avatar>
                                    {conversation.user.status === "online" && (
                                        <span className="absolute bottom-0 right-3 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold truncate">{conversation.user.name}</h3>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p
                                            className={cn(
                                                "text-sm truncat line-clamp-1 w-52",
                                                conversation.unreadCount > 0 ? "font-semibold text-black" : "text-gray-500",
                                            )}
                                        >
                                            {conversation.lastMessage?.sender === "me" ? "Bạn: " : ""}
                                            {conversation.lastMessage?.content}
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
    )
}