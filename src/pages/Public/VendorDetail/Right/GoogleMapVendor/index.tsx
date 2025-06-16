import { ILocation } from '@models/location/common.model';
import { useVendor } from '@stores/vendor/selectors'
import { useSearchParams } from 'next/navigation';
import React from 'react'

const GoogleMapVendor = () => {
  const vendorData = useVendor();
  const searchParams = useSearchParams()

  const location = searchParams?.get('location') as string
  //---------------------------End---------------------------//

  /**
   *  Get the latitude and longitude of the selected branch
   */
  const selectedBranch = vendorData?.locations?.find(
    (branch: ILocation) => branch.district === location
  )
  const lat = selectedBranch?.latitude
  const lng = selectedBranch?.longitude
  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`
  //---------------------------End---------------------------//

  return (
    <iframe
      src={mapSrc}
      width="385"
      height="300"
      className='rounded-md my-5 shadow-sm'
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade">
    </iframe>
  )
}

export default GoogleMapVendor