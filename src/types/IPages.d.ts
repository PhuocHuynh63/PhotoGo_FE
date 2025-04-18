import { IUser } from '@models/user/common.model';
import { IVendor } from '@models/vendor/common.model';
declare namespace PAGES {
    interface ILogin {
        data: any;
    }

    interface IHeader {
        user: IUser | undefined;
    }

    interface IHomePage {
        data: IVendor[];
    }

}