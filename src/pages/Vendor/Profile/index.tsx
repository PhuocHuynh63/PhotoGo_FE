'use client';

import ProfileDocuments from "@pages/Vendor/Components/Profile/ProfileDocument"
import ProfileInfo from "@pages/Vendor/Components/Profile/ProfileInfo"

const profileData = {
    name: "Studio Anh Dương",
    verified: true,
    completionPercentage: 85,
    email: "anhduong@studio.com",
    phone: "0912345678",
    address: "123 Nguyễn Huệ, Quận 1, TP Hồ Chí Minh",
    workingHours: "09:00 - 18:00",
    workingDays: "Thứ 2 - Chủ nhật",
    description:
        "Studio chụp ảnh chuyên nghiệp với hơn 10 năm kinh nghiệm. Chúng tôi chuyên về chụp ảnh cưới, gia đình, và sự kiện với chất lượng cao và giá phải chăng.",
    settings: {
        showProfile: true,
        showLocation: true,
        emailNotifications: true,
    },
    documents: [
        { id: 1, name: "Giấy phép kinh doanh", type: "business_license" },
        { id: 2, name: "CMND/CCCD", type: "id_card" },
        { id: 3, name: "Hợp đồng đối tác", type: "contract" },
    ],
}
const VendorProfilePage = () => {

    return (

        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Thông tin hồ sơ</h2>
            <p className="text-sm text-gray-500">Quản lý thông tin hồ sơ đối tác của bạn</p>
            <div className="mt-4 bg-white rounded-lg shadow">
                <ProfileInfo profileData={profileData} />
                <ProfileDocuments documents={profileData.documents} />
            </div>
        </div>

    )
}

export default VendorProfilePage