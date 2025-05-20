'use client'

import { useVendor } from '@stores/vendor/selectors'
import { ChevronRight } from 'lucide-react'
import React from 'react'
import { ROUTES } from '@routes'
import { useParams, useRouter } from 'next/navigation'
import ButtonNoBackgroundVendorDetail from '../components/ButtonNoBackGroundVendorDetail'
import PackageVendor from '../components/PackageVendor'
import ReviewVendor from '../components/ReviewVendor'
import PortfolioVendor from '../components/PortfolioVendor'
import { IVendor } from '@models/vendor/common.model'


const VendorOverviewPage = () => {

  /**
    * Call vendor store to get vendor data
    */
  const vendorData = useVendor() as IVendor
  //-----------------------------End---------------------------------//

  /**
   * Get slug from URL
   */
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string
  //-----------------------------End---------------------------------//

  return (
    <>
      <div>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
          <p className="text-muted-foreground whitespace-pre-line">{vendorData?.description}</p>
        </section>


        {/* Portfolio */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Tác phẩm nổi bật</h2>
          <PortfolioVendor />

          <div className="flex justify-center mt-4 text-center">
            <ButtonNoBackgroundVendorDetail onClick={() => router.push(ROUTES.PUBLIC.VENDOR_DETAIL.replace('slug', slug).replace(':page', 'portfolio'))} className="flex items-center gap-1 border px-3 py-2 mt-4 rounded-md text-muted-foreground hover:bg-muted/50 transition-colors">
              Xem tất cả tác phẩm
              <ChevronRight className="h-4 w-4" />
            </ButtonNoBackgroundVendorDetail>
          </div>
        </section >


        {/* Packages */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Gói dịch vụ phổ biến</h2>
          <PackageVendor isOverview={true} />
          <div className="mt-6 text-center">
            <ButtonNoBackgroundVendorDetail onClick={() => router.push(`${ROUTES.PUBLIC.VENDOR_DETAIL.replace('slug', slug).replace(':page', 'packges')}`)} className="gap-1 mt-4">
              Xem tất cả gói dịch vụ
              <ChevronRight className="h-4 w-4" />
            </ButtonNoBackgroundVendorDetail>
          </div>
        </section >


        {/* Review */}
        <section className="mb-8" >
          <ReviewVendor />
        </section>

        <div className="flex justify-center mt-4">
          <ButtonNoBackgroundVendorDetail onClick={() => router.push(ROUTES.PUBLIC.VENDOR_DETAIL.replace('slug', slug).replace(':page', 'reviews'))} className="gap-1">
            Xem tất cả đánh giá
            <ChevronRight className="h-4 w-4" />
          </ButtonNoBackgroundVendorDetail>
        </div>
      </div >
    </>
  )
}

export default VendorOverviewPage