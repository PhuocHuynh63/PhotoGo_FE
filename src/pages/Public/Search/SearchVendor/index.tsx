'use client'
import Search from "@components/Molecules/Search/Search";
import Select from "@components/Atoms/Select";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Left from "./Left/Filter";
import Right from "./Right/Results";
import { IVendorsData } from "@models/vendor/response.model";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchVendor({ vendors }: { vendors: IVendorsData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams?.get('searchTerm') || "");
  const [filter, setFilter] = useState(searchParams?.get('sortBy') || "");

  const handleResetAll = () => {
    setSearch(""); // Reset search input
    setFilter(""); // Reset filter select
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams?.toString());
    if (search) {
      params.set('q', search);
    } else {
      params.delete('q');
    }
    params.set('current', '1');
    router.push(`?${params.toString()}`);
  };

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString());

    switch (value) {
      case "Giá thấp đến cao":
        params.set('sortBy', 'price');
        params.set('sortDirection', 'asc');
        break;
      case "Giá cao đến thấp":
        params.set('sortBy', 'price');
        params.set('sortDirection', 'desc');
        break;
      case "Đánh giá cao nhất":
        params.set('sortBy', 'rating');
        params.set('sortDirection', 'desc');
        break;
      default:
        params.delete('sortBy');
        params.delete('sortDirection');
    }

    params.set('current', '1');
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
        <h1 className="text-4xl font-bold mb-6">Tìm kiếm nhà cung cấp</h1>

        <div className="mb-6 flex items-center gap-2">
          <div className="flex-1">
            <Search
              placeholder="Tìm kiếm nhà cung cấp"
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
              onValueChange={(value) => {
                setFilter(value);
                handleSort(value);
              }}
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
          <Left onReset={handleResetAll} />
          <Right vendors={vendors} />
        </motion.div>
      </div>
    </motion.div>
  )
}
