'use client'

import React, { useRef } from 'react';
import { Button } from '../ui/button';
import { XIcon } from 'lucide-react';

const PaperclipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
    </svg>
);

const SendIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22,2 15,22 11,13 2,9"></polygon>
    </svg>
);

const ChatInput = ({ value, onChange, onSend, onFileChange, selectedFile, onRemoveFile }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    }

    return (
        <div className="p-2 bg-white/90 border-t border-black/5">
            {selectedFile && (
                <div className='pb-2 flex justify-center'>
                    <div className="relative inline-block">
                        <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="max-h-24 rounded-md border p-1" />
                        <button
                            onClick={onRemoveFile}
                            className="cursor-pointer w-5 h-5 absolute -top-1 -right-1 bg-gray-700 text-white rounded-full px-1 leading-none hover:bg-red-500 transition-colors"
                            aria-label="Remove preview"
                        >
                            <XIcon width={14} height={15} />
                        </button>
                    </div>
                </div>
            )}
            <div className="flex gap-2 items-center">
                <input type="file" accept="image/*" onChange={onFileChange} ref={fileInputRef} className="hidden" />
                <button onClick={handleFileButtonClick} className="cursor-pointer w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                    <PaperclipIcon />
                </button>
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 py-2 px-1 md:px-3 border-2 border-orange-400/20 rounded-full outline-none text-sm transition-all bg-white/80 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                />
                <Button onClick={onSend} className="w-10 h-8 flex-shrink-0 bg-gradient-to-r from-orange-400 to-orange-300 text-white rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                    <SendIcon />
                </Button>
            </div>
        </div>
    );
};

export default ChatInput;