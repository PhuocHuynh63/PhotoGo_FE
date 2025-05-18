"use client"

import { Button } from "@components/Atoms/ui/button"
import { FileIcon } from "lucide-react"


interface Document {
    id: number
    name: string
    type: string
}

interface ProfileDocumentsProps {
    documents: Document[]
}

export default function ProfileDocuments({ documents }: ProfileDocumentsProps) {
    return (
        <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Tài liệu xác minh</h3>

            <div className="grid grid-cols-3 gap-4">
                {documents?.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium mb-1">{doc?.name}</h4>
                        <p className="text-xs text-gray-500 mb-4">Đã xác minh</p>

                        <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                            <FileIcon className="w-10 h-10 text-gray-400" />
                        </div>

                        <Button variant="outline" size="sm" className="w-full">
                            Xem
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
