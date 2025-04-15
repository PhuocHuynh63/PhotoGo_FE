'use client'
import Button from "@components/Atoms/Button";
import Left from "../Left/Filter";
import Right from "../Right/Results";
import SearchPackage from "../SearchPackage";
import Search from "@components/Molecules/Search/Search";

export default function SearchVendor() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Tìm kiếm dịch vụ</h1>

        <div className="mb-6 flex items-center gap-2">
          <div className="flex-1">
            <Search placeholder="Tìm kiếm dịch vụ"  searchWidth=""/>
          </div>
          <div className="flex items-center">
            <button className="flex items-center gap-1 px-3 py-2 border rounded-md bg-white">

              <span className="text-sm">Bộ lọc</span>
            </button>
          </div>
          <Button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium">Tìm kiếm</Button>
        </div>

        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm">
          <Left />
          <Right />
        </div>
      </div>
    </div>
  )
}
