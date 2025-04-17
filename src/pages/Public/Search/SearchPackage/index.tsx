"use client"

import { useState } from "react"
import { SearchInput } from "@components/Molecules/Filter/Search-input"

export default function SearchPackage() {
  const [searchQuery, setSearchQuery] = useState("")
  return (
    <div className="  w-full">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
      </div>
      <SearchInput placeholder="Tìm kiếm dịch vụ" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

    </div>
  )
}
