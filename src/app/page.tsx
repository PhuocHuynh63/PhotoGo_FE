'use client'
import { useState } from "react";
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

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [selected, setSelected] = useState("a");
  const [selectedArray, setSelectedArray] = useState(["a", "b"]);
  const [gender, setGender] = useState('male');
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="flex flex-col gap-4">
        <Label fontSize={14} htmlFor="username">Username</Label>
        <Input id="username" placeholder="Enter your username" />
        <div className="flex gap-4 flex-col">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            placeholder="Enter password"
            icon="Lock"
            iconPosition="left"
            togglePassword
            leftIconColor="green"
            rightIconColor="red"
            iconSize={20}
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

        <CircularProgress value={70} direction="clockwise" />
        <CircularProgress value={40} direction="counter-clockwise" />

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



      </div>
    </div>
  );
}