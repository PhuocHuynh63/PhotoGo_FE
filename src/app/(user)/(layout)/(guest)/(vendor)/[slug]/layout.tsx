import VendorDetailLayoutPage from "@components/Templates/VendorDetailLayout";
import { authOptions } from "@lib/authOptions";
import { VendorContextProvider } from "@lib/vendorContext";
import { IVendorResponse } from "@models/vendor/response.model";
import vendorService from "@services/vendors";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

async function getVendorBySlug(slug: string) {
    return await vendorService.getVendorBySlug(slug);
}

export default async function VendorDetailLayout({
    children,
    params
}: SERVERS.VendorDetailPageProps
) {
    const { slug } = await params;
    const vendor = await getVendorBySlug(slug) as IVendorResponse;
    const session = await getServerSession(authOptions) as METADATA.ISession;

    if (vendor.statusCode !== 200 || !vendor.data) {
        return notFound();
    }

    const studioData = {
        id: 1,
        name: "Tony Wedding",
        logo: "https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-6/326270028_551076800292757_5486219224858901364_n.png?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHfbXEAo58IWIrVD-jk5ZhsQ40zOgiA5wxDjTM6CIDnDApHKRR7FC5IJaqFe7ZlURwYzIhXbCao1leSItTrTdze&_nc_ohc=9VyzPlmF7QMQ7kNvwGjHRD1&_nc_oc=AdkHnmQvMTRv26eeS1Zf7OwziR4vwUmhuWceCeMwXGpSKCk4EqHKW64pM9uACk4Jtsk&_nc_zt=23&_nc_ht=scontent.fsgn5-8.fna&_nc_gid=YyFD-UuHEv-0KnMcJeKmZg&oh=00_AfGHLpyoY8AWwGBUlz2FMmqaDIXN0nbH7to7qByDCDZrHQ&oe=6801D27E",
        coverImage: "https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/486943588_1085840013584545_8123007123664132290_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeEYfY38xQ5tdlDCMPYkCd79UD05TW8vRZ9QPTlNby9Fn_NQcpQL0guOe-CPFiDCaygKd8HSr6A3AHrX_8QKjvxj&_nc_ohc=DDSCtJiSjbgQ7kNvwHmcmKW&_nc_oc=AdlCNW6JBOw5zHZa_8keHsWq17IGaoWEqSe8_5BG8LBCiwi9bjkn8M7qRoym59MbNFk&_nc_zt=23&_nc_ht=scontent.fsgn5-9.fna&_nc_gid=n-N7FwEbhD-4XBkqSwpsBA&oh=00_AfHDBRwNv3shhCQzSt2aYdPs0G4Z4hOjucFficePbPWG7A&oe=68032D65",
        rating: 4.8,
        reviewCount: 128,
        location: {
            address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
            coordinates: {
                lat: 10.772,
                lng: 106.704,
            },
        },
        contact: {
            phone: "+84 123 456 789",
            email: "contact@anhduongstudio.vn",
            website: "www.anhduongstudio.vn",
        },
        socialMedia: {
            facebook: "facebook.com/anhduongstudio",
            instagram: "instagram.com/anhduongstudio",
        },
        businessHours: [
            { day: "Thứ 2 - Thứ 6", hours: "09:00 - 19:00" },
            { day: "Thứ 7 - Chủ nhật", hours: "09:00 - 17:00" },
        ],
        description:
            "Ánh Dương Studio là studio chụp ảnh chuyên nghiệp hàng đầu tại TP. Hồ Chí Minh với hơn 10 năm kinh nghiệm. Chúng tôi chuyên về chụp ảnh cưới, gia đình, thời trang và sự kiện. Với đội ngũ nhiếp ảnh gia tài năng và thiết bị hiện đại, chúng tôi cam kết mang đến những bức ảnh đẹp nhất, lưu giữ những khoảnh khắc quý giá của bạn.",
        tags: [
            "Chụp ảnh cưới",
            "Chụp ảnh gia đình",
            "Chụp ảnh sự kiện",
            "Chụp ảnh thời trang",
            "Studio chụp ảnh",
            "Chụp ảnh kỷ yếu",
            "Make-up chuyên nghiệp",
        ],
        facilities: [
            "Studio rộng 300m²",
            "Phòng thay đồ",
            "Khu vực make-up",
            "Phòng chờ tiện nghi",
            "Wifi miễn phí",
            "Đỗ xe miễn phí",
            "Nước uống miễn phí",
        ],
        team: [
            {
                id: 1,
                name: "Nguyễn Văn A",
                avatar: "/placeholder.svg?height=150&width=150&text=NVA",
                role: "Giám đốc sáng tạo / Nhiếp ảnh gia chính",
                experience: "12 năm kinh nghiệm",
            },
            {
                id: 2,
                name: "Trần Thị B",
                avatar: "/placeholder.svg?height=150&width=150&text=TTB",
                role: "Chuyên gia make-up",
                experience: "8 năm kinh nghiệm",
            },
            {
                id: 3,
                name: "Lê Văn C",
                avatar: "/placeholder.svg?height=150&width=150&text=LVC",
                role: "Nhiếp ảnh gia",
                experience: "7 năm kinh nghiệm",
            },
            {
                id: 4,
                name: "Phạm Thị D",
                avatar: "/placeholder.svg?height=150&width=150&text=PTD",
                role: "Chuyên gia hậu kỳ",
                experience: "6 năm kinh nghiệm",
            },
        ],
        packages: [
            {
                id: 1,
                name: "Gói Chụp Ảnh Cưới Cơ Bản",
                price: "5,000,000đ",
                duration: "4 giờ",
                description: "Gói chụp ảnh cưới cơ bản bao gồm chụp ngoại cảnh tại 1 địa điểm và trang điểm cô dâu.",
                features: [
                    "4 giờ chụp hình",
                    "1 địa điểm chụp",
                    "100 ảnh đã chỉnh sửa",
                    "1 album ảnh 20x30cm",
                    "Trang điểm cô dâu",
                    "Trang phục (2 bộ)",
                    "Hỗ trợ đạo cụ",
                ],
                image: "https://bizweb.dktcdn.net/100/080/968/files/p4-d774994e-6233-4b08-acac-6030ec167697.jpg?v=1691746140498",
                popular: false,
                concept: [
                    {
                        title: "Concept Cưới Hiện Đại",
                        images: [
                            "/placeholder.svg?height=400&width=600&text=Modern Wedding 1",
                            "/placeholder.svg?height=400&width=600&text=Modern Wedding 2",
                            "/placeholder.svg?height=400&width=600&text=Modern Wedding 3",
                        ],
                    },
                ],
            },
            {
                id: 2,
                name: "Combo studio ngày cưới",
                price: "2,800,000đ",
                duration: "",
                description: "Với kinh nghiệm hơn 10 năm trong ngành cưới, Tony sẽ là người bạn đồng hành chia sẻ cho bạn mọi thứ về việc chụp album cưới trọn gói nhé.",
                features: [
                    "3 giờ chụp hình",
                    "1 địa điểm chụp",
                    "80 ảnh đã chỉnh sửa",
                    "1 album ảnh 20x30cm",
                    "Hỗ trợ đạo cụ",
                    "Tư vấn trang phục",
                ],
                image: "https://bizweb.dktcdn.net/100/080/968/files/p4-d774994e-6233-4b08-acac-6030ec167697.jpg?v=1691746140498",
                popular: true,
                concept: [
                    {
                        title: "Concept Gia Đình Hạnh Phúc",
                        images: [
                            "/placeholder.svg?height=400&width=600&text=Happy Family 1",
                            "/placeholder.svg?height=400&width=600&text=Happy Family 2",
                            "/placeholder.svg?height=400&width=600&text=Happy Family 3",
                        ],
                    },
                ],
            },
            {
                id: 3,
                name: "Gói Make-up & Chụp Ảnh Thời Trang",
                price: "3,500,000đ",
                duration: "4 giờ",
                description: "Gói dịch vụ chuyên nghiệp cho các buổi chụp hình thời trang, lookbook với phong cách hiện đại.",
                features: [
                    "4 giờ chụp hình",
                    "2 địa đi��m chụp",
                    "100 ảnh đã chỉnh sửa",
                    "Make-up chuyên nghiệp",
                    "Hỗ trợ stylist",
                    "File ảnh gốc chất lượng cao",
                ],
                image: "/placeholder.svg?height=400&width=600&text=Fashion Package",
                popular: false,
                concept: [
                    {
                        title: "Concept Thời Trang Hiện Đại",
                        images: [
                            "/placeholder.svg?height=400&width=600&text=Fashion 1",
                            "/placeholder.svg?height=400&width=600&text=Fashion 2",
                            "/placeholder.svg?height=400&width=600&text=Fashion 3",
                        ],
                    },
                ],
            },
        ],
        portfolio: {
            categories: ["Tất cả", "Cưới", "Gia đình", "Thời trang", "Sự kiện"],
            items: [
                {
                    id: 1,
                    category: "Cưới",
                    image: "https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/490746666_1228865825911867_4900297125018117728_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeGrBfAn7h3aUhg720mKRbIXIpPjmbAk7Z8ik-OZsCTtn_SyVuKrrq1b0WAqh35wMSGB_lhGpRjjLpqBojoYRq-l&_nc_ohc=vE6HzF81qjkQ7kNvwGVzdPP&_nc_oc=AdmOXFt8hA8SCDG7ynoYpaDC4b4UonMfeRA4HkHzcLkmP9QcExqsVaTJocfS5uBkmSI&_nc_zt=23&_nc_ht=scontent.fsgn5-9.fna&_nc_gid=iF5uHV8OFA_TIrRpTOUQhQ&oh=00_AfH39kXexKGo35ya7nKmwpZ6ta0iCjeVPrphcUqeS2zxYg&oe=6801D569",
                    featured: true,
                },
                {
                    id: 2,
                    category: "Cưới",
                    image: "https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/490329182_1228865772578539_830686916143369937_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeF-U2pzqk3O5C_Pl9agManQOuqHc8aUt8w66odzxpS3zOEXufnXMbvFUJrSKYjL_yNEpQjKLsgi3Y4ncLExSwnP&_nc_ohc=-kvShSZzbOgQ7kNvwHsdieU&_nc_oc=AdmtC2m-15rA6YFo1C0nIQrIRcio2ZsCAaULBgXT-hUNH428_MiJPTQO5_kpZrof0uI&_nc_zt=23&_nc_ht=scontent.fsgn5-10.fna&_nc_gid=qXa5YJ0d3VXyKt9JnL91MA&oh=00_AfHh9_kS84PWmucW-ekMxUA9r5482JNNmr5T4Kw4uFpRkA&oe=6801D51A",
                    featured: true,
                },
                {
                    id: 3,
                    category: "Cưới",
                    image: "https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-6/490458722_1228865805911869_6591599871251392621_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFGWmbHl1QNQ5huOOcouL2CUt5svPy5f_5S3my8_Ll__olggsRxkscTcdXAvI1m60zz2vaMxxe-8PLxJsyZzTci&_nc_ohc=KvF3c8rw6lkQ7kNvwE8NfBu&_nc_oc=AdkJSf4tx2SVTEpedA6KpydeTkNXcSA4XfCQBiKVtV3bR4uzzARSPTUDcGkAW1bUaN0&_nc_zt=23&_nc_ht=scontent.fsgn5-5.fna&_nc_gid=YCq9BW4Ne2aWi34unvUD6w&oh=00_AfFs17_Hiv2zJBgTSjIFJMBqj-5SDxg3Gkn5vndnzzNDyg&oe=6801C937",
                    featured: true,
                },
                {
                    id: 4,
                    title: "Sự kiện công ty ABC",
                    category: "Sự kiện",
                    image: "/placeholder.svg?height=400&width=600&text=Event 1",
                    featured: false,
                },
                {
                    id: 5,
                    title: "Chụp cưới Hội An",
                    category: "Cưới",
                    image: "/placeholder.svg?height=400&width=600&text=Wedding 2",
                    featured: false,
                },
                {
                    id: 6,
                    title: "Thời trang Thu Đông",
                    category: "Thời trang",
                    image: "/placeholder.svg?height=400&width=600&text=Fashion 2",
                    featured: false,
                },
                {
                    id: 7,
                    title: "Gia đình nhà chị Trang",
                    category: "Gia đình",
                    image: "/placeholder.svg?height=400&width=600&text=Family 2",
                    featured: false,
                },
                {
                    id: 8,
                    title: "Lễ khai trương",
                    category: "Sự kiện",
                    image: "/placeholder.svg?height=400&width=600&text=Event 2",
                    featured: false,
                },
            ],
        },
        reviews: [
            {
                id: 1,
                user: {
                    name: "Nguyễn Minh Anh",
                    avatar: "/placeholder.svg?height=60&width=60&text=NMA",
                },
                rating: 5,
                date: "15/04/2023",
                title: "Dịch vụ chụp ảnh cưới tuyệt vời",
                comment:
                    "Tôi rất hài lòng với dịch vụ chụp ảnh cưới tại Ánh Dương Studio. Ekip làm việc chuyên nghiệp, nhiệt tình. Nhiếp ảnh gia rất tâm huyết, tư vấn tận tình và có nhiều ý tưởng sáng tạo. Ảnh cưới của chúng tôi đẹp hơn mong đợi!",
                service: "Gói Chụp Ảnh Cưới Cơ Bản",
                photos: [
                    "https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-6/490698575_1102836111884935_2861881000549557857_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeEdNWuqbs8_S36td5Mf5R_hrKMHzRZQJxmsowfNFlAnGWrO8rZyrfr4_GqdvIShWLjm2Mfx0PzYpTVwAZH4JIEx&_nc_ohc=E1hdVRSX5IEQ7kNvwGAFBYU&_nc_oc=AdmQG0DoS80Qg-ez-XuH8CXWQfqZcodfyrQxLPgqYLW6qbTPZPohC7AyXidYQ2unVKU&_nc_zt=23&_nc_ht=scontent.fsgn5-5.fna&_nc_gid=A17n828TRns8Vz_z81EF2Q&oh=00_AfEs89Dyq1ZXoK8n5HQrKwxnPAUJAWFRfjeFcNgev3FZbQ&oe=680324D4",
                    "https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/491104915_1102836091884937_5720658211719902326_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeHq0_b7GMwN7iMOeqv5XZ1zmPXdoK-dnmOY9d2gr52eY46jqhv5pqbkqtShYXlkMpJx1RJ2Rjc2b_Ys6XvwsrYZ&_nc_ohc=ou8eB8vq7vgQ7kNvwFA-Lon&_nc_oc=Adku6voFfpEqg2PtYC2EfIFLzkj58rttB_M-9loSuxwbskr--ujpUWmMyIY_LcJr9ao&_nc_zt=23&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=47RYZW9aKb2iKvji0A7rkg&oh=00_AfEdEDMZMRTOgCNC4g5rINoaqIM4tLjCOUsEs0ZOuUpuWw&oe=68031DB6",
                ],
            },
            {
                id: 2,
                user: {
                    name: "Trần Hoài Nam",
                    avatar: "/placeholder.svg?height=60&width=60&text=THN",
                },
                rating: 4,
                date: "02/03/2023",
                title: "Ảnh gia đình đáng nhớ",
                comment:
                    "Chúng tôi chụp ảnh gia đình tại Ánh Dương Studio và rất hài lòng với kết quả. Nhiếp ảnh gia biết cách tương tác với trẻ em, giúp bọn trẻ thoải mái và có những khoảnh khắc tự nhiên. Chỉ tiếc là thời gian chờ đợi để nhận ảnh hơi lâu.",
                service: "Gói Chụp Ảnh Gia Đình",
                photos: ["https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/489049169_1098808842287662_9131602266807149425_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFxag8MNsrveCOj2hOCpUFKyuARCfcGB4XK4BEJ9wYHhW4tFA_B7vH3aedoHNVaVzhzIKUWvjQgWWfXjuVifDwC&_nc_ohc=FIjDTKv3sowQ7kNvwGu6U0_&_nc_oc=Adn7Frw98tqfyXR1JWgmBT71B5JET7lp6GLLmN1p0Jlz4DbBTmfBmaOJeVtxVS_84Ps&_nc_zt=23&_nc_ht=scontent.fsgn5-9.fna&_nc_gid=AxTgDRtNrcI3orIrtdweXg&oh=00_AfFIqvB-I0oNGo50V0leDpmr4W4d4oNoSnhB6QTn8EI7bg&oe=680325FC"],
            },
            {
                id: 3,
                user: {
                    name: "Lê Thị Hương",
                    avatar: "/placeholder.svg?height=60&width=60&text=LTH",
                },
                rating: 5,
                date: "18/05/2023",
                title: "Make-up và chụp ảnh thời trang chuyên nghiệp",
                comment:
                    "Dịch vụ make-up và chụp ảnh thời trang của Ánh Dương Studio thực sự chuyên nghiệp. Chuyên gia make-up hiểu rõ khuôn mặt và phong cách của tôi, tạo nên một vẻ ngoài hoàn hảo. Nhiếp ảnh gia có con mắt thẩm mỹ tuyệt vời, hướng dẫn tôi tạo dáng một cách tự nhiên và cuốn hút.",
                service: "Gói Make-up & Chụp Ảnh Thời Trang",
                photos: [
                    "/placeholder.svg?height=200&width=300&text=Review 3.1",
                    "/placeholder.svg?height=200&width=300&text=Review 3.2",
                    "/placeholder.svg?height=200&width=300&text=Review 3.3",
                ],
            },
        ],
        faqs: [
            {
                question: "Cần đặt lịch trước bao lâu?",
                answer:
                    "Chúng tôi khuyến khích đặt lịch trước ít nhất 1-2 tuần để đảm bảo thời gian và chuẩn bị tốt nhất. Đối với chụp ảnh cưới, nên đặt lịch trước 1-2 tháng.",
            },
            {
                question: "Có cần chuẩn bị gì trước khi đến studio?",
                answer:
                    "Tùy thuộc vào loại hình chụp, chúng tôi sẽ tư vấn cụ thể cho từng trường hợp. Thông thường, bạn nên chuẩn bị trang phục (nếu không sử dụng trang phục của studio), phụ kiện cá nhân, và giữ làn da khỏe mạnh trước ngày chụp.",
            },
            {
                question: "Thời gian nhận sản phẩm sau khi chụp?",
                answer:
                    "Thông thường, bạn sẽ nhận được ảnh điện tử sau 3-5 ngày làm việc. Đối với album và ảnh phóng to, thời gian hoàn thiện là 7-10 ngày làm việc sau khi bạn chọn ảnh.",
            },
            {
                question: "Chính sách đổi/hủy lịch chụp?",
                answer:
                    "Bạn có thể đổi lịch chụp ít nhất 48 giờ trước buổi chụp mà không mất phí. Đối với việc hủy lịch, bạn sẽ được hoàn lại 70% tiền cọc nếu thông báo trước 1 tuần.",
            },
        ],
    }

    return (
        <>
            <VendorDetailLayoutPage
                vendor={vendor.data}
                session={session}
            >
                {children}
            </VendorDetailLayoutPage>
        </>
    );
}
