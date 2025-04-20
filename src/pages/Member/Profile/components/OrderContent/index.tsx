import Button from "@components/Atoms/Button";
import { Card } from "@components/Atoms/Card";
import { Badge } from "lucide-react";

export default function OrdersContent(/*{ orders }*/) {
    const orders = [{
        id: 1,
        service: "Dịch vụ 1",
        status: "Đang xử lý",
        total: 100000,
        vendor: "Nhà cung cấp 1",
        createdAt: "2023-01-01",
        updatedAt: "2023-01-01",
    },
    {
        id: 2,
        service: "Dịch vụ 2",
        status: "Đã hoàn thành",
        total: 200000,
        vendor: "Nhà cung cấp 1",
        createdAt: "2023-01-01",
        updatedAt: "2023-01-01",
    }
    ]
    return (
        <>
            <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                        <div className="bg-gray-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{order.service}</h3>
                                    <Badge
                                        className={`${
                                            order.status === "Hoàn thành" ? "text-green-500 border-green-200" : ""
                                        }`}
                                    >
                                        {order.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{order.vendor}</p>
                            </div>
                            <div className="mt-2 sm:mt-0 text-right">
                                <p className="text-sm text-gray-500">
                                    {order.id} • {order.createdAt}
                                </p>
                                <p className="font-medium">{order.total.toLocaleString()}đ</p>
                            </div>
                        </div>
                        <div className="p-4 border-t flex justify-end gap-2">
                            <Button variant="outline">
                                Xem chi tiết
                            </Button>
                            {order.status === "Hoàn thành" && (
                                <Button variant="outline">
                                    Đánh giá
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </>
    )
}