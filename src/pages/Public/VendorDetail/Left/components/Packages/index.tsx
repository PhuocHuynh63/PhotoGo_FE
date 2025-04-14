import { ROUTES } from '@routes'
import { Star } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const PackagesVendor = () => {

    const vendorData = [
        {
            id: 1,
            name: 'JiP Weeding',
            rating: 4.5,
            address: '217/4 Bùi Đình Túy Ho Chi Minh City, Vietnam',
            image: 'https://scontent.fsgn5-15.fna.fbcdn.net/v/t39.30808-1/294906261_546552730530493_7505570221985800380_n.png?stp=dst-png_s480x480&_nc_cat=111&ccb=1-7&_nc_sid=2d3e12&_nc_eui2=AeEAPDusztt1G_9Ll1btIf8ayy7hT3hjUGvLLuFPeGNQawzjsvBDMIA6B7Fbkjkyezktsd7s6BouLmLwX8nGhhdV&_nc_ohc=iKwDcrkYIcsQ7kNvwENPwC4&_nc_oc=AdnTIecZSu8_pvsmfbZMN6UqjUWchHeFMgXz2P-M9SeA0618GVmJyjvy61Av7m9ISK8&_nc_zt=24&_nc_ht=scontent.fsgn5-15.fna&_nc_gid=knl8of4QRmmqO3C8Pewq5g&oh=00_AfFXsLv9_VhOLUr7pEzzLQITuAVjmR_l6uvDfNKvOLvylQ&oe=6802A878'
        },
        {
            id: 2,
            name: 'CASEY Studio',
            rating: 4.3,
            address: '214 Trần Quang Khải, P. Tân Định, Q 1 Ho Chi Minh City, Vietnam',
            image: 'https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-1/292416518_463500279113105_2163262027035003976_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=102&ccb=1-7&_nc_sid=2d3e12&_nc_eui2=AeF7LZSpoG1en5p4NfLH0dB1aUShIRVr4eBpRKEhFWvh4LDa3pSOxja8lP6JFzAYvik4rMdzRgOzy2qPvdy8xZZX&_nc_ohc=Sdkn29RTKEkQ7kNvwFExz-R&_nc_oc=Adlfz8UXOzeq5DDo1acvKSz9A7V_OkXig455Btv3aq_TTIbDBHDuDAi9nl2S0D_GHUA&_nc_zt=24&_nc_ht=scontent.fsgn5-9.fna&_nc_gid=rqmCqXdnZi8ZFhu0H66P2w&oh=00_AfFdYPgdJRsl-t83CKtoOOgX8dyE6pBcGzwVOizUBKWs3Q&oe=680291B0'
        },
        {
            id: 3,
            name: 'TuArt Wedding',
            rating: 4.0,
            address: '147 - 149 Hồ Văn Huê, Ho Chi Minh City, Vietnam',
            image: 'https://scontent.fsgn5-3.fna.fbcdn.net/v/t39.30808-6/347822695_566203328920759_8041380285868701865_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEegq6kwZPHawWd9fg8FoOhP0QqEbbfpGQ_RCoRtt-kZFxoh42ICmnxuZ5CvAnMdeurtOxFnry3BhZNIYjQhueU&_nc_ohc=Ozhed8PiYkwQ7kNvwH_lSqQ&_nc_oc=AdlHQnZo0W3yRhlkYluIRqOn1SealTVLRxBGdvAmpxsa4TXXUt6LghimFNYdhi1iT3U&_nc_zt=23&_nc_ht=scontent.fsgn5-3.fna&_nc_gid=BRdeqWX4hsmwGvkBaKDpKg&oh=00_AfGVD33gl85jmzKGeMWRupCDozMWGR9Eko3EG9CGpJx_9A&oe=68029C7E'
        }
    ]
    return (
        <div className="py-6 px-6.5 rounded-md bg-primary-opacity-2 border border-grey">
            <h3 className="font-bold text-lg mb-4">Studio tương tự</h3>
            <div className="space-y-4" >
                {
                    vendorData.map((i: any) => (
                        <Link href={ROUTES.PUBLIC.VENDOR_DETAIL.replace(':slug', i.id)} key={i.id} className="cursor-pointer flex gap-3">
                            <img
                                src={`${i.image}`}
                                alt={`Studio tương tự ${i.id}`}
                                width={80}
                                height={80}
                                className="rounded-md w-20 h-20 object-cover"
                            />
                            <div>
                                <h4 className="font-medium">Studio {i.name}</h4>
                                <div className="flex items-center text-sm">
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    <span className="ml-1">{i.rating}</span>
                                    <span className="text-muted-foreground ml-1">({100 - i.id * 10})</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{i.address}</p>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default PackagesVendor