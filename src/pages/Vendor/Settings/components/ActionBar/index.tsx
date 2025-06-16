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
        <div className="bg-transparent backdrop-blur-xs rounded-full py-2 px-8 flex items-center justify-center shadow-sm mx-auto w-fit border border-white/20 animate-in fade-in-0 zoom-in-95 duration-500">
            <div className="flex items-center justify-center space-x-2">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center gap-2">
                        <span>Disable</span>
                        <LucideIcon
                            name="XCircle"
                            iconColor="#ef4444"
                            className="w-5 h-5"
                        />
                    </div>
                    <Switch
                        checked={enabled}
                        onCheckedChange={handleToggle}
                        className="[&[data-state=checked]]:bg-green-500 [&[data-state=unchecked]]:bg-red-500 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95"
                    />
                    <div className="flex items-center justify-center gap-2">
                        <LucideIcon
                            name="CheckCircle"
                            iconColor="#22c55e"
                            className="w-5 h-5"
                        />
                        <span>Enable</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
