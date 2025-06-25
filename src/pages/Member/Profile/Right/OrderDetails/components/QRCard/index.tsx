'use client'

import React from "react";
import { QRCodeSVG } from 'qrcode.react';

interface QRCardProps {
    isVisible?: boolean;
    code: string;
    qrURL: string;
}

const QRCard: React.FC<QRCardProps> = ({ isVisible, code, qrURL }) => (
    <div
        id="qr-card"
        data-animate
        className={`bg-gray-900 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
    >
        <h3 className="text-xl font-bold">Check-in Pass</h3>
        <p className="text-sm opacity-70 mt-1 mb-4">Dùng mã này để check-in tại studio</p>
        <div className="bg-white p-3 rounded-lg">
            <QRCodeSVG value={qrURL} />
        </div>
        <p className="mt-4 font-mono font-bold text-2xl tracking-widest">{code}</p>
    </div>
);

export default QRCard; 