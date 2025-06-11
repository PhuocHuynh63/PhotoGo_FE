// import { IVendorResponse } from "@models/vendor/response.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/authOptions";
import userService from "@services/user";
import HomePage from "@pages/Public/HomePage";
import { IUserResponse } from "@models/user/response.model";
import { IUser } from "@models/user/common.model";
import attendanceService from "@services/attendance";
import { IAttendance, ICheckAttendance } from "@models/attendance/common.model";
import { IAttendanceResponseModel, ICheckAttendanceResponseModel } from "@models/attendance/response.model";

// Mock data cho homepage
const mockVendorData = {
  id: "1",
  user_id: "1",
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

async function getAttendance(userId: string) {
  return await attendanceService.getAttendance(userId);
}

async function getAUser(id: string) {
  return await userService.getAUser(id);
}

async function checkAttendance(userId: string) {
  return await attendanceService.checkAttendance(userId);
}

export default async function Home() {
  const session = await getServerSession(authOptions) as METADATA.ISession;
  let userData: IUser | undefined;
  let attendanceData: IAttendance[] | undefined;
  let checkAttendanceData: ICheckAttendance | undefined;
  if (session?.user?.id) {
    const user = await getAUser(session.user.id) as IUserResponse;
    userData = user?.data as IUser | undefined;
    const attendance = await getAttendance(session?.user?.id as string) as IAttendanceResponseModel;
    attendanceData = attendance?.data as IAttendance[] | undefined;
    const checkAttendanceResult = await checkAttendance(session?.user?.id as string) as ICheckAttendanceResponseModel;
    checkAttendanceData = checkAttendanceResult?.data as ICheckAttendance | undefined;
  }

  return (
    <HomePage user={userData} data={mockVendorData} attendance={attendanceData} checkAttendance={checkAttendanceData} />
  );
}