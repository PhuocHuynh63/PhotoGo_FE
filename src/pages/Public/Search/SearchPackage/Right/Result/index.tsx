"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Button from "@components/Atoms/Button"
import LucideIcon from "@components/Atoms/LucideIcon"
import Pagination from "@components/Organisms/Pagination/Pagination"
import { IServicePackage } from "@models/servicePackages/common.model"
import { IServicePackagesData } from "@models/servicePackages/response.model"
import { useRouter, useSearchParams } from "next/navigation"
import { Skeleton } from "@components/Atoms/ui/skeleton"
import { formatPrice } from "@utils/helpers/CurrencyFormat/CurrencyFormat"
import ViewConcept from "@pages/Public/VendorDetail/components/ViewConcept"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/Atoms/ui/tooltip"
import { ROUTES } from "@routes"

const cardVariants = {
    hidden: { opacity: 0, scale: 1 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1 }
};

export default function Right({ packages, pagination }: { packages: IServicePackage[], pagination: IServicePackagesData['pagination'] }) {
    // const [sortBy, setSortBy] = useState("")
    const [currentPage, setCurrentPage] = useState(pagination?.current || 1);
    const searchParams = useSearchParams();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false)
    const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined)
    const servicePackage = packages?.find((pkg) => pkg.id === selectedPackage) as IServicePackage

    const handleViewConcept = (id: string) => {
        setSelectedPackage(id)
        setIsOpen(!isOpen)
    }

    const handlePackageClick = (pkg: IServicePackage) => {
        const vendorSlug = pkg.vendor?.slug;
        const firstLocation = pkg.vendor?.locations?.[0];
        const locationCity = firstLocation?.district;

        if (vendorSlug) {
            let url = ROUTES.PUBLIC.VENDOR_DETAIL.replace(':slug', vendorSlug).replace(':page', '');
            if (locationCity) {
                url += `?location=${encodeURIComponent(locationCity)}`;
            }
            router.push(url);
        }
    }

    useEffect(() => {
        const current = searchParams?.get('current');
        if (current) {
            setCurrentPage(Number(current));
        } else {
            setCurrentPage(1);
        }
    }, [searchParams]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        const params = new URLSearchParams(searchParams?.toString());
        if (newPage) {
            params.set('current', newPage.toString());
        } else {
            params.delete('current');
        }
        router.push(`?${params.toString()}`);
    };

    // Skeleton loading component
    const SkeletonCard = () => (
        <div className="border-3 rounded-lg overflow-hidden">
            <Skeleton className="h-60 w-full" />
            <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-3" />
                <div className="flex flex-wrap gap-1 mb-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                </div>
                <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-24 rounded" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 pl-6 p-3 border-l-2">

            <ViewConcept
                isOpen={isOpen}
                onOpenChange={() => handleViewConcept(selectedPackage || '')}
                servicePackage={servicePackage}
                initialConceptId={selectedPackage}
            />
            <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-3xl font-medium pb-2">Kết quả tìm kiếm</h2>
                <p className="text-sm text-gray-500">Tìm thấy <span className="font-medium">{pagination?.totalItem}</span> kết quả</p>
            </motion.div>

            {/* <div className="flex items-center justify-end mb-4">
                <div className="flex items-center">
                    <select className="border rounded-md p-1 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="relevant">Phù hợp nhất</option>
                        <option value="price-low">Giá thấp đến cao</option>
                        <option value="price-high">Giá cao đến thấp</option>
                        <option value="duration-low">Thời lượng ngắn nhất</option>
                        <option value="duration-high">Thời lượng dài nhất</option>
                        <option value="rating">Đánh giá cao nhất</option>
                    </select>
                </div>
            </div> */}

            {!packages ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            ) : packages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Image
                        src="/not-found.svg"
                        alt="Không tìm thấy kết quả"
                        width={200}
                        height={200}
                        className="mb-4"
                    />
                    <p className="text-gray-500 text-lg font-medium">Không tìm thấy kết quả phù hợp</p>
                    <p className="text-gray-400 text-sm mt-2">Vui lòng thử lại với các bộ lọc khác</p>
                </div>
            ) : (
                <div
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}
                >
                    {packages?.map((pkg, index) => (
                        <motion.div
                            key={pkg.id}
                            className="border-3 rounded-lg overflow-hidden relative transition-transform duration-300 hover:border-orange-300 cursor-pointer hover:scale-105"
                            initial="hidden"
                            variants={cardVariants}
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            onClick={() => handlePackageClick(pkg)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Xem chi tiết gói dịch vụ ${pkg.name}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handlePackageClick(pkg);
                                }
                            }}
                        >
                            <div className="absolute top-2 right-2 z-10">
                                <Button
                                    className="shadow-none hover:bg-none flex items-center justify-center"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <LucideIcon name="Heart" iconSize={18} fill={pkg.status ? "red" : "none"} iconColor={pkg.status ? "red" : "black"} />
                                </Button>
                            </div>

                            <div className="relative">
                                <div className="relative h-60 border-b-2">
                                    <Image src={pkg.image || "/placeholder.svg"} fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        priority={index < 3}
                                        loading={index < 3 ? "eager" : "lazy"}
                                        alt={pkg.name}
                                        style={{
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                    <h3 className="text-white font-medium">{pkg.name}</h3>
                                    <div className="flex items-center text-white text-xs">
                                        {/* <span className="flex items-center">{pkg.vendor_name}</span> */}
                                    </div>
                                    <div className="flex items-center text-white text-xs mt-1">
                                        <span>{pkg.vendor.locations[0].district} - {pkg.vendor.locations[0].city}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3">
                                <div className="flex items-center mb-2">

                                    {/* <div className="flex text-yellow-400">
                                        <LucideIcon name="Star" iconSize={14} fill="yellow" />
                                    </div> */}
                                    {/* <span className="text-sm font-medium ml-1">

                                        {pkg.vendor_rating}</span>
                                    <span className="text-xs text-gray-500 ml-1">({pkg.vendor_reviews} đánh giá)</span> */}
                                </div>
                                <div className="flex items-center h-10">
                                    <div
                                        className="text-muted-foreground prose prose-sm max-w-none line-clamp-2 mb-4"
                                        dangerouslySetInnerHTML={{ __html: pkg.description || '' }}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {pkg.serviceConcepts.slice(0, 2).map((type, i) => (
                                        <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                            {type.name}
                                        </span>
                                    ))}
                                    {pkg.serviceConcepts.length > 2 && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full cursor-pointer">
                                                        +{pkg.serviceConcepts.length - 2}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {pkg.serviceConcepts.slice(2).map((t, i) => (
                                                        <div key={i}>{t.name}</div>
                                                    ))}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="text-md">
                                        <span className="font-medium">
                                            {pkg.minPrice && pkg.maxPrice ? (
                                                pkg.minPrice === pkg.maxPrice ?
                                                    `${formatPrice(pkg.minPrice)}` :
                                                    `${formatPrice(pkg.minPrice)} - ${formatPrice(pkg.maxPrice)}`
                                            ) : (
                                                pkg.minPrice ? `${formatPrice(pkg.minPrice)}` :
                                                    pkg.maxPrice ? `${formatPrice(pkg.maxPrice)}` : '0đ'
                                            )}
                                        </span>
                                    </div>

                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewConcept(pkg.id);
                                        }}
                                    >
                                        Xem concept
                                    </Button>

                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            )}

            {pagination?.totalItem > pagination?.pageSize && (
                <div className="mt-8 flex justify-center">
                    <Pagination
                        current={currentPage}
                        total={pagination?.totalPage}
                        onChange={handlePageChange}
                    />
                    {/* <Select
                        value={String(itemsPerPage)}
                        onValueChange={(value) => handlePageSizeChange(value)}
                        className="w-full"
                        options={[
                            { value: 5 },
                            { value: 10 },
                            { value: 50 },
                            { value: 100 },
                        ]}
                    /> */}
                </div>
            )}

        </div >
    )
}
