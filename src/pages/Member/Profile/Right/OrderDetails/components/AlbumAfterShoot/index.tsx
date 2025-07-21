import { Card } from '@components/Atoms/ui/card'
import { Skeleton } from '@components/Atoms/ui/skeleton'
import { albumComponent } from '@constants/vendorAlbums';
import { VendorAlbumsModel } from '@models/vendorAlbums/common.model';
import React, { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox';
import "yet-another-react-lightbox/styles.css"

type AblumAfterShootProps = {
  id: string;
  title?: string;
  subTitle?: string;
  skeletonCount?: number;
  albumData?: {
    images: string[];
    message?: string;
  };
  isLoading?: boolean;
  vendorAlbums?: VendorAlbumsModel;
};

const AblumAfterShoot = ({ id, title, subTitle, skeletonCount, vendorAlbums, isLoading }: AblumAfterShootProps) => {
  /**
   * Lightbox for images in reviews
   * We use a lightbox to display images when clicked
   */
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [lightboxImages, setLightboxImages] = useState<{ src: string }[]>([])
  const handleImageClick = (images: string[], index: number) => {
    setLightboxImages(images?.map(img => ({ src: img })))
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }
  //-----------------------------End---------------------------------//

  /**
   * Get images based on the album type
   * @returns Array of image URLs based on the album type
   */
  const getImages = () => {
    if (!vendorAlbums) return [];
    if (id === albumComponent.ALBUM_AFTER_SHOOT) return vendorAlbums.photos || [];
    if (id === albumComponent.ALBUM_AFTER_SHOOT_BTS) return vendorAlbums.behindTheScenes || [];
    return [];
  };
  //-----------------------------End---------------------------------//

  return (
    <>
      <Card className="p-8">
        <h3 className="text-2xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-500 mb-6">{subTitle}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: skeletonCount ?? 3 }).map((_, idx) => (
              <Skeleton key={idx} className="aspect-square w-full h-full bg-gray-200" />
            ))
            :
            getImages().map((imgUrl: string, index: number) => (
              <img
                key={index}
                src={imgUrl}
                alt={`Ảnh ${index + 1}`}
                className="cursor-pointer photo-thumbnail aspect-square rounded-md shadow-2xl w-full h-full object-cover bg-gray-100"
                onClick={() => handleImageClick(getImages(), index)}
              />
            ))
          }
          {getImages().length === 0 && (
            <div className="col-span-full text-center">
              <p className="text-gray-500">Hiện tại chưa có ảnh</p>
            </div>
          )}
        </div>
      </Card>
      {lightboxImages.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxImages}
          index={currentImageIndex}
        />
      )}
    </>
  )
}

export default AblumAfterShoot