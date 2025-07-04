import { Card } from '@components/Atoms/ui/card'
import { Skeleton } from '@components/Atoms/ui/skeleton'
import React, { useState } from 'react'

type AblumAfterShootProps = {
  title?: string;
  subTitle?: string;
  skeletonCount?: number;
  albumData?: {
    images: string[];
    message?: string;
  };
  onImageClick?: (imageUrl: string) => void;
};

const AblumAfterShoot = ({ title, subTitle, skeletonCount, albumData, onImageClick }: AblumAfterShootProps) => {

  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <Card className="p-8">
      <h3 className="text-2xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-500 mb-6">{subTitle}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: skeletonCount ?? 3 }).map((_, idx) => (
            <Skeleton key={idx} className="aspect-square w-full h-full bg-gray-200" />
          ))
          :
          albumData?.images.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`Ảnh ${index + 1}`}
              className="photo-thumbnail aspect-square w-full h-full object-cover bg-gray-100"
              onClick={() => onImageClick?.(imgUrl)}
            />
          ))
        }
      </div>
    </Card>
  )
}

export default AblumAfterShoot