import { z } from "zod";
import { BackendResponseModel } from "../backend/backendResponse.model";
import { PaginationModel } from "../metadata";
import { UserModel } from "./common.model";

/**
 * UserModel is a Model for Users response
 */
export const UsersModelResponse = z.object({
    meta: PaginationModel,
    results: z.array(UserModel),
})
export const Users = BackendResponseModel(UsersModelResponse);
export type IUsersResponse = z.TypeOf<typeof Users>
//----------------------End----------------------//

/**
 * UserModel is a Model for User response
 */
export const User = BackendResponseModel(UserModel);
export type IUserResponse = z.TypeOf<typeof User>;
//----------------------End----------------------//


/**
 * UserModel is a Model for User Resigster response
 */
export const UserRegisterModelResponse = UserModel
export const UserRegister = BackendResponseModel(UserRegisterModelResponse);
export type IUserRegisterResponse = z.TypeOf<typeof UserRegister>
//----------------------End----------------------//

/**
 * UserModel is a Model for User Update response
 */
export const UserUpdateModelResponse = z.object({
    data: UserModel,
    message: z.string(),
    statusCode: z.number()
})
export const UserUpdate = BackendResponseModel(UserUpdateModelResponse);
export type IUserUpdateResponse = z.TypeOf<typeof UserUpdate>
//----------------------End----------------------//


/**
 * AdminModel is a Model for Admin Create User response
 */
export const AdminCreateUser = BackendResponseModel(UserModel);
export type IAdminCreateUserResponse = z.TypeOf<typeof AdminCreateUser>;
//----------------------End----------------------//


/**
 * AdminGetUsersResponseModel is a Model for Admin Get Users response
 */
export const AdminGetUsersResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
      data: z.array(UserModel),
      pagination: PaginationModel,
    }),
  });
  
  export type IAdminGetUsersResponse = z.TypeOf<typeof AdminGetUsersResponse>;
//----------------------End----------------------//

/**
 * UserModel is a Model for User Statistics response
 */
export const UserStatisticsModelResponse = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
      totalBookings: z.number(),
      completedBookings: z.number(),
      cancelledBookings: z.number(),
      pendingBookings: z.number(),
      totalPaidAmount: z.number(),
      totalPaidCompletedBookings: z.number(),
      totalSubscriptions: z.number(),
      totalPaidSubscription: z.number(),
      points: z.object({
        currentBalance: z.number(),
        totalEarned: z.number(),
        totalRedeemed: z.number(),
        totalExpired: z.number()
      }),
      vouchers: z.object({
        totalVouchers: z.number(),
        usedVouchers: z.number(),
        availableVouchers: z.number()
      }),
    })
});



export type IUserStatisticsResponse = z.TypeOf<typeof UserStatisticsModelResponse>;
//----------------------End----------------------//