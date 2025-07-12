'use client';

import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';
import ChatHeader from '@components/Atoms/ChatBotHeader';
import ChatMessages from '@components/Atoms/ChatMessage';
import ChatInput from '@components/Atoms/ChatInput';
import ChatToggle from '@components/Atoms/ChatBotToogle';
import geminiService from '@services/gemini';
import { IBackendResponse } from '@models/backend/backendResponse.model';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Chào bạn! Mình là trợ lý AI của PhotoGo, rất vui được gặp bạn. Bạn có muốn tìm hiểu về các gói chụp ảnh, concept hay cần mình phân tích ảnh nào không 🤖? Hãy cho mình biết nhé!", sender: 'bot' }
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

    const handleRemoveFile = () => {
        setSelectedFile(null);
    };

    const handleFileChange = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    }

    const [conceptsSame, setConceptsSame] = useState([]);
    const handleSendMessage = async () => {
        const text = inputValue.trim();
        if (!text && !selectedFile) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            sender: 'user',
            text: text,
            imageUrl: selectedFile ? URL.createObjectURL(selectedFile) : null
        };
        setMessages(prev => [...prev, userMessage]);

        const fileToSend = selectedFile;
        setInputValue('');
        setSelectedFile(null);

        setIsTyping(true);

        try {
            const formData = new FormData();

            formData.append('prompt', text);
            if (fileToSend) {
                formData.append('file', fileToSend);
            }

            const response = await geminiService.chatbotGemini(formData) as IBackendResponse<any>;

            let botMessage = "";
            let conceptsToShow = null;
            if (response.data.data.concepts_same) {
                conceptsToShow = response.data.data.concepts_same;
                setConceptsSame(conceptsToShow);
            } else {
                botMessage = response.data.data.text || "Tôi không hiểu câu hỏi của bạn. Bạn có thể thử lại không?";
            }
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: botMessage,
                    conceptsSame: conceptsToShow,
                    imageUrl: null
                }
            ]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 2,
                    sender: 'bot',
                    text: "Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.",
                    imageUrl: null
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div ref={chatContainerRef} className={clsx(
            'fixed z-[1000] bottom-0 left-5 right-5',
            'flex flex-col items-end',
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
                    onRemoveFile={handleRemoveFile}
                />
            </div>
            {/* Toggle Button */}
            <ChatToggle onClick={handleToggleChat} />
        </div>
    );
};

export default Chatbot;