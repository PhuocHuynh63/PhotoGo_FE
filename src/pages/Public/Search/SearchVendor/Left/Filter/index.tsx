"use client"

import PriceRangeSlider from "@components/Atoms/2WaySlider/2WaySlider"
import Button from "@components/Atoms/Button"
import Checkbox from "@components/Atoms/Checkbox"
import RadioButtonGroup from "@components/Atoms/RadioButton"
import StarRating from "@components/Molecules/StarRating"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import CustomDatePicker from "@components/Atoms/DatePicker"
import { motion } from "framer-motion"

export default function Left() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectPriceRange, setSelectPriceRange] = useState<[number, number]>([5000000, 70000000]);
    const [serviceType, setServiceType] = useState<ICOMPONENTS.ServiceType[]>([]);
    const [rating, setRating] = useState(5);
    const [addresses, setAddresses] = useState<ICOMPONENTS.AddressType[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const services = [
        { key: "Studio" },
        { key: "Nhiếp ảnh gia" },
        { key: "Makeup Artist" },
    ];

    const address = [
        { key: "HCM" },
        { key: "Hà Nội" },
        { key: "Đà Nẵng" },
        { key: "Tỉnh thành khác" },
    ];

    // function updateQueryParam(key: string, value: string | number | string[] | number[]) {
    //     if (!searchParams) return;
    //     const params = new URLSearchParams(searchParams.toString());
    //     if (Array.isArray(value)) {
    //         params.delete(key);
    //         value.forEach(v => params.append(key, v.toString()));
    //     } else {
    //         params.set(key, value.toString());
    //     }
    //     router.replace(`?${params.toString()}`);
    // }

    function handleServiceTypeChange(key: string) {
        setServiceType(prev => {
            const isSelected = prev.some(service => service.key === key);
            let updated;
            if (isSelected) {
                updated = prev.filter(service => service.key !== key);
            } else {
                updated = [...prev, { key }];
            }
            // updateQueryParam("service", String(updated.map(s => s.key)));
            return updated;
        });
    }

    function handleAddressChange(key: string) {
        setAddresses(prev => {
            const isSelected = prev.some(item => item.key === key);
            let updated;
            if (isSelected) {
                updated = prev.filter(item => item.key !== key);
            } else {
                updated = [...prev, { key }];
            }
            // updateQueryParam("address", updated.map(a => a.key));
            return updated;
        });
    }

    function handleResetAll() {
        setSelectPriceRange([5000000, 70000000]);
        setServiceType([]);
        setRating(5);
        setAddresses([]);
        router.push("?");
    }

    function handleApplyFilter() {
        // Logic to apply the selected filters
        // This could involve updating the URL parameters or fetching data based on the selected filters
        // router.push(`?${new URLSearchParams({
        //     price: selectPriceRange.join(','),
        //     service: serviceType.map(s => s.key).join(','),
        //     address: addresses.map(a => a.key).join(','),
        //     rating: rating.toString(),
        //     date: selectedDate.toLocaleDateString('vi-VN').replace(/\//g, '-')
        // }).toString()}`);
        const params = new URLSearchParams();

        if (serviceType.length > 0) params.set("serviceType", serviceType.map(s => s.key).join(","));
        if (rating > 0) params.set("minRating", rating.toString());
        params.set("minPrice", selectPriceRange[0].toString());
        params.set("maxPrice", selectPriceRange[1].toString());
        params.set("date", selectedDate.toLocaleDateString('vi-VN').replace(/\//g, '-'));
        if (addresses.length > 0) params.set("address", addresses.map(a => a.key).join(","));

        router.push(`?${params.toString()}`);
    }

    useEffect(() => {
        const params = new URLSearchParams(searchParams?.toString());

        const minPrice = params.getAll("minPrice")
        const maxPrice = params.getAll("maxPrice")
        if (minPrice.length > 0 && maxPrice.length > 0) {
            setSelectPriceRange([Number(minPrice[0]), Number(maxPrice[0])]);
        }

        const servicesFromUrl = params.getAll("serviceType");
        setServiceType(services.filter(s => servicesFromUrl.includes(s.key)));

        const addressesFromUrl = params.getAll("address");
        setAddresses(address.filter(a => addressesFromUrl.includes(a.key)));

        const ratingFromUrl = params.get("rating");
        if (ratingFromUrl) setRating(Number(ratingFromUrl));

        const dateFromUrl = params.get("date");
        if (dateFromUrl) {
            const [day, month, year] = dateFromUrl.split('-').map(Number);
            const dateObject = new Date(year, month - 1, day);
            setSelectedDate(dateObject);
        }

    }, [searchParams])


    return (
        <motion.div
            className="w-64 pr-4 border-r p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-4">
                <h3 className="font-medium text-sm mb-2 flex items-center justify-between">
                    Bộ lọc tìm kiếm
                    <Button onClick={handleResetAll}>Xóa tất cả</Button>
                </h3>
            </div>

            {/* Service Type */}
            <motion.div
                className="mb-4 border-t pt-4"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="font-medium text-sm mb-2">Loại dịch vụ</h3>
                <Checkbox
                    options={services}
                    value={String(serviceType.map(service => service.key))}
                    onChange={(e, key) => {
                        handleServiceTypeChange(key);
                    }}
                />
            </motion.div>

            {/* Date */}
            <motion.div
                className="mb-4 border-t pt-4"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="font-medium text-sm mb-2">Ngày Đặt lịch</h3>
                <div className="flex items-center">
                    <CustomDatePicker
                        placeholder="Select date"
                        value={selectedDate}
                        onChange={(date) => {
                            if (date) {
                                setSelectedDate(date)
                                // updateQueryParam("date", date.toLocaleDateString('vi-VN').replace(/\//g, '-'));
                            }

                        }}
                    />
                </div>
            </motion.div>

            {/* Price Range */}
            <motion.div
                className="mb-4 border-t pt-4"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="font-medium text-sm mb-2">Khoảng giá</h3>
                <PriceRangeSlider
                    min={500000}
                    max={70000000}
                    step={500000}
                    value={selectPriceRange}
                    onValueChange={(val) => {
                        setSelectPriceRange(val);
                        // updateQueryParam("price", val);
                    }}
                />
            </motion.div>

            {/* Location */}
            <motion.div
                className="mb-4 border-t pt-4"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="font-medium text-sm mb-2">Địa điểm</h3>
                <Checkbox
                    options={address}
                    value={addresses.map(service => service.key)}
                    onChange={(e, key) => {
                        handleAddressChange(key);
                    }}
                />
            </motion.div>

            {/* Rating */}
            <motion.div
                className="mb-4 border-t pt-4"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="font-medium text-sm mb-2">Đánh giá</h3>
                <RadioButtonGroup
                    options={[
                        { label: <StarRating stars={5} />, value: '5' },
                        { label: <StarRating stars={4} />, value: '4' },
                        { label: <StarRating stars={3} />, value: '3' },
                        { label: <StarRating stars={2} />, value: '2' },
                        { label: <StarRating stars={1} />, value: '1' },
                    ]}
                    value={rating.toString()}
                    onChange={(value) => {
                        setRating(Number(value));
                        // updateQueryParam("rating", value);
                    }}
                    name="rating"
                />
            </motion.div>

            <Button className="w-full" onClick={handleApplyFilter}>
                Áp dụng bộ lọc
            </Button>
        </motion.div>
    )
}
