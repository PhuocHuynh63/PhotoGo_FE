import { Card, CardContent } from "@components/Atoms/Card";
import { Skeleton } from "@components/Atoms/ui/skeleton";
import { MapPin } from "lucide-react";
import { Separator } from "@components/Atoms/Seperator/Seperator";


export default function BookingCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
                <div className="relative md:w-1/3 h-48 md:h-auto">
                    <Skeleton className="absolute inset-0 bg-gray-200" />
                </div>
                <CardContent className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row justify-between p-3">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Skeleton className="h-7 w-48 bg-gray-200" />
                                <Skeleton className="h-6 w-24 bg-gray-200" />
                            </div>
                            <div className="flex items-center mt-2">
                                <MapPin className="h-4 w-4 mr-1 text-gray-300" />
                                <Skeleton className="h-5 w-36 bg-gray-200" />
                            </div>
                            <Skeleton className="h-4 w-64 mt-1 bg-gray-200" />
                            <div className="flex flex-wrap gap-4 mt-4">
                                <Skeleton className="h-5 w-24 bg-gray-200" />
                                <Skeleton className="h-5 w-24 bg-gray-200" />
                            </div>
                            <Skeleton className="h-16 w-full mt-2 bg-gray-200" />
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 justify-end">
                                    <Skeleton className="h-6 w-32 bg-gray-200" />
                                    <Skeleton className="h-5 w-24 bg-gray-200" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <Skeleton className="h-4 w-32 ml-auto bg-gray-200" />
                                <Skeleton className="h-4 w-40 ml-auto mt-1 bg-gray-200" />
                            </div>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex flex-wrap gap-2 justify-end">
                        <Skeleton className="h-9 w-24 bg-gray-200" />
                        <Skeleton className="h-9 w-24 bg-gray-200" />
                        <Skeleton className="h-9 w-9 bg-gray-200" />
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}