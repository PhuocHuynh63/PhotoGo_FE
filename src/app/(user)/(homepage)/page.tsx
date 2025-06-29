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
import { METADATA } from "../../../types/IMetadata";

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
    <HomePage user={userData} attendance={attendanceData} checkAttendance={checkAttendanceData} />
  );
}