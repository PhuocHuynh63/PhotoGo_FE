import { Button } from "@components/Atoms/ui/button"
import { IVendor } from "@models/vendor/common.model"
import { formatPrice } from "@utils/helpers/CurrencyFormat/CurrencyFormat"

interface PricingTabProps {
    profileData: IVendor
    visibleServicesCount: number
    isLoadingMore: boolean
    onLoadMore: () => void
}

export default function PricingTab({
    profileData,
    visibleServicesCount,
    isLoadingMore,
    onLoadMore
}: PricingTabProps) {
    return (
        <div className="space-y-4">
            {profileData?.servicePackages?.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 px-4 py-2 text-left">Gói dịch vụ</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Giá</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profileData.servicePackages.slice(0, visibleServicesCount).map((servicePackage, index) => {
                                    // Calculate min/max price for this specific package
                                    const packagePrices = servicePackage.serviceConcepts?.map(concept => (concept.price)).filter(price => !isNaN(price)) || [];
                                    const packageMinPrice = packagePrices.length > 0 ? Math.min(...packagePrices) : null
                                    const packageMaxPrice = packagePrices.length > 0 ? Math.max(...packagePrices) : null

                                    return (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <div>
                                                    <p className="font-medium">{servicePackage.name}</p>
                                                    <div
                                                        className="text-muted-foreground prose prose-sm max-w-none line-clamp-3"
                                                        dangerouslySetInnerHTML={{ __html: servicePackage.description || '' }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {packageMinPrice && packageMaxPrice ? (
                                                    packageMinPrice === packageMaxPrice
                                                        ? `${formatPrice(packageMinPrice)}`
                                                        : `${formatPrice(packageMinPrice)} - ${formatPrice(packageMaxPrice)}`
                                                ) : (
                                                    "Chưa cập nhật"
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 capitalize">{servicePackage.status}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {visibleServicesCount < (profileData?.servicePackages?.length || 0) && (
                        <div className="mt-6 text-center">
                            <Button
                                variant="outline"
                                className="cursor-pointer bg-orange-50 text-orange-500 border-orange-200 hover:bg-orange-100 hover:text-orange-600 px-6 py-2"
                                onClick={onLoadMore}
                                disabled={isLoadingMore}
                            >
                                {isLoadingMore ? "Đang tải..." : "Tải thêm dịch vụ"}
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">
                                Hiển thị {Math.min(visibleServicesCount, profileData?.servicePackages?.length || 0)} / {profileData?.servicePackages?.length || 0} dịch vụ
                            </p>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-gray-500">Chưa có bảng giá nào được thêm.</p>
            )}
        </div>
    )
}