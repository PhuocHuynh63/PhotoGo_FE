'use client';

import { IVendor } from "@models/vendor/common.model";
import ProfileInfo from "@pages/Vendor/Components/Profile/ProfileInfo"

const VendorProfilePage = ({ vendorData }: { vendorData: IVendor }) => {
    return (

        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Thông tin hồ sơ</h2>
            <p className="text-sm text-gray-500">Quản lý thông tin hồ sơ đối tác của bạn</p>
            <div className="mt-4 bg-white rounded-lg shadow">
                <ProfileInfo profileData={vendorData} />
                {/* <ProfileDocuments documents={profileData.documents} /> */}
            </div>
        </div>

    )
}

export default VendorProfilePage