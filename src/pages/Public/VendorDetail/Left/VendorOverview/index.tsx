'use client'

import { useVendor } from '@lib/vendorContext'
import { Badge, CheckCircle, ChevronRight, Clock, Eye, Info, Star } from 'lucide-react'
import React from 'react'
import ButtonVendorDetail from '../../components/ButtonVendorDetail'
import Link from 'next/link'
import { ROUTES } from '@routes'
import Button from '@components/Atoms/Button'
import { useParams, useRouter } from 'next/navigation'
import ButtonNoBackground from '@components/Atoms/ButtonNoBackground'
import ButtonNoBackgroundVendorDetail from '../components/ButtonNoBackGroundVendorDetail'
import { Card } from '@components/Atoms/Card'

const VendorOverviewPage = () => {

  const vendorData = useVendor() as any
  const params = useParams()
  const router = useRouter()


  return (
    <>
      <div>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
          <p className="text-muted-foreground whitespace-pre-line">{vendorData?.description}</p>
        </section>


        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Tác phẩm nổi bật</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vendorData?.portfolio?.items
              .filter((item: any) => item?.featured)
              .map((item: any) => (
                <div key={item?.id} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={item?.image || "/placeholder.svg"}
                    alt={item?.title}
                    width={400}
                    height={300}
                    className="w-full h-64 object-contain transition-transform group-hover:scale-105"
                  />
                  <div className="cursor-pointer absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="text-white font-semibold">{item?.title}</h3>
                    <p className="text-white/80 text-sm">{item?.category}</p>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex justify-center mt-4 text-center">
            <ButtonNoBackgroundVendorDetail onClick={() => router.push(ROUTES.PUBLIC.VENDOR_DETAIL.replace(':page', 'portfolio'))} className="flex items-center gap-1 border px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50 transition-colors">
              Xem tất cả tác phẩm
              <ChevronRight className="h-4 w-4" />
            </ButtonNoBackgroundVendorDetail>
          </div>
        </section >

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Gói dịch vụ phổ biến</h2>
          <div className="space-y-6">
            {vendorData?.packages
              .filter((pkg: any) => pkg.popular)
              .map((pkg: any) => (
                <Card key={pkg?.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img
                        src={pkg?.image || "/placeholder.svg"}
                        alt={pkg?.name}
                        width={400}
                        height={300}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{pkg?.name}</h3>
                        <Badge className="bg-primary">Phổ biến</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{pkg?.description}</p>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-lg font-bold text-primary">{pkg?.price}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {pkg?.duration}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button>Đặt ngay</Button>
                        <div>
                          <div>
                            <Button variant="outline" className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              Xem concept
                            </Button>
                          </div>
                          <div className="max-w-4xl">
                            <div>
                              <div className="flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                Concept cho {pkg.name}
                              </div>
                              <div>
                                Dưới đây là một số concept đã thực hiện cho gói dịch vụ này
                              </div>
                            </div>
                            <div className="space-y-4">
                              {pkg.concept.map((item: any, index: number) => (
                                <div key={index}>
                                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                  <div className="w-full">
                                    <div>
                                      {item.images.map((img: any, imgIndex: number) => (
                                        <div key={imgIndex} className="md:basis-1/2 lg:basis-1/3">
                                          <div className="p-1">
                                            <img
                                              src={img || "/placeholder.svg"}
                                              alt={`${item.title} - Ảnh ${imgIndex + 1}`}
                                              width={400}
                                              height={300}
                                              className="rounded-lg w-full h-48 object-cover"
                                            />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="hidden md:flex" />
                                    <div className="hidden md:flex" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div >
                  </div >
                </Card >
              ))}
          </div >
          <div className="mt-6 text-center">
            <ButtonNoBackgroundVendorDetail onClick={() => router.push(`${ROUTES.PUBLIC.VENDOR_DETAIL.replace(':page', 'packges')}`)} className="gap-1">
              Xem tất cả gói dịch vụ
              <ChevronRight className="h-4 w-4" />
            </ButtonNoBackgroundVendorDetail>
          </div>
        </section >

        {/* <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Đội ngũ chuyên gia</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vendorData?.team?.map((member: any) => (
              <div key={member.id} className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-3">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.experience}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" className="gap-1" onClick={() => setSelectedTab("team")}>
              Xem chi tiết về đội ngũ
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </section> */}

        <section className="mb-8" >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Đánh giá từ khách hàng</h2>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 font-medium">{vendorData?.rating}</span>
              <span className="text-muted-foreground ml-1">({vendorData?.reviewCount} đánh giá)</span>
            </div>
          </div>
          <div className="space-y-6">
            {/* {vendorData?.reviews?.slice(0, 2).map((review: any) => (
              <div key={review.id} className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={review.user.avatar} alt={review.user.name} />
                      <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{review.user.name}</h3>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-4 w-4 ${idx < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                        />
                      ))}
                  </div>
                </div>
                <h4 className="font-medium mb-1">{review.title}</h4>
                <p className="text-muted-foreground text-sm mb-3">{review.comment}</p>
                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {review.photos.map((photo, photoIdx) => (
                      <Image
                        key={photoIdx}
                        src={photo || "/placeholder.svg"}
                        alt={`Đánh giá từ ${review.user.name}`}
                        width={100}
                        height={100}
                        className="rounded-lg w-20 h-20 object-cover"
                      />
                    ))}
                  </div>
                )}
                <Badge variant="outline" className="mt-2 text-xs">
                  {review.service}
                </Badge>
              </div>
            ))} */}
          </div>
          <div className="mt-6 text-center">
            <ButtonNoBackgroundVendorDetail onClick={() => router.push(`${ROUTES.PUBLIC.VENDOR_DETAIL.replace(':page', 'reviews')}`)} className="gap-1">
              Xem tất cả đánh giá
              <ChevronRight className="h-4 w-4" />
            </ButtonNoBackgroundVendorDetail>
          </div>
        </section >
      </div >
    </>
  )
}

export default VendorOverviewPage