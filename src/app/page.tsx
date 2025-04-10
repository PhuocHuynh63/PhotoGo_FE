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

function generateMockUsers(count: number) {
  const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ"];
  const middleNames = ["Văn", "Thị", "Hữu", "Đức", "Minh", "Ngọc", "Thanh", "Quốc"];
  const lastNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"];

  const roles = ["Admin", "User", "Manager"];
  const departments = ["IT", "HR", "Sales", "Marketing", "Finance"];
  const statuses = ["active", "inactive"];

  const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const getRandomPhone = () => "0" + Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join("");
  const getRandomDate = () => {
    const start = new Date(2024, 2, 1); // 2024-03-01
    const end = new Date(2024, 2, 31); // 2024-03-31
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0]; // yyyy-mm-dd
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
}

const data = generateMockUsers(7320);
const columns = [
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
    render: (row: any) => (
      <span className={`px-2 py-1 rounded-full text-xs ${row.status === 'active'
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
        }`}>
        {row.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
      </span>
    ),
    sortable: true
  },
  {
    key: 'createdAt',
    header: 'Ngày tạo',
    render: (row: any) => new Date(row.createdAt).toLocaleDateString('vi-VN'),
    sortable: true
  }
];

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [selected, setSelected] = useState("photo");
  const [selectedArray, setSelectedArray] = useState(["a", "b"]);
  const [gender, setGender] = useState('male');
  const [value, setValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * 100));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">

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
        <DataTable height={500} width={1400} data={data} columns={columns} selectableRows={true} loading={false} onRowClick={(row) => { console.log(row.id) }} />
      </div>

    </div>
  );
}