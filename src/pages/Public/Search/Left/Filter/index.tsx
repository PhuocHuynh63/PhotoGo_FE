"use client"

import PriceRangeSlider from "@components/Atoms/2WaySlider/2WaySlider"
import Button from "@components/Atoms/Button"
import Checkbox from "@components/Atoms/Checkbox"
import RadioButtonGroup from "@components/Atoms/RadioButton"
import StarRating from "@components/Molecules/StarRating"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import CustomDatePicker from "@components/Atoms/DatePicker"

export default function Left() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectPriceRange, setSelectPriceRange] = useState<[number, number]>([2000000, 7000000]);
    const [serviceType, setServiceType] = useState<ICOMPONENTS.ServiceType[]>([]);
    const [rating, setRating] = useState(5);
    const [addresses, setAddresses] = useState<ICOMPONENTS.AddressType[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const services = [
        { key: "Studio", label: "Studio" },
        { key: "Photographer", label: "Nhiếp ảnh gia" },
        { key: "Makeup", label: "Makeup Artist" },
    ];

    const address = [
        { key: "HCM", label: "HCM" },
        { key: "HaNoi", label: "Hà Nội" },
        { key: "DaNang", label: "Đà Nẵng" },
        { key: "TinhThanhKhac", label: "Tỉnh thành khác" },
    ];

    function updateQueryParam(key: string, value: string | number | string[] | number[]) {
        if (!searchParams) return;
        const params = new URLSearchParams(searchParams.toString());
        if (Array.isArray(value)) {
            params.delete(key);
            value.forEach(v => params.append(key, v.toString()));
        } else {
            params.set(key, value.toString());
        }
        router.replace(`?${params.toString()}`);
    }

    function handleServiceTypeChange(key: string) {
        setServiceType(prev => {
            const isSelected = prev.some(service => service.key === key);
            let updated;
            if (isSelected) {
                updated = prev.filter(service => service.key !== key);
            } else {
                const option = services.find(opt => opt.key === key);
                updated = [...prev, { key, label: option?.label || key }];
            }
            updateQueryParam("service", updated.map(s => s.key));
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
                const option = address.find(opt => opt.key === key);
                updated = [...prev, { key, label: option?.label || key }];
            }
            updateQueryParam("address", updated.map(a => a.key));
            return updated;
        });
    }

    function handleResetAll() {
        setSelectPriceRange([2000000, 7000000]);
        setServiceType([]);
        setRating(5);
        setAddresses([]);
        router.push("?");
    }

    useEffect(() => {
        const params = new URLSearchParams(searchParams?.toString());

        const price = params.getAll("price").map(Number);
        if (price.length === 2) {
            setSelectPriceRange([price[0], price[1]]);
        }

        const servicesFromUrl = params.getAll("service");
        setServiceType(services.filter(s => servicesFromUrl.includes(s.key)));

        const addressesFromUrl = params.getAll("address");
        setAddresses(address.filter(a => addressesFromUrl.includes(a.key)));

        const ratingFromUrl = params.get("rating");
        if (ratingFromUrl) setRating(Number(ratingFromUrl));
    }, [searchParams]); // 👈 Bắt buộc phải thêm vào


    return (
        <div className="w-64 pr-4 border-r p-3">
            <div className="mb-4">
                <h3 className="font-medium text-sm mb-2 flex items-center justify-between">
                    Bộ lọc tìm kiếm
                    <Button className="bg-none text-blue-600 hover:bg-gray-200" onClick={handleResetAll}>Xóa tất cả</Button>
                </h3>
            </div>

            {/* Service Type */}
            <div className="mb-4 border-t pt-4">
                <h3 className="font-medium text-sm mb-2">Loại dịch vụ</h3>
                <Checkbox
                    options={services}
                    value={serviceType.map(service => service.key)}
                    onChange={(e, key) => {
                        handleServiceTypeChange(key);
                        // if (e.target.checked) {
                        //     setServiceType(prev => [...prev, { key, label: key }]);
                        // } else {
                        //     setServiceType(prev => prev.filter(item => item.key !== key));
                        // }
                    }}
                />
            </div>

            {/* Date */}
            <div className="mb-4 border-t pt-4">
                <h3 className="font-medium text-sm mb-2">Ngày Đặt lịch</h3>
                <div className="flex items-center">
                    <CustomDatePicker
                        placeholder="Select date"
                        value={selectedDate}
                        onChange={(date) => {
                            if (date) {
                                setSelectedDate(date)
                                updateQueryParam("date", date.toLocaleDateString('vi-VN').replace(/\//g, '-'));
                            }

                        }}
                    />
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-4 border-t pt-4">
                <h3 className="font-medium text-sm mb-2">Khoảng giá</h3>
                <PriceRangeSlider
                    min={500000}
                    max={10000000}
                    step={500000}
                    value={selectPriceRange}
                    onValueChange={(val) => {
                        setSelectPriceRange(val);
                        updateQueryParam("price", val);
                    }}
                />
            </div>

            {/* Location */}
            <div className="mb-4 border-t pt-4">
                <h3 className="font-medium text-sm mb-2">Địa điểm</h3>
                <Checkbox
                    options={address}
                    value={addresses.map(service => service.key)}
                    onChange={(e, key) => {
                        handleAddressChange(key);
                        // if (e.target.checked) {
                        //     setAddresses(prev => [...prev, { key, label: key }]);
                        // } else {
                        //     setAddresses(prev => prev.filter(item => item.key !== key));
                        // }
                    }}
                />
            </div>

            {/* Rating */}
            <div className="mb-4 border-t pt-4">
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
                        updateQueryParam("rating", value);
                    }}
                    name="rating"
                />
            </div>

            <Button className="w-full py-2 rounded-md text-sm font-medium">
                Áp dụng bộ lọc
            </Button>
        </div>
    )
}
