import { Button } from "@components/Atoms/ui/button"
import { IVendor } from "@models/vendor/common.model"

interface ServicesTabProps {
    profileData: IVendor
    visibleServicesCount: number
    isLoadingMore: boolean
    onLoadMore: () => void
}

export default function ServicesTab({ 
    profileData, 
    visibleServicesCount, 
    isLoadingMore, 
    onLoadMore 
}: ServicesTabProps) {
    return (
        <div className="space-y-4">
            {profileData?.servicePackages?.length > 0 ? (
                <>
                    {profileData.servicePackages.slice(0, visibleServicesCount).map((servicePackage, index) => {
                        // Calculate min/max price for this specific package
                        const packagePrices = servicePackage.serviceConcepts?.map(concept => parseFloat(concept.price)).filter(price => !isNaN(price)) || []
                        const packageMinPrice = packagePrices.length > 0 ? Math.min(...packagePrices) : null
                        const packageMaxPrice = packagePrices.length > 0 ? Math.max(...packagePrices) : null

                        return (
                            <div key={index} className="p-4 border rounded-lg">
                                <h5 className="font-medium">{servicePackage.name}</h5>
                                <p className="text-sm text-gray-600 mt-1">{servicePackage.description}</p>
                                {packageMinPrice && packageMaxPrice && (
                                    <p className="text-sm font-medium mt-2">
                                        {packageMinPrice === packageMaxPrice 
                                            ? `${packageMinPrice.toLocaleString()} VNĐ`
                                            : `${packageMinPrice.toLocaleString()} - ${packageMaxPrice.toLocaleString()} VNĐ`
                                        }
                                    </p>
                                )}
                                {servicePackage.serviceConcepts?.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-500 mb-1">Các dịch vụ:</p>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            {servicePackage.serviceConcepts.map((concept, conceptIndex) => (
                                                <li key={conceptIndex}>
                                                    • {concept.name} - {parseFloat(concept.price).toLocaleString()} VNĐ
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )
                    })}

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
                <p className="text-gray-500">Chưa có dịch vụ nào được thêm.</p>
            )}
        </div>
    )
} 