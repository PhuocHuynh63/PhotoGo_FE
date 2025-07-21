import { Lock } from "lucide-react";
import { ROUTES } from "@routes";
import { useRouter } from "next/navigation";

export default function Subscription({ hasSubscription }: { hasSubscription: boolean }) {
    const router = useRouter();
    return (

        <div className="mt-8 relative">
            {/* Overlay ổ khóa nếu chưa mua */}
            {!hasSubscription && (
                <div
                    className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 rounded-lg pointer-events-auto cursor-pointer"
                    onClick={() => router.push(ROUTES.PUBLIC.SUBSCRIPTION.MEMBERSHIP)}
                >
                    <div className="flex flex-col items-center">
                        <Lock className="w-16 h-16 text-white drop-shadow-lg animate-bounce" />
                        <span className="mt-2 text-lg font-semibold text-white drop-shadow">Mua gói để mở khóa ưu đãi!</span>
                    </div>
                </div>
            )}
            {/* Shimmer overlay */}
            <div className="absolute inset-0 pointer-events-none z-10">
                <div className="w-full h-full shimmer-profile-subscription rounded-lg"></div>
            </div>
            <div className={`flex-1 rounded-lg overflow-hidden w-full 
                    ${hasSubscription
                    ? "bg-gradient-to-tl from-[#1d9cd8] via-[#38c3ec] to-[#0f70b7] opacity-100"
                    : "bg-gradient-to-tl from-gray-400 via-gray-300 to-gray-200 opacity-70"} 
                    p-6 text-white shadow-2xl border-4 border-white/30 relative z-20`}>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl">✨</span>
                            <h2 className="text-3xl font-extrabold mb-2 drop-shadow-lg tracking-wide">Gói Ultimated</h2>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold drop-shadow">29.000 ₫</span>
                            <span className="text-base">/ tháng</span>
                        </div>
                        <div className="text-sm mt-1">Hoặc <span className="font-semibold">319.000 ₫</span> / năm <span className="ml-1 animate-pulse text-yellow-200">(tiết kiệm hơn!)</span></div>
                    </div>
                    {/* Button removed as requested */}
                </div>
                <ul className="mt-6 space-y-2 text-base font-medium">
                    <li>🌟 Giảm giá <b>10%</b> trên tổng đơn hàng</li>
                    <li>🎁 Mã giảm giá <b>10%</b></li>
                    <li>⚡ Free rush booking</li>
                    <li>📩 Thư mời tham gia workshop</li>
                </ul>
                <div className="mt-4 text-sm opacity-90 italic">
                    Trở thành thành viên <b>Ultimated</b> để nhận ưu đãi độc quyền và trải nghiệm dịch vụ tốt nhất!
                </div>
            </div>
        </div>
    )

}