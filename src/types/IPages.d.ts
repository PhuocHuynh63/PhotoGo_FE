import { IServiceConceptImageModel } from '@models/serviceConcepts/response.model';
import { IUser } from '@models/user/common.model';
import { IVendor } from '@models/vendor/common.model';
import { IReviewPaginationResponse } from '@models/review/repsonse.model';
import { IVendorResponse } from '@models/vendor/response.model';
import { IAttendance, ICheckAttendance } from '@models/attendance/common.model';
import { ILocationSchedule } from '@models/locationAvailability/common.model';
import { ICheckoutSession } from '@models/checkoutSession/common.model';

declare namespace PAGES {
    interface ILogin {
        data: any;
    }

    interface IHeader {
        user: IUser | undefined;
        servicePackages: IServicePackagesData;
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
        user: IUser | null;
        concept: IServiceConceptImageModel;
        review: IReviewPaginationResponse;
    }

    interface IChatProps {
        session: METADATA.ISession;
    }

    interface ICheckoutLayoutProps {
        children: React.ReactNode;
        user: IUserResponse;
        checkoutSession?: ICheckoutSession;
        concept?: IServiceConceptResponse;
        servicePackage?: IServicePackageResponse;
    }

    interface IReviewProps {
        vendor?: IVendorResponse;
        review?: IReviewPaginationResponse;
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
        lastSelection: {
            month: number,
            week: number,
            workingHoursId: string,
            workingDateId: string,
            date: string
        } | null;
        setLastSelection: React.Dispatch<React.SetStateAction<{
            month: number,
            week: number,
            workingHoursId: string,
            workingDateId: string,
            date: string
        } | null>>;
    }

    interface IVendorProfileInfoProps {
        profileData: IVendor;
    }

    interface IPromotionPageProps {
        session: METADATA.ISession;
    }

    export interface Appointment {
        id: string
        title: string
        customerName: string
        customerPhone: string
        customerEmail: string
        service: string
        package: string
        date: string
        from: string | null
        to: string | null
        status: BOOKING_STATUS
        color: string
        notes: string
        alreadyPaid: number
        remain: number
        total: number
        location: string
        userId: string
    }

    interface WorkingHours {
        start: string
        end: string
        breakStart: string
        breakEnd: string
    }

    interface Location {
        id: string
        name: string
    }

    interface ICalendarViewProps {
        appointments: Appointment[]
        workingHours: WorkingHours
        locations: Location[]
        selectedLocationId: string
        onLocationChange: (locationId: string) => void
        onDateRangeChange?: (from: string, to: string) => void
        onAppointmentUpdate?: (updatedAppointment: Appointment) => void
        isLoading?: boolean
    }

    interface TodayAppointment {
        id: string
        customerName: string
        service: string
        time: string
        status: string
    }

    interface UpcomingAppointment {
        id: string
        customerName: string
        service: string
        date: string
        time: string
        status: string
    }

    interface Stats {
        totalThisWeek: number
        confirmedThisWeek: number
        pendingThisWeek: number
        revenueThisWeek: number
    }
    interface ICalendarSidebarProps {
        todayAppointments: TodayAppointment[]
        upcomingAppointments: UpcomingAppointment[]
        stats: Stats
    }

    interface AppointmentModalProps {
        appointment: Appointment | null
        isOpen: boolean
        onClose: () => void
        onAppointmentUpdate?: (updatedAppointment: Appointment) => void
    }
}