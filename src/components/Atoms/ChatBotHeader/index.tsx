'use client'

import React from 'react';
import styles from '../../Molecules/Chatbot/index.module.scss';

const ChatHeader = () => (
    <div className={`${styles.chatHeader} bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-5 text-center relative overflow-hidden`}>
        <h3 className="m-0 text-lg font-semibold">AI Assistant</h3>
        <p className="mt-1 text-xs opacity-90">Luôn sẵn sàng hỗ trợ bạn</p>
    </div>
);

export default ChatHeader;