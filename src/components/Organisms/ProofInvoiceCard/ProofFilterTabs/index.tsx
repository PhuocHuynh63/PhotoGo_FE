"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import { Calendar, CheckCircle, Clock } from "lucide-react"
import React from "react"

interface ProofFilterTabsProps {
    filter: "tất cả" | "chưa upload" | "đã upload";
    setFilter: (value: "tất cả" | "chưa upload" | "đã upload") => void;
    needsProofCount: number;
    hasProofCount: number;
    children: React.ReactNode;
}

export default function ProofFilterTabs({ filter, setFilter, needsProofCount, hasProofCount, children }: ProofFilterTabsProps) {
    return (
        <Tabs value={filter} onValueChange={(value: string) => setFilter(value as "tất cả" | "chưa upload" | "đã upload")} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tất cả" className="flex items-center gap-2 cursor-pointer">
                    <Calendar className="h-4 w-4" />
                    Tất cả ({needsProofCount + hasProofCount})
                </TabsTrigger>
                <TabsTrigger value="chưa upload" className="flex items-center gap-2 cursor-pointer">
                    <Clock className="h-4 w-4" />
                    Cần upload ({needsProofCount})
                </TabsTrigger>
                <TabsTrigger value="đã upload" className="flex items-center gap-2 cursor-pointer">
                    <CheckCircle className="h-4 w-4" />
                    Đã có bằng chứng ({hasProofCount})
                </TabsTrigger>
            </TabsList>
            <TabsContent value={filter} className="space-y-4">
                {children}
            </TabsContent>
        </Tabs>
    )
}