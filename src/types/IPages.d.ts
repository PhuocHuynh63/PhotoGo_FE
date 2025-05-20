import { IUser } from '@models/user/common.model';
import { IVendor } from '@models/vendor/common.model';
declare namespace PAGES {
    interface ILogin {
        data: any;
    }

    interface IHeader {
        user: IUser | undefined;
    }
    interface IProfile {
        user: IUser | undefined;
    }

    interface IHomePage {
        data: IVendor;
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
    }

    interface IChatProps {
        session: METADATA.ISession;
    }
}