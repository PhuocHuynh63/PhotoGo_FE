import Left from "../Left/Filter";
import Right from "../Right/Results";
import SearchPackage from "../SearchPackage";

export default function SearchVendor() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Tìm kiếm dịch vụ</h1>

        <div className="mb-6 flex items-center gap-2">
          <div className="flex-1">
            <SearchPackage />
          </div>
          <div className="flex items-center">
            <button className="flex items-center gap-1 px-3 py-2 border rounded-md bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-sliders-horizontal"
              >
                <line x1="21" x2="14" y1="4" y2="4" />
                <line x1="10" x2="3" y1="4" y2="4" />
                <line x1="21" x2="12" y1="12" y2="12" />
                <line x1="8" x2="3" y1="12" y2="12" />
                <line x1="21" x2="16" y1="20" y2="20" />
                <line x1="12" x2="3" y1="20" y2="20" />
                <line x1="14" x2="14" y1="2" y2="6" />
                <line x1="8" x2="8" y1="10" y2="14" />
                <line x1="16" x2="16" y1="18" y2="22" />
              </svg>
              <span className="text-sm">Bộ lọc</span>
            </button>
          </div>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium">Tìm kiếm</button>
        </div>

        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm">
          <Left />
          <Right />
        </div>
      </div>
    </div>
  )
}
