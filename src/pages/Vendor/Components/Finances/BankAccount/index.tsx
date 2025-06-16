"use client"

import { useState } from "react"

import { CreditCard, Plus, Copy, Check, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"
import WithdrawModal from "@pages/Vendor/Components/Finances/WithdrawModal"

interface BankAccount {
    id: string
    bankName: string
    accountNumber: string
    accountHolder: string
    isPrimary: boolean
}

interface BankAccountsProps {
    accounts: BankAccount[]
    availableBalance: number
}

export default function BankAccounts({ accounts, availableBalance }: BankAccountsProps) {
    const [copied, setCopied] = useState<string | null>(null)

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Thông tin tài khoản ngân hàng</CardTitle>
                <div className="flex gap-2">
                    <WithdrawModal availableBalance={availableBalance} accounts={accounts} />
                    <Button variant="ghost" size="sm" className="h-8 gap-1 cursor-pointer">
                        <Plus className="h-4 w-4" />
                        <span>Gắn thẻ</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {accounts?.map((account) => (
                    <div key={account.id} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-gray-500" />
                                <span className="font-medium">{account.bankName}</span>
                            </div>
                            <div className="text-sm text-gray-500">Chủ tài khoản</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-medium">{account.accountNumber}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 cursor-pointer"
                                    onClick={() => copyToClipboard(account.accountNumber, `${account.id}-number`)}
                                >
                                    {copied === `${account.id}-number` ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4 text-gray-500" />
                                    )}
                                </Button>
                            </div>
                            <div className="text-lg font-medium">{account.accountHolder}</div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-center gap-1 text-sm text-blue-600">
                            <ExternalLink className="h-4 w-4 flex-shrink-0" />
                            <span>Truy xuất từ lịch sử giao dịch để đối soát với tài khoản ngân hàng của bạn trong tháng này</span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
