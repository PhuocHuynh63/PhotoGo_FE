"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Input } from "@components/Atoms/ui/input"
import { Button } from "@components/Atoms/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/Atoms/ui/accordion"
import { Search, Plus } from "lucide-react"

interface FAQ {
    id: string
    question: string
    answer: string
}

interface SupportFAQProps {
    faqs: FAQ[]
}

export default function SupportFAQ({ faqs }: SupportFAQProps) {
    const [searchTerm, setSearchTerm] = useState("")

    // Lọc câu hỏi theo từ khóa tìm kiếm
    const filteredFAQs = faqs?.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle>Câu hỏi thường gặp</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Tìm kiếm câu hỏi..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {filteredFAQs?.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                        {filteredFAQs?.map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id}>
                                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Không tìm thấy câu hỏi nào phù hợp với từ khóa tìm kiếm</p>
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            <span>Đặt câu hỏi mới</span>
                        </Button>
                    </div>
                )}

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Bạn không tìm thấy câu trả lời?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Nếu bạn không tìm thấy câu trả lời cho câu hỏi của bạn, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.
                        Chúng tôi luôn sẵn sàng giúp đỡ bạn.
                    </p>
                    <Button className="w-full">Liên hệ hỗ trợ</Button>
                </div>
            </CardContent>
        </Card>
    )
}
