import Button from "@/components/Atoms/Button";
import ClearButton from "@/components/Atoms/ClearButton";
import Input from "@/components/Atoms/Input";
import Label from "@/components/Atoms/Label";
import Select from "@/components/Atoms/Select";
// import LucideIcon from "@/components/Atoms/LucideIcon";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="flex flex-col gap-4">
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="Enter your username" />
        <div className="flex gap-4 flex-col">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter your password" />
        </div>
        <div className="flex gap-32 flex-row">
          <Button width={120} height={50} icon="Check" iconPosition="right">
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
        >
          <option value="" disabled>-- Select role --</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </Select>
      </div>
    </div>
  );
}
