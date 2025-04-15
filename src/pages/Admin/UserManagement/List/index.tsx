'use client'

import type React from "react"
import { Trophy, ArrowUpRight } from "lucide-react"
import SummaryCardGroup from "@components/Organisms/SummaryCardGroup"
import { UsersTable } from "@components/Organisms/UserTable"


const userRankStats = [
  {
    title: "Hạng Đồng",
    icon: <Trophy className="h-4 w-4 text-[#cd7f32]" />,
    value: "1,250",
    change: "+5.3%",
    changeColor: "text-emerald-500",
    changeIcon: <ArrowUpRight className="mr-1 h-4 w-4" />,
  },
  {
    title: "Hạng Bạc",
    icon: <Trophy className="h-4 w-4 text-[#C0C0C0]" />,
    value: "980",
    change: "+3.1%",
    changeColor: "text-emerald-500",
    changeIcon: <ArrowUpRight className="mr-1 h-4 w-4" />,
  },
  {
    title: "Hạng Vàng",
    icon: <Trophy className="h-4 w-4 text-[#FFD700]" />,
    value: "720",
    change: "+6.4%",
    changeColor: "text-emerald-500",
    changeIcon: <ArrowUpRight className="mr-1 h-4 w-4" />,
  },
  {
    title: "Hạng Bạch Kim",
    icon: <Trophy className="h-4 w-4 text-[bg-[#d0f0f5]]" />,
    value: "412",
    change: "+2.8%",
    changeColor: "text-emerald-500",
    changeIcon: <ArrowUpRight className="mr-1 h-4 w-4" />,
  },
]

const UserManagementListPage = () => {
  const handleView = (id: string) => {
    // Xử lý khi người dùng nhấn vào "Xem chi tiết"
    console.log("View user:", id);
    // Có thể thêm logic chuyển hướng đến trang chi tiết người dùng
    // router.push(`/admin/user-management/detail/${id}`);
  };

  const handleEdit = (id: string) => {
    // Xử lý khi người dùng nhấn vào "Chỉnh sửa"
    console.log("Edit user:", id);
    // Có thể thêm logic chuyển hướng đến trang chỉnh sửa người dùng
    // router.push(`/admin/user-management/edit/${id}`);
  };

  const handleToggleStatus = (id: string, newStatus: boolean) => {
    // Xử lý khi người dùng nhấn vào "Vô hiệu hóa" hoặc "Kích hoạt"
    console.log("Toggle status for user:", id, "New status:", newStatus);
    // Có thể thêm logic gọi API để cập nhật trạng thái người dùng
    // updateUserStatus(id, newStatus);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý người dùng </h1>
      <SummaryCardGroup data={userRankStats} />
      <UsersTable
        onView={handleView}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  )
}

export default UserManagementListPage
