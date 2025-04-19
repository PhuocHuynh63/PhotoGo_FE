'use client'

import { useState, useEffect } from "react"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@atoms/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@atoms/ui/form"
import { Input } from "@atoms/ui/input"
import { Button } from "@atoms/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@atoms/ui/select"
import { useToast } from "@atoms/ui/use-toast"
import { Textarea } from "@atoms/ui/textarea"
import TipTapEditor from "@components/Organisms/TipTapEditor"
import type { User } from "@pages/Admin/UserManagement/Customer"

// Schema validation cho form
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phoneNumber: z
    .string()
    .regex(/^0\d{9}$/, { message: "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10 số)" }),
  status: z.enum(["active", "inactive"]),
  rank: z.enum(["bronze", "silver", "gold", "diamond", "platinum"]),
  subscription: z.enum(["free", "premium", "pro"]),
  note: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddUser: (
    user: Omit<User, "id" | "avatar" | "createdAt" | "bookingCount" | "totalSpent" | "lastActive" | "auth">,
  ) => void
}

export default function AddUserDialog({ open, onOpenChange, onAddUser }: AddUserDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Khởi tạo form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      status: "active",
      rank: "bronze",
      subscription: "free",
      note: "",
    },
  })

  // Reset form khi dialog đóng
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  // Xử lý khi submit form
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)

    try {
      // Giả lập gọi API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Gọi callback để thêm user mới
      onAddUser({
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        status: values.status,
        rank: values.rank,
        subscription: values.subscription,
        note: values.note || "",
      })

      // Hiển thị thông báo thành công
      toast({
        title: "Thêm người dùng thành công",
        description: `Đã thêm người dùng ${values.fullName}`,
      })

      // Đóng dialog và reset form
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi thêm người dùng",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-bold text-blue-600">Thêm người dùng mới</DialogTitle>
          <DialogDescription>Nhập thông tin người dùng mới vào form bên dưới</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hạng</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn hạng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bronze">Đồng</SelectItem>
                        <SelectItem value="silver">Bạc</SelectItem>
                        <SelectItem value="gold">Vàng</SelectItem>
                        <SelectItem value="diamond">Kim cương</SelectItem>
                        <SelectItem value="platinum">Bạch kim</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subscription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gói dịch vụ</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn gói dịch vụ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="free">Miễn phí</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <TipTapEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Nhập ghi chú về người dùng này..."
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang thêm..." : "Thêm người dùng"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
