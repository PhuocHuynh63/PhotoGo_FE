import { ROLE } from '@constants/common'
import { ROUTES } from '@routes';
import { useRouter } from 'next/navigation'
import React from 'react'

const ButtonServiceOffer = ({ roleName }: { roleName: string | undefined }) => {

    /**
     * Handle router
     */
    const router = useRouter();
    const handleRouter = () => {
        if (roleName === ROLE.CUSTOMER) {
            router.push(ROUTES.PUBLIC.SUBSCRIPTION.MEMBERSHIP)
        } else if (roleName === ROLE.VENDOR_OWNER) {
            router.push(ROUTES.PUBLIC.SUBSCRIPTION.VENDOR)
        }
    }
    //-----------------------------End-----------------------------//

    return (
        <>
            {roleName !== ROLE.ADMIN && (
                <button className="cursor-pointer relative px-6 py-2 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 animate-gradient" onClick={handleRouter}>
                    <div
                        className="absolute inset-0 animate-pulse"
                        style={{
                            background:
                                "linear-gradient(270deg, #8B5CF6, #A855F7, #EC4899, #F97316, #EAB308, #84CC16, #10B981, #06B6D4)",
                            backgroundSize: "400% 400%",
                            animation: "gradient 3s ease infinite",
                        }}
                    />
                    {roleName === ROLE.CUSTOMER && (
                        <span className="relative z-10">🔥 Ưu đãi hội viên</span>
                    )}

                    {roleName === ROLE.VENDOR_OWNER && (
                        <span className="relative z-10">🔥 Ưu đãi nhà cung cấp</span>
                    )}
                </button>
            )}
        </>
    )
}

export default ButtonServiceOffer