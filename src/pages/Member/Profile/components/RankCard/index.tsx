// components/Rewards/RankCard.tsx
import Button from "@components/Atoms/Button";
import React from "react";
import Skeleton from "@components/Atoms/Skeleton";


interface RankCardProps {
    level: {
        level: number;
        name: string;
        gradient: string | undefined;
        current: boolean;
        spentGoal: number;
        spentVND: string;
        orderGoal: number;
        deadline: string;
        reward: string;
        description: string;
        btnText?: string;
    };
}

const RankCard: React.FC<{ level: RankCardProps["level"] }> = ({ level }) => {
    if (!level) {
        return <Skeleton className="w-full h-full" />;
    }
    return (
        <div className={`flex flex-col rounded-lg overflow-hidden bg-white shadow-lg ${level.current ? "border-2 border-primary" : ""}`}>
            <div className={`bg-gradient-to-tl ${level.gradient} p-4 text-white shadow-inner backdrop-brightness-105`}>
                <div className="flex items-center">
                    <div className="bg-white/20 rounded-md px-2 py-1 text-xs">Lv. {level.level}</div>
                    {level.current && <div className="ml-2 text-sm">Hạng hiện tại</div>}
                </div>
                <h3 className="text-2xl font-bold mt-4">{level.name}</h3>
                <p className="mt-2 text-sm leading-snug">
                    Chi tiêu US$ {level.spentGoal.toFixed(2)} (khoảng {level.spentVND}đ) hoặc hoàn thành {level.orderGoal} đơn hàng trước {level.deadline}
                </p>
            </div>
            <div className="p-4">
                <p className="text-sm mb-2">{level.description}</p>
                {level.btnText ? (<Button className="mt-2 hover:animate-pulse duration-300 transition-all text-white py-2 px-4 rounded">{level.btnText}</Button>) : ""}
                <div className="mt-2 text-lg font-bold">{level.reward}</div>
                <p className="text-xs">Gói Khởi Động</p>
                <p className="text-xs">Đặt 0/{level.orderGoal} đơn hoặc chi tiêu 0.00/US${level.spentGoal.toFixed(2)}</p>
            </div>
        </div>
    );
};
export default RankCard;