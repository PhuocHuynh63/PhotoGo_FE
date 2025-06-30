'use client';

import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';
import ChatHeader from '@components/Atoms/ChatBotHeader';
import ChatMessages from '@components/Atoms/ChatMessage';
import ChatInput from '@components/Atoms/ChatInput';
import ChatToggle from '@components/Atoms/ChatBotToogle';

const botResponses = [
    "Cảm ơn bạn đã liên hệ! Làm thế nào tôi có thể hỗ trợ bạn?",
    "Đó là một câu hỏi thú vị! Tôi sẽ cố gắng giúp bạn.",
    "Tôi hiểu rồi. Bạn có thể cho tôi biết thêm chi tiết không?",
    "Tuyệt vời! Tôi có thể giúp bạn với điều đó.",
    "Đó là một ý tưởng hay! Hãy cùng thảo luận thêm.",
    "Tôi đang xử lý yêu cầu của bạn. Vui lòng đợi một chút...",
    "Rất vui được trò chuyện với bạn! 😊"
];

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Xin chào! Tôi là AI Assistant. Tôi có thể giúp gì cho bạn hôm nay? 🤖", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (isOpen && chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleToggleChat = () => setIsOpen(prev => !prev);

    const handleFileChange = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    }

    const handleSendMessage = () => {
        const text = inputValue.trim();
        if (!text && !selectedFile) return;

        const newMessage = {
            id: Date.now(),
            sender: 'user',
            text: text,
            imageUrl: selectedFile ? URL.createObjectURL(selectedFile) : null
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setSelectedFile(null);

        // Simulate bot response
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const botResponse = {
                id: Date.now() + 1,
                sender: 'bot',
                text: botResponses[Math.floor(Math.random() * botResponses.length)]
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1500 + Math.random() * 1000);
    };

    return (
        <div ref={chatContainerRef} className={clsx(
            // Mobile (mặc định): Container là một dải nằm ngang ở dưới, cách lề 2 bên
            'fixed z-[1000] bottom-0 left-5 right-5',
            // Căn chỉnh các phần tử con (nút, cửa sổ) về phía bên phải của container
            'flex flex-col items-end',
            // Desktop (md và lớn hơn): Thu lại thành một box nhỏ ở góc phải dưới
            'md:bottom-5 md:left-auto md:w-auto'
        )}>
            {/* Chat Window */}
            <div className={clsx(
                styles.chatWindow,
                'absolute bottom-[80px] w-full h-[500px] rounded-2xl shadow-2xl overflow-hidden border border-white/30 flex flex-col',
                'md:w-[350px] md:left-auto md:right-0',
                { [styles.active]: isOpen }
            )}>
                <ChatHeader />
                <ChatMessages ref={messagesEndRef} messages={messages} isTyping={isTyping} />
                <ChatInput
                    value={inputValue}
                    onChange={(e: any) => setInputValue(e.target.value)}
                    onSend={handleSendMessage}
                    onFileChange={handleFileChange}
                    selectedFile={selectedFile}
                />
            </div>
            {/* Toggle Button */}
            <ChatToggle onClick={handleToggleChat} />
        </div>
    );
};

export default Chatbot;