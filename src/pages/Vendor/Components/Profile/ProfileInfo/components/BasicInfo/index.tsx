import { IVendor } from "@models/vendor/common.model"
import { formatPrice } from "@utils/helpers/CurrencyFormat/CurrencyFormat";

interface BasicInfoProps {
    profileData: IVendor
    conceptPriceRange: { minPrice: number; maxPrice: number } | null
}

export default function BasicInfo({ profileData, conceptPriceRange }: BasicInfoProps) {
    // Get primary location address
    const fullAddress = profileData?.locations?.[0]
        ? `${profileData.locations[0].address}, ${profileData.locations[0].ward}, ${profileData.locations[0].district}, ${profileData.locations[0].city}`
        : "Chưa cập nhật"

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                    <p>{profileData?.user_id?.email || "Chưa cập nhật"}</p>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Địa chỉ</h4>
                    <p>{fullAddress}</p>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Số điện thoại</h4>
                    <p>{profileData?.user_id?.phoneNumber || "Chưa cập nhật"}</p>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Trạng thái</h4>
                    <p className="capitalize">{profileData?.status || "Chưa xác định"}</p>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Danh mục</h4>
                    <p>{profileData?.category?.name || "Chưa phân loại"}</p>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Đánh giá trung bình</h4>
                    <p>{profileData?.averageRating?.toFixed(1) || "0"} ⭐</p>
                </div>
            </div>

            <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Mô tả</h4>
                <div
                    className="text-muted-foreground prose prose-sm max-w-none line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: profileData?.description || '' }}
                />
            </div>

            <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Giá dịch vụ</h4>
                <p className="text-sm">
                    {conceptPriceRange
                        ? `${formatPrice(conceptPriceRange.minPrice)} - ${formatPrice(conceptPriceRange.maxPrice)}`
                        : "Chưa cập nhật"
                    }
                </p>
            </div>
        </div>
    )
} 