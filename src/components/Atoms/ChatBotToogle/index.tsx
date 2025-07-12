'use client'

import React from 'react';
import styles from '../../Molecules/Chatbot/index.module.scss';

const ChatToggle = ({ onClick }: any) => (
    <button onClick={onClick} className={`${styles.chatToggle} cursor-pointer w-[60px] h-[60px] bg-gradient-to-r from-orange-400 to-orange-300 rounded-full shadow-lg flex items-center justify-center relative overflow-hidden`}>
        <div className={`${styles.avatar} w-[35px] h-[35px] bg-white rounded-full relative flex items-center justify-center`}>
            <div className={`${styles.robotAntenna} absolute top-[-4px] left-1/2 -translate-x-1/2 w-[2px] h-[8px] bg-orange-400 rounded-[1px]`}></div>
        </div>
    </button>
);

export default ChatToggle;