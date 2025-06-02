// import { IVendorResponse } from "@models/vendor/response.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/authOptions";
import userService from "@services/user";
import HomePage from "@pages/Public/HomePage";
import { IUserResponse } from "@models/user/response.model";
import { IUser } from "@models/user/common.model";

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
    },
  ],
  minPrice: 100000,
  maxPrice: 1000000,
  servicePackages: [],
  averageRating: 4.5,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
  reviews: [],
  isRemarkable: false
};

async function getAUser(id: string) {
  return await userService.getAUser(id);
}

export default async function Home() {
  const session = await getServerSession(authOptions) as METADATA.ISession;
  let userData: IUser | undefined;
  if (session?.user?.id) {
    const user = await getAUser(session.user.id) as IUserResponse;
    userData = user?.data as IUser | undefined;
  }

  return (
    <HomePage user={userData} data={mockVendorData} />
  );
}