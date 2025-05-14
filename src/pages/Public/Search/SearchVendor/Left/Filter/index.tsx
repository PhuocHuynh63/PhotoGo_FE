"use client"

import PriceRangeSlider from "@components/Atoms/2WaySlider/2WaySlider"
import Button from "@components/Atoms/Button"
import Checkbox from "@components/Atoms/Checkbox"
import RadioButtonGroup from "@components/Atoms/RadioButton"
import StarRating from "@components/Molecules/StarRating"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import CustomDatePicker from "@components/Atoms/DatePicker"
import { ICategoriesData } from "@models/category/response.model"
import { ChevronDown } from "lucide-react"
import * as Accordion from '@radix-ui/react-accordion';


export default function Left({ onReset, categories }: { onReset: () => void, categories: ICategoriesData }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectPriceRange, setSelectPriceRange] = useState<[number, number]>([5000000, 70000000]);
    const [serviceType, setServiceType] = useState<{ key: string }[]>([]);
    const [rating, setRating] = useState(5);
    const [addresses, setAddresses] = useState<ICOMPONENTS.AddressType[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

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
        setRating(1);
        setAddresses([]);
        setSelectedDate(new Date());

        const params = new URLSearchParams();
        params.set('current', "1");

        router.push(`?${params.toString()}`);

        onReset();
    }

    function handleApplyFilter() {
        const params = new URLSearchParams();

        // Giữ lại param current nếu có
        const currentPage = searchParams?.get('current');
        if (currentPage) {
            params.set('current', "1");
        }

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

        const servicesFromUrl = params.get("serviceType");
        setServiceType(categories.data
            .filter(s => servicesFromUrl?.includes(s.name) ?? false)
            .map(category => ({ key: category.name })));

        const addressesFromUrl = params.get("address");
        setAddresses(address.filter(a => addressesFromUrl?.includes(a.key) ?? false));

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
        <Accordion.Root type="multiple" className="w-64 pr-4 border-r p-3">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium text-md mb-2 flex items-center justify-between">
                    Bộ lọc tìm kiếm
                </h3>
                <Button onClick={handleResetAll}>Xóa tất cả</Button>
            </div>

            {/* Service Type */}
            <Accordion.Item value="serviceType">
                <Accordion.Header>
                    <Accordion.Trigger className="flex w-full items-center justify-between py-2 font-medium text-sm cursor-pointer">
                        Loại dịch vụ
                        <ChevronDown className="ml-2 transition-transform data-[state=open]:rotate-180" size={18} />
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content>
                    <Checkbox
                        options={categories.data.map(category => ({ key: category.name }))}
                        value={serviceType.map(service => service.key) as string[]}
                        onChange={(e, key) => handleServiceTypeChange(key)}
                    />
                </Accordion.Content>
            </Accordion.Item>

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
                                // updateQueryParam("date", date.toLocaleDateString('vi-VN').replace(/\//g, '-'));
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
                    max={70000000}
                    step={500000}
                    value={selectPriceRange}
                    onValueChange={setSelectPriceRange}
                />
            </div>

            {/* Location */}
            <Accordion.Item value="address">
                <Accordion.Header>
                    <Accordion.Trigger className="flex w-full items-center justify-between py-2 font-medium text-sm cursor-pointer">
                        Địa điểm
                        <ChevronDown className="ml-2 transition-transform data-[state=open]:rotate-180" size={18} />
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content>
                    <Checkbox
                        options={address}
                        value={addresses.map(service => service.key)}
                        onChange={(e, key) => handleAddressChange(key)}
                    />
                </Accordion.Content>
            </Accordion.Item>

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
                    onChange={(value) => setRating(Number(value))}
                    name="rating"
                />
            </div>

            {/* Nút áp dụng bộ lọc */}
            <div className="mt-4">
                <button className="w-full bg-primary text-white py-2 rounded cursor-pointer" onClick={handleApplyFilter}>
                    Áp dụng bộ lọc
                </button>
            </div>
        </Accordion.Root>
    )
}
