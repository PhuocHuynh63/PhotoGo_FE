'use client'
import Search from "@components/Molecules/Search/Search";
import Select from "@components/Atoms/Select";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Left from "./Left/Filter";
import Right from "./Right/Results";
import { IVendor } from "@models/vendor/common.model";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchVendor({ vendors }: { vendors: IVendor[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams?.get('searchTerm') || "");
  const [filter, setFilter] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams?.toString());
    if (search) {
      params.set('searchTerm', search);
    } else {
      params.delete('searchTerm');
    }
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <motion.div
      className="bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-10 px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Tìm kiếm dịch vụ</h1>

        <div className="mb-6 flex items-center gap-2">
          <div className="flex-1">
            <Search
              placeholder="Tìm kiếm dịch vụ"
              searchWidth=""
              value={search}
              onChange={(e) => setSearch(e)}
            />
          </div>
          <div className="flex items-center">
            <Select
              placeHolder="Bộ lọc"
              height={"h-9"}
              selectIcon="Funnel"
              value={filter}
              onValueChange={(value) => setFilter(value)}
              options={[
                { value: "Giá thấp đến cao", icon: "ArrowUpNarrowWide" },
                { value: "Giá cao đến thấp", icon: "ArrowDownWideNarrow" },
                { value: "Đánh giá cao nhất", icon: "Stars" }
              ]}
              className="flex items-center gap-1 px-3 py-2 border rounded-md bg-white text-dark shadow-lg"
            />
          </div>
          {/* <Button
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium shadow-lg"
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button> */}
        </div>

        <motion.div
          className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Left />
          <Right vendors={vendors} />
        </motion.div>
      </div>
    </motion.div>
  )
}
