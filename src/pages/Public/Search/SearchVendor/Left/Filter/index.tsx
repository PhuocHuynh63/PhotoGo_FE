"use client"

import PriceRangeSlider from "@components/Atoms/2WaySlider/2WaySlider"
import Button from "@components/Atoms/Button"
import Checkbox from "@components/Atoms/Checkbox"
import RadioButtonGroup from "@components/Atoms/RadioButton"
import StarRating from "@components/Molecules/StarRating"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ICategoriesData } from "@models/category/response.model"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/Atoms/ui/accordion"
import toast from "react-hot-toast"
import { IAllLocation } from "@models/location/common.model"

export default function Left({ onReset, categories, locations, onApply }: {
    onReset: () => void,
    categories: ICategoriesData,
    locations: IAllLocation,
    onApply: () => void
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectPriceRange, setSelectPriceRange] = useState<[number, number]>([0, 70000000]);
    const [selectedCategories, setSelectedCategories] = useState<{ key: string, id: string }[]>([]);
    const [rating, setRating] = useState(0);
    const [addresses, setAddresses] = useState<ICOMPONENTS.AddressType[]>([]);



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

    function handleCategoryChange(id: string) {
        setSelectedCategories(prev => {
            const isSelected = prev.some(category => category.id === id);
            let updated;
            if (isSelected) {
                updated = prev.filter(category => category.id !== id);
            } else {
                const category = categories?.data?.find(cat => cat.id === id);
                updated = [...prev, { key: category?.name || '', id }];
            }
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

        const params = new URLSearchParams();
        params.set('current', "1");

        router.push(`?${params.toString()}`);

        onReset();
    }

    function handleApplyFilter() {
        const params = new URLSearchParams(searchParams?.toString());

        // Giữ lại param current nếu có
        const currentPage = searchParams?.get('current');
        if (currentPage) {
            params.set('current', "1");
        }

        if (selectedCategories?.length > 0) {
            params.set("category", selectedCategories?.map(s => s.id).join(","));
        }

        if (rating > 0) params.set("minRating", rating.toString());
        params.set("minPrice", selectPriceRange[0].toString());
        params.set("maxPrice", selectPriceRange[1].toString());
        if (addresses?.length > 0) params.set("address", addresses?.map(a => a.key).join(","));

        router.push(`?${params.toString()}`);
        toast.success('Áp dụng bộ lọc thành công!');

    }

    useEffect(() => {
        const params = new URLSearchParams(searchParams?.toString());

        const minPrice = params.getAll("minPrice")
        const maxPrice = params.getAll("maxPrice")
        if (minPrice.length > 0 && maxPrice.length > 0) {
            setSelectPriceRange([Number(minPrice[0]), Number(maxPrice[0])]);
        }

        const categoriesFromUrl = params.get("category");
        if (categoriesFromUrl && categories?.data) {
            const categoryIds = categoriesFromUrl.split(",");
            setSelectedCategories(
                categories.data
                    .filter(category => categoryIds.includes(category.id))
                    .map(category => ({ key: category.name, id: category.id }))
            );
        } else {
            setSelectedCategories([]);
        }

        const addressesFromUrl = params.get("address");
        setAddresses(locations?.filter(a => addressesFromUrl?.includes(a) ?? false)?.map(a => ({ key: a })) ?? []);

        const ratingFromUrl = params.get("minRating");
        if (ratingFromUrl) setRating(Number(ratingFromUrl));
        else setRating(0);

    }, [searchParams, categories?.data, locations])


    return (
        <>
            {/* Desktop Filter UI */}
            <div className="hidden md:block w-64 pr-4 p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium text-md flex items-center">
                        Bộ lọc
                    </h3>
                    <Button onClick={handleResetAll} className="text-sm text-white">Xóa tất cả</Button>
                </div>

                <Accordion type="multiple" defaultValue={["category", "address", "price", "rating"]} className="space-y-2">
                    {/* Service Type */}
                    <AccordionItem value="category" className="border rounded-lg px-3">
                        <AccordionTrigger className="py-3 cursor-pointer text-base font-medium">Loại dịch vụ</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <Checkbox
                                options={categories?.data?.map(category => ({ key: category.name, value: category.id })) ?? []}
                                value={selectedCategories?.map(category => category.id) as string[]}
                                onChange={(e, id) => handleCategoryChange(id)}
                            />
                        </AccordionContent>
                    </AccordionItem>

                    {/* Location */}
                    <AccordionItem value="address" className="border rounded-lg px-3">
                        <AccordionTrigger className="py-3 cursor-pointer text-base font-medium">Địa điểm</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <Checkbox
                                options={locations?.map(location => ({ key: location }))}
                                value={addresses?.map(service => service.key)}
                                onChange={(e, key) => handleAddressChange(key)}
                            />
                        </AccordionContent>
                    </AccordionItem>

                    {/* Price Range */}
                    <AccordionItem value="price" className="border rounded-lg px-3">
                        <AccordionTrigger className="py-3 cursor-pointer text-base font-medium">Khoảng giá</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-9">
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

                {/* Apply Button */}
                <div className="mt-10">
                    <button className="w-full bg-orange-300 text-white py-2 rounded-md text-sm font-medium hover:bg-orange-400 transition-colors cursor-pointer" onClick={handleApplyFilter}>
                        Áp dụng bộ lọc
                    </button>
                </div>
            </div>

            {/* Mobile Filter UI */}
            <div className="md:hidden w-full">
                <Accordion type="single" defaultValue="category" collapsible className="space-y-2">
                    {/* Service Type */}
                    <AccordionItem value="category" className="border rounded-lg px-3">
                        <AccordionTrigger className="py-3 cursor-pointer text-base font-medium">Loại dịch vụ</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <Checkbox
                                options={categories?.data?.map(category => ({ key: category.name, value: category.id })) ?? []}
                                value={selectedCategories?.map(category => category.id) as string[]}
                                onChange={(e, id) => handleCategoryChange(id)}
                            />
                        </AccordionContent>
                    </AccordionItem>

                    {/* Location */}
                    <AccordionItem value="address" className="border rounded-lg px-3">
                        <AccordionTrigger className="py-3 cursor-pointer text-base font-medium">Địa điểm</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <Checkbox
                                options={locations?.map(location => ({ key: location }))}
                                value={addresses?.map(address => address.key)}
                                onChange={(e, key) => handleAddressChange(key)}
                            />
                        </AccordionContent>
                    </AccordionItem>

                    {/* Price Range */}
                    <AccordionItem value="price" className="border rounded-lg px-3">
                        <AccordionTrigger className="py-3 cursor-pointer text-base font-medium">Khoảng giá</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-9">
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
