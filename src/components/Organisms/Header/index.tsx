import { Avatar } from "@components/Molecules/Avatar"
import { ROUTES } from "@routes"
import Image from "next/image"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/Molecules/DropdownMenu";

export default function Header() {
    return (
        <header className="bg-grey p-3 px-8 w-full rounded-xl">
            <div className="flex justify-between items-center">
                <Link href={ROUTES.PUBLIC.HOME}>
                    <Image src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg" alt="logo" width={70} height={70} style={{ width: '70px', height: 'auto' }} priority />
                </Link>

                <div className="flex gap-12 ">
                    <Link href={ROUTES.PUBLIC.HOME}>Trang chủ</Link>
                    <Link href={ROUTES.PUBLIC.STUDIO}>Studio</Link>
                    <Link href={ROUTES.PUBLIC.FREELANCER}>Freelancer</Link>
                    <Link href={ROUTES.PUBLIC.ABOUT}>Về chúng tôi</Link>
                </div>

                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar
                                src="https://thanhnien.mediacdn.vn/Uploaded/haoph/2021_10_21/jack-va-thien-an-5805.jpeg"
                                alt="User avatar"
                                size={50}
                                className="cursor-pointer"
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
