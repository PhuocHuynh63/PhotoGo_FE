"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Button from "@components/Atoms/Button"
import Checkbox from "@components/Atoms/Checkbox"
import RadioButtonGroup from "@components/Atoms/RadioButton"
import StarRating from "@components/Molecules/StarRating"
import { motion } from "framer-motion"
import PriceRangeSlider from "@components/Atoms/2WaySlider/2WaySlider"
import DurationRangeSlider from "@components/Atoms/DurationRangeSlider/DurationRangeSlider"
export default function Left() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [serviceType, setServiceType] = useState<ICOMPONENTS.ServiceType[]>([]);
    const [vendor, setVendor] = useState<ICOMPONENTS.VendorType[]>([]);
    const [rating, setRating] = useState(5);
    const [selectPriceRange, setSelectPriceRange] = useState<[number, number]>([300000, 70000000]);
    const [selectDurationRange, setSelectDurationRange] = useState<[number, number]>([60, 180]);
    const providers = [
        { key: "Studio Ánh Sáng" },
        { key: "Elegant Studio" },
        { key: "Kumo Studio" },
        { key: "Studio Chụp Bá Cháy" },
    ]

    const services = [
        { key: "Chụp cưới" },
        { key: "Chụp chân dung" },
        { key: "Sự kiện" },
        { key: "Chụp sản phẩm" },
    ];

    // Handle type checkbox changes
    function handleServiceTypeChange(key: string) {
        setServiceType(prev => {
            const isSelected = prev.some(service => service.key === key);
            let updated;
            if (isSelected) {
                updated = prev.filter(service => service.key !== key);
            } else {
                updated = [...prev, { key }];
            }
            // updateQueryParam("service", updated.map(s => s.key));
            return updated;
        });
    }


    function handleVendorChange(key: string) {
        setVendor(prev => {
            const isSelected = prev.some(vendor => vendor.key === key);
            let updated;
            if (isSelected) {
                updated = prev.filter(vendor => vendor.key !== key);
            } else {
                updated = [...prev, { key }];
            }
            // updateQueryParam("vendor", updated.map(s => s.key));
            return updated;
        });
    }
    // Handle vendor checkbox changes
    // const handleVendorChange = (value: string) => {
    //     if (vendors.includes(value)) {
    //         setVendors(vendors.filter((v) => v !== value))
    //     } else {
    //         setVendors([...vendors, value])
    //     }
    // }

    // Apply filters and update URL
    const applyFilters = () => {
        const params = new URLSearchParams();

        if (serviceType.length > 0) params.set("serviceType", serviceType.map(s => s.key).join(","));
        if (rating > 0) params.set("minRating", rating.toString());
        params.set("minPrice", selectPriceRange[0].toString());
        params.set("maxPrice", selectPriceRange[1].toString());
        params.set("minDuration", selectDurationRange[0].toString());
        params.set("maxDuration", selectDurationRange[1].toString());
        if (vendor.length > 0) params.set("vendors", vendor.map(v => v.key).join(","));

        router.push(`?${params.toString()}`);
    }

    const handleResetAll = () => {
        setServiceType([])
        setRating(0)
        setSelectPriceRange([300000, 70000000])
        setSelectDurationRange([60, 180])
        setVendor([])
        router.push("?");
    }

    useEffect(() => {
        const params = new URLSearchParams(searchParams?.toString());

        const minPrice = params.get("minPrice");
        const maxPrice = params.get("maxPrice");
        if (minPrice && maxPrice) {
            setSelectPriceRange([Number(minPrice), Number(maxPrice)]);
        }

        const servicesFromUrl = params.get("serviceType");
        if (servicesFromUrl) {
            const servicesArray = servicesFromUrl.split(',');
            setServiceType(services.filter(s => servicesArray.includes(s.key)));
        }

        const vendorsFromUrl = params.get("vendors");
        if (vendorsFromUrl) {
            const vendorsArray = vendorsFromUrl.split(',');
            setVendor(providers.filter(v => vendorsArray.includes(v.key)));
        }

        const minDuration = params.get("minDuration");
        const maxDuration = params.get("maxDuration");
        if (minDuration && maxDuration) {
            setSelectDurationRange([Number(minDuration), Number(maxDuration)]);
        }

        const ratingFromUrl = params.get("minRating");
        if (ratingFromUrl) setRating(Number(ratingFromUrl));
    }, [searchParams])

    return (
        <div className="w-64 pr-4 border-r p-3">
            <div className="mb-4">
                <h3 className="font-medium text-sm mb-2 flex items-center justify-between">
                    Bộ lọc tìm kiếm
                    <Button
                        onClick={handleResetAll}
                    >
                        Xóa tất cả
                    </Button>
                </h3>
            </div>

            {/* Service Type */}
            <div className="mb-4 border-t pt-4">
                <h3 className="font-medium text-sm mb-2 flex items-center justify-between">
                    Loại dịch vụ

                </h3>
                <div className="space-y-2">
                    <Checkbox
                        options={services}
                        // value={String(serviceType.map(service => service.key))}
                        onChange={(e, key) => {
                            handleServiceTypeChange(key);
                        }}
                    />
                </div>

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

                {/* Price Range */}
                <div className="mb-4 border-t pt-4">
                    <h3 className="font-medium text-sm mb-2 flex items-center justify-between">
                        Khoảng giá
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
                            className="lucide lucide-chevron-up"
                        >
                            <path d="m18 15-6-6-6 6" />
                        </svg>
                    </h3>
                    <div className="px-1 py-4">
                        <PriceRangeSlider
                            min={300000}
                            max={70000000}
                            step={500000}
                            value={selectPriceRange}
                            onValueChange={(val) => {
                                setSelectPriceRange(val);
                                // updateQueryParam("price", val);
                            }}
                        />
                    </div>
                </div>

                {/* Duration Range */}
                <div className="mb-4 border-t pt-4">
                    <h3 className="font-medium text-sm mb-2 flex items-center justify-between">
                        Thời lượng

                    </h3>
                    <div className="px-1 py-4">
                        <DurationRangeSlider
                            min={60}
                            max={360}
                            step={30}
                            value={selectDurationRange}
                            onValueChange={(val) => {
                                setSelectDurationRange(val);
                                // updateQueryParam("duration", val);
                            }}
                        />
                    </div>
                </div>

                {/* Vendors */}
                <motion.div
                    className="mb-4 border-t pt-4"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h3 className="font-medium text-sm mb-2">Địa điểm</h3>
                    <Checkbox
                        options={providers}
                        // value={String(vendor.map(vendor => vendor.key))}
                        onChange={(e, key) => {
                            handleVendorChange(key);
                        }}
                    />
                </motion.div>

                <button
                    className="w-full bg-orange-500 text-white py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors"
                    onClick={applyFilters}
                >
                    Áp dụng bộ lọc
                </button>
            </div>
        </div>
    )
}
