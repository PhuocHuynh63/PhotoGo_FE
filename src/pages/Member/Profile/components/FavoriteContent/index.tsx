import Button from "@components/Atoms/Button";
import { Card } from "@components/Atoms/Card";
import { Heart, Star } from "lucide-react";

export default function FavoritesContent(/*{ favorites }*/) {
    const favorites = [{
        id: 1,
        name: "Sản phẩm 1",
        image: "/placeholder.svg",
        price: 100,
        rating: 4.5,
        vendor: 'nhà cung cấp 1',
        reviews: 10,
        createdAt: "2023-01-01",
        updatedAt: "2023-01-01",
    },
    {
        id: 2,
        name: "Sản phẩm 2",
        image: "/placeholder.svg",
        price: 200,
        rating: 4.0,
        vendor: 'nhà cung cấp 1',
        reviews: 5,
        createdAt: "23-01-01",
        updatedAt: "2023-01-01",
    }]
    return (
        <>
            <h1 className="text-2xl font-bold mb-6">Danh sách yêu thích</h1>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                        <div className="relative h-40">
                            <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                            <Button
                                variant="ghost"
                                className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white text-red-500"
                            >
                                <Heart className="h-4 w-4 fill-current" />
                            </Button>
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium line-clamp-1">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.vendor}</p>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="text-sm ml-1">{item.rating}</span>
                                </div>
                                <p className="font-medium">{item.price.toLocaleString()}đ</p>
                            </div>
                            <Button className="w-full mt-3">
                                Xem chi tiết
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    )
}