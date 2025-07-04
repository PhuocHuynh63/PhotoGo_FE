"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import { Calendar, CheckCircle, Clock } from "lucide-react"
import React from "react"

interface ProofFilterTabsProps {
    filter: "all" | "needs_proof" | "has_proof";
    setFilter: (value: "all" | "needs_proof" | "has_proof") => void;
    needsProofCount: number;
    hasProofCount: number;
    children: React.ReactNode;
}

export default function ProofFilterTabs({ filter, setFilter, needsProofCount, hasProofCount, children }: ProofFilterTabsProps) {
    return (
        <Tabs value={filter} onValueChange={(value: string) => setFilter(value as "all" | "needs_proof" | "has_proof")} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="needs_proof" className="flex items-center gap-2 cursor-pointer">
                    <Clock className="h-4 w-4" />
                    Cần upload ({needsProofCount})
                </TabsTrigger>
                <TabsTrigger value="has_proof" className="flex items-center gap-2 cursor-pointer">
                    <CheckCircle className="h-4 w-4" />
                    Đã có bằng chứng ({hasProofCount})
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center gap-2 cursor-pointer">
                    <Calendar className="h-4 w-4" />
                    Tất cả ({needsProofCount + hasProofCount})
                </TabsTrigger>
            </TabsList>
            <TabsContent value={filter} className="space-y-4">
                {children}
            </TabsContent>
        </Tabs>
    )
} 