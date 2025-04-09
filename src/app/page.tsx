'use client'
import { useState } from "react";
import Button from "@/components/Atoms/Button";
import ClearButton from "@/components/Atoms/ClearButton";
import CustomDatePicker from "@/components/Atoms/DatePicker";
import Input from "@/components/Atoms/Input";
import Label from "@/components/Atoms/Label";
import Select from "@/components/Atoms/Select";
import TextArea from "@/components/Atoms/TextArea";
import TimePicker from "@/components/Atoms/TimePicker";
import Checkbox from "@/components/Atoms/Checkbox";
import RadioButtonGroup from "@/components/Atoms/RadioButton";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [gender, setGender] = useState('male');
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="flex flex-col gap-4">
        <Label fontSize={14} htmlFor="username">Username</Label>
        <Input id="username" placeholder="Enter your username" />
        <div className="flex gap-4 flex-col">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter your password" />
        </div>
        <div className="flex gap-32 flex-row">
          <Button width={120} height={50} icon="AArrowDownIcon" iconPosition="right">
            Button
          </Button>
          <ClearButton width={120} height={50}>ClearButton
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

        <TimePicker placeholder="Select time" value={selectedDate} onChange={(date) => {
          if (date) setSelectedDate(date);
        }} />

        <Checkbox label="Accept terms and conditions" />
        <RadioButtonGroup name="gender" options={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }]} value={gender} onChange={(value) => { if (value) setGender(value) }} />

        <TextArea placeholder="Enter your message" fontSize={16} maxLength={1000} resize={"both"} width={340} height={50} />
      </div>
    </div>
  );
}