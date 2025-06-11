'use client';

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { EmblaOptionsType } from 'embla-carousel'
import AutoScroll from 'embla-carousel-auto-scroll'

interface ImageSlide {
    id: string | number;
    src: string;
    alt?: string;
}

interface EmblaCarouselProps {
    slides: ImageSlide[];
    options?: EmblaOptionsType;
    autoScroll?: boolean;
}

const EmblaCarousel: React.FC<EmblaCarouselProps> = (props) => {
    const { slides, options = { loop: true }, autoScroll } = props
    const [emblaRef] = useEmblaCarousel(options, [
        AutoScroll({ playOnInit: autoScroll ?? false, stopOnInteraction: false, speed: 1 })
    ])

    return (
        <div className="w-full relative">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {slides.map((item) => (
                        <div className="px-4 py-6" key={item.id}>
                            <div className="rounded-xl overflow-hidden shadow-md">
                                <img
                                    src={item.src}
                                    alt={item.alt || `Image ${item.id}`}
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EmblaCarousel
