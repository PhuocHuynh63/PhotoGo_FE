'use client'

import React from 'react';
import styles from '../../Molecules/Chatbot/index.module.scss';

const ChatHeader = () => (
    <div className={`${styles.chatHeader} bg-gradient-to-r from-orange-400 to-orange-300 text-white p-5 text-center relative overflow-hidden`}>
        <h3 className="m-0 text-lg font-semibold">PhotoGo AI</h3>
        <p className="mt-1 text-xs opacity-90">Luôn sẵn sàng hỗ trợ bạn</p>
    </div>
);

export default ChatHeader;