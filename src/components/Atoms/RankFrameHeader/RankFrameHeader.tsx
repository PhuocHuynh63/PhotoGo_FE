import { cn } from "@helpers/CN"
import { Camera } from "lucide-react"

type UserRank = "unranked" | "bronze" | "silver" | "gold"

interface RankHeaderFrameProps {
    rank: UserRank
    userName?: string
    className?: string
}

export function RankHeaderFrame({ rank = "unranked", userName = "", className }: RankHeaderFrameProps) {
    const styles = {
        unranked: {
            bg: "bg-gradient-to-r from-gray-200 to-gray-300",
            text: "text-gray-700",
            icon: "text-gray-400"
        },
        bronze: {
            bg: "bg-gradient-to-r from-amber-600 to-amber-800",
            text: "text-white",
            icon: "text-amber-300"
        },
        silver: {
            bg: "bg-gradient-to-r from-gray-300 to-gray-500",
            text: "text-white",
            icon: "text-gray-200"
        },
        gold: {
            bg: "bg-gradient-to-r from-yellow-400 to-yellow-600",
            text: "text-white",
            icon: "text-yellow-200"
        }
    }

    const rankText = {
        unranked: "Unranked",
        bronze: "Bronze",
        silver: "Silver",
        gold: "Gold"
    }

    return (
        <div className={cn(
            "relative overflow-hidden rounded-lg p-3",
            styles[rank].bg,
            "transition-all duration-300",
            className
        )}>
            {/* Icon */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Camera className={cn("w-5 h-5", styles[rank].icon)} />
            </div>

            {/* Content */}
            <div className="flex items-center space-x-2">
                <span className={cn("text-sm font-medium", styles[rank].text)}>
                    {userName && (
                        <>
                            <span className="font-semibold">{userName}</span>
                            <span className="mx-2">·</span>
                        </>
                    )}
                    {rankText[rank]}
                </span>
            </div>
        </div>
    )
}