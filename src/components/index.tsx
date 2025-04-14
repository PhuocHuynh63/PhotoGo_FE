'use client'
import { useEffect, useState } from "react";
import Button from "@/components/Atoms/Button";
import ClearButton from "@/components/Atoms/ClearButton";
import CustomDatePicker from "@/components/Atoms/DatePicker";
import Input from "@/components/Atoms/Input";
import Label from "@/components/Atoms/Label";
import Select from "@/components/Atoms/Select";
import TextArea from "@/components/Atoms/TextArea";
import Checkbox from "@/components/Atoms/Checkbox";
import RadioButtonGroup from "@/components/Atoms/RadioButton";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/Atoms/Card";
import { Progress } from "@/components/Atoms/ProgressBar";
import Skeleton from "@/components/Atoms/Skeleton";
import CircularProgress from "@/components/Atoms/CircularProgress";
import { ToggleGroup, ToggleGroupItem } from "@components/Atoms/Toggle-group";
import Pagination from "@components/Organisms/Pagination/Pagination";
import Table from "@components/Organisms/Table/Table";
import TableRow from "@components/Molecules/TableRow/TableRow";

import TableHeader from "@components/Molecules/TableHeader/TableHeader";
import TableCell from "@components/Atoms/TableCell/TableCell";
import TableBody from "@components/Molecules/TableBody/TableBody";
import TableCaption from "@components/Atoms/TableCaption/TableCaption";
import TableHead from "@components/Atoms/TableHeader/TableHeader";
import { DataTable } from "@components/Organisms/DataTable/DataTable";
import Search from "@components/Molecules/Search/Search";
import Header from "@components/Organisms/Header";
import { Avatar } from "@components/Molecules/Avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/Molecules/DropdownMenu";

// import Image from "next/image";

interface User extends ICOMPONENTS.SortableRecord {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    phone: string;
    department: string;
}

const generateMockUsers = (count: number): User[] => {
    const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ"];
    const middleNames = ["Văn", "Thị", "Hữu", "Đức", "Minh", "Ngọc", "Thanh", "Quốc"];
    const lastNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"];

    const roles = ["Admin", "User", "Manager"];
    const departments = ["IT", "HR", "Sales", "Marketing", "Finance"];
    const statuses = ["active", "inactive"];

    const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const getRandomPhone = () => "0" + Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join("");
    const getRandomDate = () => {
        const start = new Date(2024, 2, 1);
        const end = new Date(2024, 2, 31);
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return date.toISOString().split('T')[0];
    };

    return Array.from({ length: count }, (_, i) => {
        const first = getRandomItem(firstNames);
        const middle = getRandomItem(middleNames);
        const last = getRandomItem(lastNames);
        const fullName = `${first} ${middle} ${last}`;
        const email = `${first.toLowerCase()}${last.toLowerCase()}${i}@gmail.com`;

        return {
            id: i + 1,
            name: fullName,
            email,
            role: getRandomItem(roles),
            status: getRandomItem(statuses),
            createdAt: getRandomDate(),
            phone: getRandomPhone(),
            department: getRandomItem(departments)
        };
    });
};

const mockData = generateMockUsers(7320);

