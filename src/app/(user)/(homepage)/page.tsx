// import { IVendorResponse } from "@models/vendor/response.model";
import HomePage from "@pages/Public/HomePage";

// Mock data cho homepage
const mockVendorData = {
  id: "1",
  name: "Studio ABC",
  slug: "studio-abc",
  description: "Studio chụp ảnh chuyên nghiệp",
  logo: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg",
  banner: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg",
  status: "active",
  locations: [
    {
      id: "1",
      address: "123 Đường ABC",
      district: "Quận 1",
      ward: "Phường 1",
      city: "Hồ Chí Minh",
      province: "Hồ Chí Minh",
      latitude: "10.762622",
      longitude: "106.660172",
      created_at: "2024-01-01",
      updated_at: "2024-01-01"
    }
  ],
  servicePackages: [],
  averageRating: 4.5,
  created_at: "2024-01-01",
  updated_at: "2024-01-01"
};

export default function Home() {
  return (
    <>
      <HomePage data={mockVendorData} />
    </>
  );
}