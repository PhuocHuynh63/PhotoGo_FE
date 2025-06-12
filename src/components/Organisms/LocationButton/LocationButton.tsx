"use client"

import { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/Molecules/Tooltip"
import Button from "@components/Atoms/Button"
import LucideIcon from "@components/Atoms/LucideIcon"
import Cookies from "js-cookie";

interface LocationButtonProps {
    className?: string
    isScrolled?: boolean
    isLoaded?: boolean
    homePage?: boolean
}

export default function LocationButton({ className, isScrolled, isLoaded, homePage }: LocationButtonProps) {
    const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [manualMode, setManualMode] = useState(false)
    const [manualAddress, setManualAddress] = useState("")
    const [manualLat, setManualLat] = useState("")
    const [manualLng, setManualLng] = useState("")
    const [tooltipOpen, setTooltipOpen] = useState(false);

    /**
     * Take the location from Cookies if it exists.
     */
    useEffect(() => {
        if (location === null) {
            const cookie = Cookies.get("user_location");
            if (cookie) {
                try {
                    setLocation(JSON.parse(cookie));
                } catch (e) {
                    console.log("Error parsing user_location cookie:", e);
                }
            }
        }
    }, []);
    //---------------------------End-----------------------------//

    /**
     * Save the location to cookies whenever it changes.
     * This ensures that the location persists across page reloads.
     */
    useEffect(() => {
        if (location) {
            const saved = Cookies.get("user_location");
            if (!saved || saved !== JSON.stringify(location)) {
                Cookies.set("user_location", JSON.stringify(location), { expires: 7 });
            }
        }
    }, [location]);
    //---------------------------End-----------------------------//

    /**
     * Clear the location from cookies when the component unmounts.
     * This prevents stale data from being stored if the user navigates away.
     */
    useEffect(() => {
        const handleUnload = () => {
            Cookies.remove("user_location");
        };
        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, []);
    //---------------------------End-----------------------------//

    const getUserLocation = () => {
        if (!navigator.geolocation) {
            setError("Trình duyệt không hỗ trợ định vị.")
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
                setLoading(false)
                setError("Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.")
            }
        )
    }

    const fetchAddress = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            const data = await response.json()
            if (data && data.display_name) {
                setLocation({ lat, lng, address: data.display_name })
            } else {
                setError("Không thể lấy địa chỉ")
            }
        } catch (error) {
            setError("Có lỗi khi lấy địa chỉ")
        }
    }

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (manualLat && manualLng) {
            const lat = parseFloat(manualLat)
            const lng = parseFloat(manualLng)
            setLocation({ lat, lng })
            await fetchAddress(lat, lng)
            setManualMode(false)
        } else if (manualAddress) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualAddress)}`)
                const data = await response.json()
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat)
                    const lng = parseFloat(data[0].lon)
                    setLocation({ lat, lng, address: data[0].display_name })
                    setManualMode(false)
                } else {
                    setError("Không tìm thấy địa chỉ này")
                }
            } catch (err) {
                setError("Có lỗi khi tìm địa chỉ")
            }
        } else {
            setError("Vui lòng nhập địa chỉ")
        }
    }

    return (
        <TooltipProvider>
            <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                <TooltipTrigger asChild>
                    <Button
                        onClick={() => {
                            setTooltipOpen((prev) => {
                                const next = !prev;
                                if (!prev) getUserLocation();
                                return next;
                            });
                        }}
                        className={`relative shadow-none text-white rounded-full p-2 ${className}`}
                        disabled={loading}
                    >
                        <LucideIcon
                            name="MapPin"
                            iconSize={24}
                            iconColor={location ? isScrolled ? '#51c778' : '#50C878' : homePage ? 'white' : 'black'}
                        />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-sm text-gray-800">
                    {loading ? (
                        "Đang lấy vị trí..."
                    ) : location ? (
                        <>
                            <div className="font-semibold">{location.address ?? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}</div>
                            <button
                                className="cursor-pointer text-blue-600 underline mt-1 text-sm p-0"
                                onClick={() => setManualMode(true)}
                            >
                                Không đúng? Chọn lại vị trí
                            </button>
                        </>
                    ) : (
                        <>
                            Không thể lấy vị trí hiện tại.
                            <Button
                                variant="link"
                                className="cursor-pointer text-blue-600 underline mt-1 text-sm p-0"
                                onClick={() => setManualMode(true)}
                            >
                                Chọn vị trí thủ công
                            </Button>
                        </>
                    )}
                </TooltipContent>
            </Tooltip>

            {manualMode && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[360px] shadow-2xl relative">
                        <button
                            className="cursor-pointer absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
                            onClick={() => setManualMode(false)}
                        >
                            ×
                        </button>
                        <h2 className="text-lg font-semibold mb-4 text-center">Chọn vị trí thủ công</h2>
                        <form onSubmit={handleManualSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-md px-3 py-2 text-sm"
                                    value={manualAddress}
                                    onChange={e => setManualAddress(e.target.value)}
                                    placeholder="Ví dụ: 123 Lê Lợi, Quận 1, TP.HCM"
                                />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <input
                                        type="hidden"
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                        value={manualLat}
                                        onChange={e => setManualLat(e.target.value)}
                                        placeholder="10.762622"
                                        step="any"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="hidden"
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                        value={manualLng}
                                        onChange={e => setManualLng(e.target.value)}
                                        placeholder="106.660172"
                                        step="any"
                                    />
                                </div>
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <Button type="submit" className="w-full bg-primary text-white rounded-md">
                                Xác nhận vị trí
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </TooltipProvider>
    )
}