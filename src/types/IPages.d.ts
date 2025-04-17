import { IUser } from '@models/user/common.model';
declare namespace PAGES {
    interface ILogin {
        data: any;
    }

    interface IHeader {
        user: IUser | undefined;
    }

}