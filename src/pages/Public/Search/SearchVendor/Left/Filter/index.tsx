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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/Atoms/ui/accordion"

export default function Left({ onReset, categories, onApply }: {
    onReset: () => void,
    categories: ICategoriesData,
    onApply: () => void
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectPriceRange, setSelectPriceRange] = useState<[number, number]>([0, 70000000]);
    const [selectedCategories, setSelectedCategories] = useState<{ key: string }[]>([]);
    const [rating, setRating] = useState(0);
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

    function handleCategoryChange(key: string) {
        setSelectedCategories(prev => {
            const isSelected = prev.some(category => category.key === key);
            let updated;
            if (isSelected) {
                updated = prev.filter(category => category.key !== key);
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
        setSelectPriceRange([0, 70000000]);
        setSelectedCategories([]);
        setRating(0);
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

        if (selectedCategories.length > 0) params.set("serviceType", selectedCategories.map(s => s.key).join(","));
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
        setSelectedCategories(categories?.data
            ?.filter(s => servicesFromUrl?.includes(s.name) ?? false)
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
        <>
            {/* Desktop Filter UI */}
            <div className="hidden md:block w-64 pr-4 border-r p-3">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium text-md mb-2 flex items-center justify-between">
                        Bộ lọc tìm kiếm
                    </h3>
                    <Button onClick={handleResetAll}>Xóa tất cả</Button>
                </div>

                {/* Service Type */}
                <div className="mb-4">
                    <h3 className="font-medium text-sm mb-2">Loại dịch vụ</h3>
                    <Checkbox
                        options={categories?.data.map(category => ({ key: category.name }))}
                        value={selectedCategories.map(category => category.key) as string[]}
                        onChange={(e, key) => handleCategoryChange(key)}
                    />
                </div>

                {/* Location */}
                <div className="mb-4 border-t pt-4">
                    <h3 className="font-medium text-sm mb-2">Địa điểm</h3>
                    <Checkbox
                        options={address}
                        value={addresses.map(service => service.key)}
                        onChange={(e, key) => handleAddressChange(key)}
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
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Price Range */}
                <div className="mb-4 border-t py-4">
                    <h3 className="font-medium text-sm mb-2">Khoảng giá</h3>
                    <PriceRangeSlider
                        min={0}
                        max={70000000}
                        step={500000}
                        value={selectPriceRange}
                        onValueChange={setSelectPriceRange}
                    />
                </div>

                {/* Rating */}
                <div className="mb-4 border-t pt-4">
                    <h3 className="font-medium text-sm mb-2">Đánh giá</h3>
                    <RadioButtonGroup
                        options={[
                            { label: <StarRating stars={5} interactive onClick={() => setRating(5)} />, value: '5' },
                            { label: <StarRating stars={4} interactive onClick={() => setRating(4)} />, value: '4' },
                            { label: <StarRating stars={3} interactive onClick={() => setRating(3)} />, value: '3' },
                            { label: <StarRating stars={2} interactive onClick={() => setRating(2)} />, value: '2' },
                            { label: <StarRating stars={1} interactive onClick={() => setRating(1)} />, value: '1' },
                        ]}
                        value={rating.toString()}
                        onChange={(value) => setRating(Number(value))}
                        name="rating"
                    />
                </div>

                {/* Apply Button */}
                <div className="mt-10">
                    <button className="w-full bg-orange-300 text-white py-2 rounded-md text-sm font-medium hover:bg-orange-400 transition-colors cursor-pointer" onClick={handleApplyFilter}>
                        Áp dụng bộ lọc
                    </button>
                </div>
            </div>

            {/* Mobile Filter UI */}
            <div className="md:hidden w-full">
                <Accordion type="single" defaultValue="serviceType" collapsible className="space-y-2">
                    {/* Service Type */}
                    <AccordionItem value="serviceType" className="border rounded-lg px-3">
                        <AccordionTrigger className="py-3 cursor-pointer text-base font-medium">Loại dịch vụ</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <Checkbox
                                options={categories?.data.map(category => ({ key: category.name }))}
                                value={selectedCategories.map(category => category.key) as string[]}
                                onChange={(e, key) => handleCategoryChange(key)}
                            />
                        </AccordionContent>
                    </AccordionItem>

                    {/* Location */}
                    <AccordionItem value="address" className="border rounded-lg px-3">
                        <AccordionTrigger className="py-3 cursor-pointer text-base font-medium">Địa điểm</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <Checkbox
                                options={address}
                                value={addresses.map(service => service.key)}
                                onChange={(e, key) => handleAddressChange(key)}
                            />
                        </AccordionContent>
                    </AccordionItem>

                    {/* Date */}
                    <AccordionItem value="date" className="border rounded-lg px-3">
                        <AccordionTrigger className="py-3 cursor-pointer text-base font-medium">Ngày Đặt lịch</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <div className="flex items-center">
                                <CustomDatePicker
                                    placeholder="Select date"
                                    value={selectedDate}
                                    onChange={(date) => {
                                        if (date) {
                                            setSelectedDate(date)
                                        }
                                    }}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Price Range */}
                    <AccordionItem value="price" className="border rounded-lg px-3">
                        <AccordionTrigger className="py-3 cursor-pointer text-base font-medium">Khoảng giá</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <PriceRangeSlider
                                min={0}
                                max={70000000}
                                step={500000}
                                value={selectPriceRange}
                                onValueChange={setSelectPriceRange}
                            />
                        </AccordionContent>
                    </AccordionItem>

                    {/* Rating */}
                    <AccordionItem value="rating" className="border rounded-lg px-3">
                        <AccordionTrigger className="py-3 cursor-pointer text-base font-medium">Đánh giá</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <RadioButtonGroup
                                options={[
                                    { label: <StarRating stars={5} interactive onClick={() => setRating(5)} />, value: '5' },
                                    { label: <StarRating stars={4} interactive onClick={() => setRating(4)} />, value: '4' },
                                    { label: <StarRating stars={3} interactive onClick={() => setRating(3)} />, value: '3' },
                                    { label: <StarRating stars={2} interactive onClick={() => setRating(2)} />, value: '2' },
                                    { label: <StarRating stars={1} interactive onClick={() => setRating(1)} />, value: '1' },
                                ]}
                                value={rating.toString()}
                                onChange={(value) => setRating(Number(value))}
                                name="rating"
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Mobile Action Buttons */}
                <div className="sticky -bottom-4 p-2 border-t bg-white mt-4">
                    <div className="flex gap-2">
                        <Button
                            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                            onClick={() => {
                                handleResetAll();
                                onReset();
                            }}
                        >
                            Đặt lại
                        </Button>
                        <Button
                            className="flex-1 bg-primary text-white"
                            onClick={() => {
                                handleApplyFilter();
                                onApply();
                            }}
                        >
                            Áp dụng
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
