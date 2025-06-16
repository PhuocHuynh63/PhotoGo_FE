import { CheckCircle } from "lucide-react"
import { Badge } from "@components/Atoms/ui/badge"
import { Progress } from "@components/Atoms/ui/progress"
import { Button } from "@components/Atoms/ui/button"
import { IVendor } from "@models/vendor/common.model"
import Image from "next/image"

interface ProfileHeaderProps {
    profileData: IVendor
    completionPercentage: number
}

export default function ProfileHeader({ profileData, completionPercentage }: ProfileHeaderProps) {
    // Check if vendor is verified based on status
    const isVerified = profileData?.status === "active"

    return (
        <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative border border-gray-300">
                {profileData?.logo ? (
                    <Image
                        src={profileData.logo}
                        alt={profileData?.name || "Vendor logo"}
                        fill
                        className="object-cover"
                        sizes="96px"
                        priority={true}
                    />
                ) : (
                    <span className="text-3xl font-semibold">{profileData?.name?.charAt(0)}</span>
                )}
            </div>

            <div>
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{profileData?.name}</h3>
                    {isVerified && (
                        <Badge variant="outline" className="bg-green-200 text-green-800 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Đã xác minh
                        </Badge>
                    )}
                </div>

                <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Hoàn thành hồ sơ</p>
                    <div className="flex items-center gap-2">
                        <Progress value={completionPercentage} className="w-32 h-2" />
                        <span className="text-sm font-medium">{completionPercentage}%</span>
                    </div>
                </div>
            </div>

            <div className="ml-auto">
                <Button
                    variant="outline"
                    className="bg-orange-50 text-orange-500 border-orange-200 hover:bg-orange-100 hover:text-orange-600"
                >
                    Chỉnh sửa
                </Button>
            </div>
        </div>
    )
} 