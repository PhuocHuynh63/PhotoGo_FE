import { Avatar } from '@components/Molecules/Avatar'
import { useVendor } from '@lib/vendorContext'
import { Star } from 'lucide-react'
import React from 'react'

const ReviewVendor = () => {
    const vendorData = useVendor() as any

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Đánh giá từ khách hàng <></></h2>
                <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-medium">{vendorData?.rating}</span>
                    <span className="text-muted-foreground ml-1">({vendorData?.reviewCount} đánh giá)</span>
                </div>
            </div>
            <div className="space-y-6">
                {vendorData?.reviews?.slice(0, 2)?.map((review: any) => (
                    <div key={review?.id} className="bg-muted/50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div>
                                    <Avatar src={review?.user?.avatar} alt={review?.user?.name} />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{review?.user?.name}</h3>
                                    <p className="text-xs text-muted-foreground">{review?.date}</p>
                                </div>
                            </div>
                            <div className="flex">
                                {Array(5)
                                    .fill(0)
                                    .map((_, idx) => (
                                        <Star
                                            key={idx}
                                            className={`h-4 w-4 ${idx < review?.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                                        />
                                    ))}
                            </div>
                        </div>
                        <h4 className="font-medium mb-1">{review?.title}</h4>
                        <p className="text-muted-foreground text-sm mb-3">{review?.comment}</p>
                        {review?.photos && review?.photos.length > 0 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {review?.photos?.map((photo: any, photoIdx: number) => (
                                    <img
                                        key={photoIdx}
                                        src={photo || "/placeholder.svg"}
                                        alt={`Đánh giá từ ${review?.user?.name}`}
                                        width={100}
                                        height={100}
                                        className="rounded-lg w-20 h-20 object-cover"
                                    />
                                ))}
                            </div>
                        )}
                        <div className="border border-grey text-dark px-4 py-0.5 mt-1 text-xs font-semibold rounded-4xl w-fit">{review?.service}</div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ReviewVendor