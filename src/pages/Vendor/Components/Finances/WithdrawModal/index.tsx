"use client"

import { useState } from "react"

import { Button } from "@components/Atoms/ui/button"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@components/Atoms/ui/dialog"
import { Input } from "@components/Atoms/ui/input"
import { Label } from "@components/Atoms/ui/label"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@components/Atoms/ui/select"
import toast from "react-hot-toast"
import { Banknote, Maximize } from "lucide-react"

interface BankAccount {
    id: string
    bankName: string
    accountNumber: string
    accountHolder: string
    isPrimary: boolean
}

interface WithdrawModalProps {
    availableBalance: number
    accounts: BankAccount[]
}

export default function WithdrawModal({ availableBalance, accounts }: WithdrawModalProps) {
    const [amount, setAmount] = useState<string>("")
    const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts?.[0]?.id ?? "")

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(value)

    const handleSubmit = async () => {
        const numericAmount = Number(amount.toString().replace(/\D/g, ""))

        if (!numericAmount || numericAmount <= 0) {
            toast.error("Vui lòng nhập số tiền hợp lệ")
            return
        }

        if (numericAmount > availableBalance) {
            toast.error("Số tiền vượt quá số dư khả dụng")
            return
        }
        try {
            // Gửi yêu cầu tới server (API placeholder)
            await fetch("/api/vendor/withdraw", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ accountId: selectedAccountId, amount: numericAmount }),
            })

            toast.success("Yêu cầu rút tiền đã được gửi")
            setAmount("")
        } catch {
            toast.error("Có lỗi xảy ra, vui lòng thử lại")
        }
    }

    // Gợi ý số tiền dựa trên giá trị người dùng nhập
    const suggestions = (() => {
        const base = Number(amount.toString().replace(/\D/g, ""))
        if (!base) return [] as number[]
        const multipliers = [1000, 10000, 100000, 1000000, 10000000, 100000000]
        return multipliers
            .map((m) => base * m)
            .filter((val) => val > 0 && val <= availableBalance && val <= 100_000_000)
            .slice(0, 3)
    })()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer" variant="secondary"> <Banknote className="h-4 w-4" /> Yêu cầu rút tiền</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yêu cầu rút tiền</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Số tiền</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="amount"
                                placeholder="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                type="text"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="whitespace-nowrap cursor-pointer"
                                onClick={() => setAmount(formatCurrency(availableBalance))}
                            >
                                <Maximize className="h-3 w-3" />
                                Tối đa
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Số dư khả dụng: {formatCurrency(availableBalance)}
                        </p>

                        {suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {suggestions.map((s) => (
                                    <Button
                                        key={s}
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="border border-dashed cursor-pointer"
                                        onClick={() => setAmount(formatCurrency(s))}
                                    >
                                        {formatCurrency(s)}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="account">Tài khoản nhận</Label>
                        <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                            <SelectTrigger id="account">
                                <SelectValue placeholder="Chọn tài khoản" />
                            </SelectTrigger>
                            <SelectContent>
                                {accounts?.map((acc) => (
                                    <SelectItem key={acc.id} value={acc.id}>
                                        {acc.bankName} - {acc.accountNumber}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="pt-4">
                    <DialogClose asChild>
                        <Button className="cursor-pointer" variant="ghost">Hủy</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} className="cursor-pointer">Gửi yêu cầu</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 