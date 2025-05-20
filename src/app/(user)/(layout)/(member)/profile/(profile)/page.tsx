import ProfileContent from "@pages/Member/Profile/Right/ProfileContent"
import { IUser } from "@models/user/common.model"

export default async function Profile({ user }: { user: IUser }) {
    return (
        <ProfileContent user={user} />
    )
}