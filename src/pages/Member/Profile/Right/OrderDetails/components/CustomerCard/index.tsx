"use client"

import React from "react";

interface User {
    avatarUrl: string;
}

interface CustomerCardProps {
    isVisible?: boolean;
    user: User;
    fullName: string;
    email: string;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ isVisible, user, fullName, email }) => (
    <div
        id="customer-card"
        data-animate
        className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col items-center text-center transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
    >
        <img
            src={user?.avatarUrl || "/placeholder.svg"}
            alt="Avatar"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://placehold.co/96x96/e2e8f0/64748b?text=${fullName.charAt(0).toUpperCase()}`;
            }}
        />
        <p className="font-bold text-xl mt-4">{fullName}</p>
        <p className="text-sm text-gray-500">{email}</p>
    </div>
);

export default CustomerCard; 