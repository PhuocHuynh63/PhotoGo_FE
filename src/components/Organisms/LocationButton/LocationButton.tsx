"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/Molecules/Tooltip"
import Button from "@components/Atoms/Button"

export default function LocationButton() {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getUserLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser")
            return
        }

        setLoading(true)
        setError(null)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
                setLoading(false)
            },
            (error) => {
                setError("Unable to retrieve your location")
                setLoading(false)
                console.error("Error getting location:", error)
            },
        )
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        onClick={getUserLocation}
                        className="relative text-white hover:bg-white/10"
                        disabled={loading}
                    >
                        <MapPin className={`h-5 w-5 ${loading ? "animate-pulse" : ""}`} />
                        {location ? (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                        ) : (<>{error}</>)}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {loading
                        ? "Getting location..."
                        : location
                            ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                            : "Get your location"}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
