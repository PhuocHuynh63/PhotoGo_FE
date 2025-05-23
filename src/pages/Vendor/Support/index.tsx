"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import SupportFAQ from "@pages/Vendor/Support/SupportFAQ"
import SupportContact from "@pages/Vendor/Support/SupportContact"
import SupportTickets from "@pages/Vendor/Support/SupportTickets"
import UserGuides from "@pages/Vendor/Support/UserGuides"
import Announcements from "@pages/Vendor/Support/Announcements"



export default function SupportPage() {

    const supportData = {
        faqs: [
            {
                id: "faq1",
                question: "Làm thế nào để cập nhật thông tin hồ sơ?",
                answer:
                    "Để cập nhật thông tin hồ sơ, bạn có thể vào trang Hồ sơ và nhấn vào nút Chỉnh sửa ở góc phải. Sau đó, bạn có thể cập nhật thông tin và lưu lại.",
            },
            {
                id: "faq2",
                question: "Làm thế nào để rút tiền từ tài khoản?",
                answer:
                    "Để rút tiền, bạn có thể vào trang Tài chính và nhấn vào nút Rút tiền. Sau đó, bạn cần nhập số tiền muốn rút và thông tin tài khoản ngân hàng của bạn.",
            },
            {
                id: "faq3",
                question: "Làm thế nào để thiết lập lịch làm việc?",
                answer:
                    "Bạn có thể thiết lập lịch làm việc trong phần Cài đặt > Lịch làm việc. Tại đây bạn có thể chọn ngày và giờ làm việc của mình.",
            },
            {
                id: "faq4",
                question: "Làm thế nào để xem báo cáo doanh thu?",
                answer:
                    "Để xem báo cáo doanh thu, bạn có thể vào trang Tài chính > tab Báo cáo. Tại đây bạn có thể xem và tải xuống các báo cáo doanh thu theo tháng.",
            },
            {
                id: "faq5",
                question: "Làm thế nào để xử lý khách hàng hủy lịch?",
                answer:
                    "Khi khách hàng hủy lịch, bạn sẽ nhận được thông báo. Bạn có thể vào trang Lịch hẹn để xem chi tiết và xử lý theo chính sách hoàn tiền của bạn.",
            },
        ],
        tickets: [
            {
                id: "TK-001",
                title: "Không thể cập nhật thông tin hồ sơ",
                category: "Tài khoản",
                status: "Đang xử lý",
                priority: "Trung bình",
                createdAt: "2023-05-20",
                updatedAt: "2023-05-20",
            },
            {
                id: "TK-002",
                title: "Vấn đề về thanh toán",
                category: "Thanh toán",
                status: "Đã xử lý",
                priority: "Cao",
                createdAt: "2023-05-18",
                updatedAt: "2023-05-19",
            },
            {
                id: "TK-003",
                title: "Cần hỗ trợ về tính năng lịch hẹn",
                category: "Lịch hẹn",
                status: "Đã gửi phản hồi",
                priority: "Thấp",
                createdAt: "2023-05-15",
                updatedAt: "2023-05-17",
            },
        ],
        guides: [
            {
                id: "guide1",
                title: "Hướng dẫn thiết lập hồ sơ",
                description: "Tìm hiểu cách thiết lập hồ sơ chuyên nghiệp để thu hút khách hàng",
                category: "Tài khoản",
                fileUrl: "#",
            },
            {
                id: "guide2",
                title: "Hướng dẫn quản lý lịch hẹn",
                description: "Tìm hiểu cách quản lý lịch hẹn một cách hiệu quả để tối ưu hóa thời gian",
                category: "Lịch hẹn",
                fileUrl: "#",
            },
            {
                id: "guide3",
                title: "Hướng dẫn quản lý tài chính",
                description: "Tìm hiểu cách quản lý tài chính, theo dõi doanh thu và xuất báo cáo",
                category: "Tài chính",
                fileUrl: "#",
            },
            {
                id: "guide4",
                title: "Hướng dẫn marketing trên nền tảng",
                description: "Tìm hiểu cách quảng bá dịch vụ của bạn hiệu quả trên nền tảng để thu hút khách hàng",
                category: "Marketing",
                fileUrl: "#",
            },
        ],
        announcements: [
            {
                id: "ann1",
                title: "Cập nhật tính năng mới: Thông kê chi tiết",
                content:
                    "Chúng tôi vừa ra mắt tính năng thống kê chi tiết mới, giúp bạn phân tích tình hình doanh thu và hiệu suất kinh doanh tốt hơn. Tính năng này có sẵn trong mục Thống kê.",
                type: "Mới",
                date: "2023-05-22",
            },
            {
                id: "ann2",
                title: "Bảo trì hệ thống vào ngày 30/03/2025",
                content:
                    "Hệ thống sẽ được bảo trì từ 23:00 ngày 30/03/2025 đến 05:00 ngày 31/03/2025. Trong thời gian này, bạn sẽ không thể truy cập vào hệ thống. Chúng tôi xin lỗi vì sự bất tiện này.",
                type: "Mới",
                date: "2023-05-20",
            },
            {
                id: "ann3",
                title: "Chính sách thanh toán mới",
                content:
                    "Từ ngày 01/04/2025, chúng tôi sẽ áp dụng chính sách thanh toán mới. Thay vì 7 ngày, bạn sẽ có 24 giờ sau khi hoàn thành dịch vụ để nhận thanh toán từ khách hàng.",
                type: "",
                date: "2023-05-18",
            },
        ],
    }

    return (

        <div className="mt-4">
            <h2 className="text-xl font-semibold">Trung tâm hỗ trợ</h2>
            <p className="text-sm text-gray-500">Trung tâm hỗ trợ và câu hỏi thường gặp</p>

            <Tabs defaultValue="faq" className="mt-6">
                <TabsList>
                    <TabsTrigger value="faq">Câu hỏi thường gặp</TabsTrigger>
                    <TabsTrigger value="tickets">Yêu cầu hỗ trợ của tôi</TabsTrigger>
                    <TabsTrigger value="guides">Hướng dẫn sử dụng</TabsTrigger>
                    <TabsTrigger value="news">Thông báo</TabsTrigger>
                </TabsList>

                <TabsContent value="faq" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <SupportFAQ faqs={supportData.faqs} />
                        </div>
                        <div>
                            <SupportContact />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="tickets">
                    <SupportTickets tickets={supportData.tickets} />
                </TabsContent>

                <TabsContent value="guides">
                    <UserGuides guides={supportData.guides} />
                </TabsContent>

                <TabsContent value="news">
                    <Announcements announcements={supportData.announcements} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
