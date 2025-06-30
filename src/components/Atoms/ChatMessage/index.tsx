'use client'

import React, { forwardRef } from 'react';
import styles from '../../Molecules/Chatbot/index.module.scss';
import clsx from 'clsx';

const TypingIndicator = ({ isActive }: any) => (
    <div className={clsx('p-5 text-left', isActive ? 'block' : 'hidden')}>
        <div className="inline-flex items-center gap-1 p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl rounded-bl-md">
            <div className={`${styles.typingDot} w-1.5 h-1.5 bg-purple-500 rounded-full`}></div>
            <div className={`${styles.typingDot} w-1.5 h-1.5 bg-purple-500 rounded-full`}></div>
            <div className={`${styles.typingDot} w-1.5 h-1.5 bg-purple-500 rounded-full`}></div>
        </div>
    </div>
);

const ChatMessages = forwardRef(({ messages, isTyping }: any, ref: any) => (
    <div ref={ref} className="h-[350px] overflow-y-auto p-5 scroll-smooth [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-black/5 [&::-webkit-scrollbar-thumb]:bg-purple-500/30">
        {messages.map((msg: any) => (
            <div key={msg.id} className={clsx(styles.message, 'mb-4', msg.sender === 'user' ? 'text-right' : 'text-left')}>
                <div className={clsx(
                    'inline-block py-3 px-4 rounded-2xl max-w-[80%] text-sm leading-snug relative',
                    msg.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-br-md'
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-bl-md'
                )}>
                    {msg.text}
                    {msg.imageUrl && (
                        <img src={msg.imageUrl} alt="Uploaded content" className="mt-2 rounded-lg max-w-full h-auto" />
                    )}
                </div>
            </div>
        ))}
        <TypingIndicator isActive={isTyping} />
    </div>
));

export default ChatMessages;