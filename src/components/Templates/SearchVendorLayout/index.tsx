'use client'
import Button from "@components/Atoms/Button";

import Search from "@components/Molecules/Search/Search";
import Select from "@components/Atoms/Select";
import { useState } from "react";
import { motion } from "framer-motion";
import Left from "@pages/Public/Search/SearchVendor/Left/Filter";
import Right from "@pages/Public/Search/SearchVendor/Right/Results";
import { IVendor } from "@models/vendor/common.model";


export default function SearchVendorLayout({ vendorData }: { vendorData: IVendor[] }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    // console.log('template ' + JSON.stringify(vendorData, null, 2));
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
                        <Search placeholder="Tìm kiếm dịch vụ" searchWidth="" onChange={(e) => setSearch(e)} />
                    </div>
                    <div className="flex items-center">
                        <Select placeHolder="Bộ lọc" height={"h-9"} selectIcon="Funnel" value={filter} onValueChange={(value) => setFilter(value)} options={[{ value: "Giá thấp đến cao", icon: "ArrowUpNarrowWide" }, { value: "Giá cao đến thấp", icon: "ArrowDownWideNarrow" }, { value: "Đánh giá cao nhất", icon: "Stars" }]} className="flex items-center gap-1 px-3 py-2 border rounded-md bg-white text-dark shadow-lg" />
                    </div>
                    <Button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium shadow-lg">Tìm kiếm</Button>
                </div>

                <motion.div
                    className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Left />
                    <Right vendorData={vendorData} />
                </motion.div>
            </div>
        </motion.div>
    )
}
