'use client'
import Search from "@components/Molecules/Search/Search";
import Select from "@components/Atoms/Select";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Left from "./Left/Filter";
import Right from "./Right/Results";
import { IVendorsData } from "@models/vendor/response.model";
import { ICategoriesData } from "@models/category/response.model";
import { useRouter, useSearchParams } from "next/navigation";
import LucideIcon from "@components/Atoms/LucideIcon";
import Button from "@components/Atoms/Button";
import { IAllLocation } from "@models/location/common.model";


export default function SearchVendor({ vendors, categories, locations }: { vendors: IVendorsData, categories: ICategoriesData, locations: IAllLocation }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams?.get('name') || "");
  const [filter, setFilter] = useState(searchParams?.get('sortBy') || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleResetAll = () => {
    setSearch(""); // Reset search input
    setFilter(""); // Reset filter select
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams?.toString());
    if (search) {
      params.set('name', search);
    } else {
      params.delete('name');
    }
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
      className="bg-gray-50 min-h-screen mt-14"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-4 md:mx-10 px-2 md:px-4 py-4 md:py-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Tìm kiếm nhà cung cấp</h1>

        <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-2">
          <div className="flex-1">
            <Search
              placeholder="Tìm kiếm nhà cung cấp"
              searchWidth=""
              value={search}
              onChange={(e) => setSearch(e)}
            />
          </div>
          <div className="flex items-center gap-2">
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
                { value: "Tất cả", name: "Tất cả", icon: "ListFilter" },
                { value: "Giá thấp đến cao", name: "Giá thấp đến cao", icon: "ArrowUpNarrowWide" },
                { value: "Giá cao đến thấp", name: "Giá cao đến thấp", icon: "ArrowDownWideNarrow" },
                { value: "Đánh giá cao nhất", name: "Đánh giá cao nhất", icon: "Stars" }
              ]}
              className="flex items-center gap-1 px-3 py-2 border rounded-md bg-white text-dark shadow-lg cursor-pointer"
            />
            <div className="md:hidden">
              <Button
                className={`px-3 py-2 border rounded-md shadow-lg text-dark hover:bg-gray-100 ${isFilterOpen ? "bg-primary" : ""}`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <LucideIcon name="SlidersHorizontal" iconSize={20} />
              </Button>
            </div>
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {isFilterOpen && (
              <>
                {/* Overlay */}
                <motion.div
                  key="overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden fixed inset-0 bg-black/50 z-40"
                  onClick={() => setIsFilterOpen(false)}
                />
                {/* Filter Panel */}
                <motion.div
                  key="filter-panel"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 200,
                    mass: 1
                  }}
                  className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Bộ lọc</h2>
                      <Button
                        className="text-gray-500 hover:text-gray-700 bg-transparent"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        <LucideIcon name="X" iconSize={20} />
                      </Button>
                    </div>
                    <div className="h-[60vh] overflow-y-auto pb-4">
                      <Left
                        onReset={handleResetAll}
                        categories={categories}
                        locations={locations}
                        onApply={() => setIsFilterOpen(false)}
                      />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <motion.div
            className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="hidden md:block">
              <Left onReset={handleResetAll} categories={categories} locations={locations} onApply={() => { }} />
            </div>
            <Right vendors={vendors} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
