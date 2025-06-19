"use client"

import { Switch } from "@components/Atoms/ui/switch"
import { useState, useEffect } from "react"
import LucideIcon from "@components/Atoms/LucideIcon"

interface ActionBarProps {
    workingDateId: string;
    isAvailable: boolean;
    onUpdateAvailability: (workingDateId: string, isAvailable: boolean) => void;
}

export default function ActionBar({ workingDateId, isAvailable, onUpdateAvailability }: ActionBarProps) {
    const [enabled, setEnabled] = useState(isAvailable)
    useEffect(() => {
        setEnabled(isAvailable)
    }, [isAvailable])

    const handleToggle = (checked: boolean) => {
        setEnabled(checked)
        onUpdateAvailability(workingDateId, checked)
    }

    return (
        <div className="relative group">
            {/* Glass background with dynamic reflection */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />

            {/* Main container with glass effect */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-full py-3 px-8 
                          flex items-center justify-center shadow-lg mx-auto w-fit 
                          border border-white/20 
                          animate-in fade-in-0 zoom-in-95 duration-500
                          hover:bg-white/15 hover:border-white/30  hover:scale-105
                          transition-all ease-out">
                <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center gap-4">
                        {/* Disable section with hover effect */}
                        <div className="flex items-center justify-center gap-2 
                                    transition-transform duration-300 hover:scale-105">
                            <span className="text-red-500 font-medium">Tắt</span>
                            <LucideIcon
                                name="XCircle"
                                iconColor="#ef4444"
                                className="w-5 h-5 drop-shadow-glow-red"
                            />
                        </div>

                        {/* Enhanced Switch with glass effect */}
                        <Switch
                            checked={enabled}
                            onCheckedChange={handleToggle}
                            className="relative [&[data-state=checked]]:bg-green-500 [&[data-state=unchecked]]:bg-red-500
                                     backdrop-blur-sm transition-all duration-500
                                     hover:scale-105 hover:shadow-lg active:scale-95
                                     before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-t before:from-white/5 before:to-transparent"
                        />

                        {/* Enable section with hover effect */}
                        <div className="flex items-center justify-center gap-2
                                    transition-transform duration-300 hover:scale-105">
                            <LucideIcon
                                name="CheckCircle"
                                iconColor="#22c55e"
                                className="w-5 h-5 drop-shadow-glow-green"
                            />
                            <span className="text-green-500 font-medium">Bật</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
