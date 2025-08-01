'use client'

import React, { useState } from 'react'
import { motion } from "framer-motion";
import ProfileLeft from '@pages/Member/Profile/Left';
import { IUser } from '@models/user/common.model';

const UserProfileLayoutClient = ({
    user,
    children
}: Readonly<{
    user: IUser;
    children: React.ReactNode;
}>) => {
    const [activeTab, setActiveTab] = useState("rewards");

    return (
        <div className="flex min-h-screen flex-col">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="mx-4 lg:mx-40 mt-10 lg:mt-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Content */}
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
                            className="lg:col-span-3 col-span-12"
                        >
                            <ProfileLeft
                                user={user}
                                setActiveTab={setActiveTab}
                                activeTab={activeTab}
                            />
                        </motion.div>
                        {/* Right Content */}
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
                            className="lg:col-span-9 col-span-12 pb-10"
                        >
                            {children}
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UserProfileLayoutClient;