const columns: ICOMPONENTS.DataTableProps<User>["columns"] = [
    {
        key: 'name',
        header: 'Tên',
    },
    {
        key: 'email',
        header: 'Email',
    },
    {
        key: 'phone',
        header: 'Số điện thoại',
    },
    {
        key: 'department',
        header: 'Phòng ban',
    },
    {
        key: 'role',
        header: 'Vai trò',
    },
    {
        key: 'status',
        header: 'Trạng thái',
        render: (item: User) => (
            <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {item.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
            </span>
        ),
        sortable: true
    },
    {
        key: 'createdAt',
        header: 'Ngày tạo',
        render: (item: User) => new Date(item.createdAt).toLocaleDateString('vi-VN'),
        sortable: true
    }
];


const carouselItems: ICOMPONENTS.CarouselItem[] = [
    {
        id: 1,
        image: 'https://static-images.vnncdn.net/vps_images_publish/000001/000003/2025/1/20/ngan-ngam-thay-ca-si-jack-j97-72911.jpg?width=0&s=OQaz1tZ-7uFLA8UTXffWFQ',
        title: 'Beautiful Landscape',
        description: 'A stunning view of the mountains',
        backgroundColor: "bg-blue-500"
    },
    {
        id: 2,
        image: 'https://cdn.tcdulichtphcm.vn/upload/4-2024/images/2024-11-11/1731317465-hnlh3081-copy.jpg',
        title: 'City Life',
        description: 'Urban architecture at its finest',
        backgroundColor: "bg-red-500"
    },
    {
        id: 3,
        image: 'https://thanhnien.mediacdn.vn/Uploaded/haoph/2021_10_21/jack-va-thien-an-5805.jpeg',
        title: 'Beach Sunset',
        description: 'Perfect evening by the ocean',
        backgroundColor: "bg-green-500"
    },
    {
        id: 4,
        image: 'https://nld.mediacdn.vn/thumb_w/698/291774122806476800/2021/8/10/jack01gtpf-1-16286070458251002756678.jpg',
        title: 'Mountain View',
        description: 'A breathtaking view of the mountains',
        backgroundColor: "bg-blue-500"
    },
];

// const carouselItems: ICOMPONENTS.CarouselItem[] = [
//     {
//         id: 1,
//         title: "Card 1",
//         description: "This is card 1",
//         backgroundColor: "bg-blue-500"
//     },
//     {
//         id: 2,
//         title: "Card 2",
//         description: "This is card 2",
//         backgroundColor: "bg-red-500"
//     },
//     {
//         id: 3,
//         title: "Card 3",
//         description: "This is card 3",
//         backgroundColor: "bg-green-500"
//     }
// ];

const customRenderItem = (item: typeof carouselItems[0]) => (
    <div className={`w-full h-full ${item.backgroundColor} rounded-lg p-6 flex flex-col items-center justify-center`}>
        <div className="mt-6 flex gap-4">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        </div>
        <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-4">{item.title}</h2>
            <p className="text-white/90">{item.description}</p>
        </div>


    </div>
);

export default function Home() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [selected, setSelected] = useState("photo");
    const [selectedArray, setSelectedArray] = useState(["a", "b"]);
    const [gender, setGender] = useState('male');
    const [value, setValue] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [data] = useState<User[]>(mockData);

    const handleChange = (value: string) => {
        setSearchValue(value)
    }

    const handleSearch = (value: string) => {
        console.log(value)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setValue(Math.floor(Math.random() * 100));
        }, 4000);

        return () => clearInterval(interval);
    }, []);


    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">

            <Header />

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

            <div className="flex flex-col gap-4">
                <Label fontSize={14} htmlFor="username">Username</Label>
                <Input id="username" placeholder="Enter your username" icon="User" />
                <div className="flex gap-4 flex-col">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        type="password"
                        placeholder="Enter password"
                        icon="Lock"
                        togglePassword
                        leftIconColor="green"
                        rightIconColor="red"
                    />

                </div>
                <div className="flex gap-32 flex-row">
                    <Button width={120} height={50} icon="AArrowDownIcon" iconPosition="right">
                        Button
                    </Button>
                    <ClearButton width={120} height={50}>
                        ClearButton
                    </ClearButton>
                </div>

                <Select
                    label="Choose role"
                    width={250}
                    height={40}
                    fontSize={16}
                    defaultValue=""
                    options={["Admin", "User"]}
                />

                <CustomDatePicker
                    placeholder="Select date"
                    value={selectedDate}
                    onChange={(date) => {
                        if (date) setSelectedDate(date);
                    }}
                />

                {/* <Calendar /> */}
                <Checkbox
                    label="Tôi đồng ý với điều khoản"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <RadioButtonGroup name="gender" options={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }]} value={gender} onChange={(value) => { if (value) setGender(value) }} />
                <div className="p-4 border rounded-md space-y-3">

                    <Skeleton count={4} height={24} width={200} backgroundColor="var(--bg-skeleton)" />

                </div>

                <TextArea placeholder="Enter your message" fontSize={16} maxLength={1000} resize={"both"} width={340} height={50} />

                <Card width={400} height="auto" className="bg-white shadow-md">
                    <CardHeader>
                        <CardTitle fontSize={24}>Thông tin người dùng</CardTitle>
                        <CardDescription fontSize={14}>Chi tiết về tài khoản</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">Tên: Nguyễn Văn A</p>
                        <p className="text-sm">Email: nguyenvana@gmail.com</p>
                    </CardContent>
                    <CardFooter className="justify-end">
                        <button type="button" className="text-primary cursor-pointer" >Chỉnh sửa</button>
                    </CardFooter>
                </Card>

                <Progress value={60} width={300} height={10} color="blue" backgroundColor="var(--bg-progress)" />

                <CircularProgress value={value} direction="clockwise" />
                <CircularProgress value={value + 10} direction="counter-clockwise" />


                <div className="flex flex-col gap-4">
                    <ToggleGroup type="single" variant="outline" size="sm" value={selected} onValueChange={setSelected}>
                        <ToggleGroupItem value="photo">Photo</ToggleGroupItem>
                        <ToggleGroupItem value="makeup">Makeup</ToggleGroupItem>
                        <ToggleGroupItem value="studio">Studio</ToggleGroupItem>
                    </ToggleGroup>

                    <ToggleGroup
                        value={selectedArray}
                        onValueChange={setSelectedArray}
                    >
                        <ToggleGroupItem value="a">A</ToggleGroupItem>
                        <ToggleGroupItem value="b">B</ToggleGroupItem>
                    </ToggleGroup>


                </div>
                <Table>
                    <TableCaption>Danh sách người dùng</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên</TableHead>
                            <TableHead>Email</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Nguyễn Văn A</TableCell>
                            <TableCell>nguyenvana@example.com</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Pagination
                    total={10}
                    current={currentPage}
                    onChange={(page) => {
                        console.log(page)
                        setCurrentPage(page);
                    }}
                />
            </div>

            <div className="flex flex-col gap-4">
                <DataTable
                    height={500}
                    width={1400}
                    data={data}
                    columns={columns}
                    selectableRows={true}
                    loading={false}
                    searchable={true}
                    searchPlaceholder="Tìm kiếm..."
                    searchBy={["name"]}
                    searchPosition="right"
                    onRowClick={(row) => { console.log(row.id) }} />
            </div>

            <div className="mt-6">
                <Search
                    value={searchValue}
                    onChange={handleChange}
                    onSearch={handleSearch}
                    placeholder="Tìm kiếm..."
                    debounceTime={700}
                    totalResults={10}
                    searchWidth="300px"
                    className="max-w-md"
                />
            </div>
            {/* <Carousel
                className="w-full max-w-4xl mx-auto"
                options={{ loop: true }}
                autoScroll
                speed={3000}
            >
                {[
                    "https://static-images.vnncdn.net/vps_images_publish/000001/000003/2025/1/20/ngan-ngam-thay-ca-si-jack-j97-72911.jpg?width=0&s=OQaz1tZ-7uFLA8UTXffWFQ",
                    "https://thanhnien.mediacdn.vn/Uploaded/haoph/2021_10_21/jack-va-thien-an-5805.jpeg",
                    "https://cdn.tcdulichtphcm.vn/upload/4-2024/images/2024-11-11/1731317465-hnlh3081-copy.jpg",
                    "https://kenh14cdn.com/203336854389633024/2023/1/11/photo-3-1673436433884550875846.jpg",
                    "https://nld.mediacdn.vn/thumb_w/698/291774122806476800/2021/8/10/jack01gtpf-1-16286070458251002756678.jpg"
                ].map((imageUrl, index) => (
                    <div
                        key={index}
                        className="min-w-[300px] h-[400px] mx-2 rounded overflow-hidden"
                    >
                        <img
                            width={300}
                            height={400}
                            src={imageUrl}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </Carousel> */}
            {/* <Carousel
                items={carouselItems}
                autoScroll={true}
                width={800}
                height={400}
            /> */}

        </div>
    );
}