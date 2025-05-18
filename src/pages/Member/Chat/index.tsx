"use client"

import { useState, useEffect } from "react"
import { SidebarChat } from "./Left/Sidebar"
import { ContentChat } from "./Right/Content"


type Message = {
    id: string
    content: string
    sender: string
    timestamp: Date
    read: boolean
}


export function ChatPage() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkIsMobile()

        window.addEventListener('resize', checkIsMobile)

        return () => {
            window.removeEventListener('resize', checkIsMobile)
        }
    }, [])

    return (
        <div className="flex w-full h-screen">
            {/* Sidebar with conversations */}
            <SidebarChat />

            {/* Main chat area */}
            <div className="flex-1 flex flex-col h-full">
                <ContentChat />
            </div>
        </div>
    )
}