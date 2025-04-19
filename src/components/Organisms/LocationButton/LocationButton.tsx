"use client"

import { useEffect, useState } from "react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/Molecules/Tooltip"
import Button from "@components/Atoms/Button"
import LucideIcon from "@components/Atoms/LucideIcon"

interface LocationButtonProps {
    className?: string
    isScrolled?: boolean
    isLoaded?: boolean
}

export default function LocationButton({ className, isScrolled, isLoaded }: LocationButtonProps) {
    const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
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
                const { latitude, longitude } = position.coords
                setLocation({ lat: latitude, lng: longitude })
                fetchAddress(latitude, longitude)
                setLoading(false)
            },
            (error) => {
                setError("Unable to retrieve your location")
                setLoading(false)
                setError(error.message)
            },
        )
    }
    useEffect(() => {
        if (isLoaded) {
            getUserLocation()
        }
    }, [isLoaded])
    const fetchAddress = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await response.json();
            if (data && data.display_name) {
                setLocation({ lat, lng, address: data.display_name });
            } else {
                setError("Unable to retrieve address");
            }
        } catch (error) {
            setError("Error fetching address");
            console.error("Error fetching address:", error);
        }
    }


    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={getUserLocation}
                        className={`relative shadow-none  text-white ${className}`}
                        disabled={loading}

                    >
                        <LucideIcon name="MapPin" iconSize={26} iconColor={location ? isScrolled ? '#51c778' : '#50C878' : 'white'} />
                        {/* <MapPin className={`h-5 w-5 ${loading ? "animate-pulse" : ""}`} /> */}
                        {location ? (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span> */}
                            </span>
                        ) : (<>{error}</>)}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {loading
                        ? "Getting location..."
                        : location
                            ? location.address
                                ? location.address
                                : `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}, ${location.address}`
                            : "Get your location"}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
