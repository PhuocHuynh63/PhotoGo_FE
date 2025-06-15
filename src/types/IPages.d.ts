import { IServiceConceptImageModel } from '@models/serviceConcepts/response.model';
import { IUser } from '@models/user/common.model';
import { IVendor } from '@models/vendor/common.model';
import { ICartResponse } from '@models/cart/response.model';
import { IReviewPaginationResponse } from '@models/review/repsonse.model';
import { IVendorResponse } from '@models/vendor/response.model';
import { IAttendance, ICheckAttendance } from '@models/attendance/common.model';
import { ILocationSchedule } from '@models/locationAvailability/common.model';

declare namespace PAGES {
    interface ILogin {
        data: any;
    }

    interface IHeader {
        user: IUser | undefined;
        cart: ICartResponse;
    }
    interface IProfile {
        user: IUser | undefined;
    }

    interface IHomePage {
        user: IUser | undefined;
        attendance: IAttendance[] | undefined;
        checkAttendance: ICheckAttendance | undefined;
    }
    interface Promotion {
        id: number;
        title: string;
        code: string;
        expiry: string;
        description: string;
    }
    interface IFavorite {
        id: number;
        name: string;
        vendor: string;
        price: number;
        image: string;
        rating: number;
    }
    interface IOrder {
        id: number;
        name: string;
        vendor: string;
        price: number;
        image: string;
        rating: number;
    }
    interface ICommonProfileProps extends IProfile {

        promotions?: Promotion[];
        favorites?: IFavorite[];
        orders?: IOrder[];
    }
    interface ProfileLeftProps extends ICommonProfileProps {
        activeTab: string;
        setActiveTab: (tab: string) => void;
    }
    interface ProfileRightProps extends ICommonProfileProps {
        userToken: string;
        activeTab: string;
        userOrders: IOrder[];
        userFavorites: IFavorite[];
        userPromotions: Promotion[];
        children: React.ReactNode;
    }

    interface IVendorDetailPageProps {
        children: React.ReactNode;
        vendor: IVendor;
        session: METADATA.ISession | null;
        concept: IServiceConceptImageModel;
    }

    interface IChatProps {
        session: METADATA.ISession;
    }

    interface ICheckoutLayoutProps {
        children: React.ReactNode;
        user: IUserResponse;
        checkoutSession?: ICheckoutSessionResponseModel;
        concept?: IServiceConceptResponse;
        servicePackage?: IServicePackageResponse;
    }

    interface IReviewProps {
        vendor: IVendorResponse;
        review: IReviewPaginationResponse;
    }

    interface IAttendancePageProps {
        user: IUser | undefined;
        attendance: IAttendance[] | undefined;
        checkAttendance: ICheckAttendance | undefined;
    }
    interface IProfileAttendanceBoardProps {
        attendance: IAttendance[] | undefined;
        checkAttendance: ICheckAttendance | undefined;
    }

    interface IAttendanceCalendarInlineProps {
        attendance?: IAttendance[]
    }
    interface IWorkingHoursSettingsProps {
        vendor: IVendor;
    }
    interface IManageWorkingDateProps {
        workingHoursList: ILocationSchedule[];
        isLoadingData: boolean;
        fetchWorkingHours: () => void;
        showActionBar: boolean;
        setShowActionBar: (show: boolean) => void;
        setSelectedWorkingDateId: (id: string) => void;
        setSelectedWorkingDateAvailability: (isAvailable: boolean) => void;
    }

    interface IVendorProfileInfoProps {
        profileData: IVendor;
    }
}