"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Button from "@components/Atoms/Button"
import Checkbox from "@components/Atoms/Checkbox"
// import RadioButtonGroup from "@components/Atoms/RadioButton"
// import StarRating from "@components/Molecules/StarRating"
import PriceRangeSlider from "@components/Atoms/2WaySlider/2WaySlider"
// import DurationRangeSlider from "@components/Atoms/DurationRangeSlider/DurationRangeSlider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/Atoms/ui/accordion"
import { IServiceTypeModel } from "@models/serviceTypes/common.model"
import toast from 'react-hot-toast'

export default function Left({ onReset, onApply, serviceTypes }: { onReset: () => void, onApply: () => void, serviceTypes: IServiceTypeModel[] | undefined }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    // const [rating, setRating] = useState(0);
    const [selectPriceRange, setSelectPriceRange] = useState<[number, number]>([300000, 70000000]);
    // const [selectDurationRange, setSelectDurationRange] = useState<[number, number]>([60, 360]);
    const [selectedServiceTypes, setSelectedServiceTypes] = useState<{ key: string }[]>([]);

    // Handle type checkbox changes
    function handleServiceTypeChange(key: string) {
        setSelectedServiceTypes(prev => {
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

    // Apply filters and update URL
    const applyFilters = () => {
        const params = new URLSearchParams(searchParams?.toString());

        if (selectedServiceTypes.length > 0) params.set("serviceType", selectedServiceTypes.map(s => s.key).join(","));
        // if (rating > 0) params.set("minRating", rating.toString());
        params.set("minPrice", selectPriceRange[0].toString());
        params.set("maxPrice", selectPriceRange[1].toString());
        // params.set("minDuration", selectDurationRange[0].toString());
        // params.set("maxDuration", selectDurationRange[1].toString());

        router.push(`?${params.toString()}`);
        toast.success('Áp dụng bộ lọc thành công!');
    }

    function handleResetAll() {
        setSelectedServiceTypes([]);
        // setSelectDurationRange([60, 360]);
        // setRating(0);
        setSelectPriceRange([300000, 70000000]);

        const params = new URLSearchParams();
        params.set('current', "1");

        router.push(`?${params.toString()}`);

        onReset();
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
            setSelectedServiceTypes(
                serviceTypes
                    ?.filter(s => servicesArray.includes(s.name))
                    .map(s => ({ key: s.name })) || []
            );
        }



        // const minDuration = params.get("minDuration");
        // const maxDuration = params.get("maxDuration");
        // if (minDuration && maxDuration) {
        //     setSelectDurationRange([Number(minDuration), Number(maxDuration)]);
        // }

        // const ratingFromUrl = params.get("minRating");
        // if (ratingFromUrl) setRating(Number(ratingFromUrl));
    }, [searchParams])

    return (
        <>
            {/* Desktop Filter UI */}
            <div className="hidden md:block w-64 pr-4 p-3">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium text-md mb-2 flex items-center justify-between">
                        Bộ lọc tìm kiếm
                    </h3>
                    <Button onClick={handleResetAll}>Xóa tất cả</Button>
                </div>
                <Accordion type="single" defaultValue="serviceType" collapsible>
                    {/* Service Type */}
                    <AccordionItem value="serviceType">
                        <AccordionTrigger className="py-2 cursor-pointer">Loại dịch vụ</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                <Checkbox
                                    options={serviceTypes?.map(service => ({ key: service.name })) || []}
                                    value={selectedServiceTypes.map(service => service.key) as string[]}
                                    onChange={(e, key) => handleServiceTypeChange(key)}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
                {/* Rating
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
                </div> */}
                {/* Price Range */}
                <div className="mb-4 border-t pt-4">
                    <h3 className="font-medium text-sm mb-2">Khoảng giá</h3>
                    <div className="px-1 py-4">
                        <PriceRangeSlider
                            min={300000}
                            max={70000000}
                            step={500000}
                            value={selectPriceRange}
                            onValueChange={setSelectPriceRange}
                        />
                    </div>
                </div>
                {/* Duration Range
                <div className="mb-4 border-t pt-4">
                    <h3 className="font-medium text-sm mb-2">Thời lượng</h3>
                    <div className="px-1 py-4">
                        <DurationRangeSlider
                            min={60}
                            max={360}
                            step={30}
                            value={selectDurationRange}
                            onValueChange={setSelectDurationRange}
                        />
                    </div>
                </div> */}
                <div className="mt-10">
                    <button
                        className="w-full bg-orange-300 text-white py-2 rounded-md text-sm font-medium hover:bg-orange-400 transition-colors cursor-pointer"
                        onClick={applyFilters}
                    >
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
                                options={serviceTypes?.map(service => ({ key: service.name })) || []}
                                value={selectedServiceTypes.map(service => service.key) as string[]}
                                onChange={(e, key) => handleServiceTypeChange(key)}
                            />
                        </AccordionContent>
                    </AccordionItem>

                    {/* Rating
                    <AccordionItem value="rating" className="border rounded-lg px-3">
                        <AccordionTrigger className="py-3 cursor-pointer text-base font-medium">Đánh giá</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
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
                        </AccordionContent>
                    </AccordionItem> */}
                    {/* Price Range */}
                    <AccordionItem value="price" className="border rounded-lg px-3">
                        <AccordionTrigger className="py-3 cursor-pointer text-base font-medium">Khoảng giá</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <PriceRangeSlider
                                min={300000}
                                max={70000000}
                                step={500000}
                                value={selectPriceRange}
                                onValueChange={setSelectPriceRange}
                            />
                        </AccordionContent>
                    </AccordionItem>
                    {/* Duration Range
                    <AccordionItem value="duration" className="border rounded-lg px-3">
                        <AccordionTrigger className="py-3 cursor-pointer text-base font-medium">Thời lượng</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <DurationRangeSlider
                                min={60}
                                max={360}
                                step={30}
                                value={selectDurationRange}
                                onValueChange={setSelectDurationRange}
                            />
                        </AccordionContent>
                    </AccordionItem> */}
                </Accordion>
                {/* Mobile Action Buttons */}
                <div className="sticky -bottom-4 p-2 border-t bg-white mt-4">
                    <div className="flex gap-2">
                        <Button
                            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                            onClick={handleResetAll}
                        >
                            Đặt lại
                        </Button>
                        <Button
                            className="flex-1 bg-primary text-white"
                            onClick={() => {
                                applyFilters();
                                onApply();
                                toast.success('Áp dụng bộ lọc thành công!');
                            }}
                        >
                            Áp dụng
                        </Button>
                    </div>
                </div>
            </div >
        </>
    )
}
