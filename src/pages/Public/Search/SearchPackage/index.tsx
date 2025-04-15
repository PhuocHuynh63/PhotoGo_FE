"use client"

import { useState } from "react"
import { Search } from "lucide-react"

export default function SearchPackage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        placeholder="Tìm kiếm theo tên, dịch vụ, địa điểm..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}
