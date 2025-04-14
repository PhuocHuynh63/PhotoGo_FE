'use client'
import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { NextButton, PrevButton, usePrevNextButtons } from '@components/Atoms/EmblaCarouselArrowButtons/EmblaCarouselArrowButtons'
import { useAutoplay } from '@components/Atoms/EmblaCarouselAutoplay/EmblaCarouselAutoplay'
import Image from 'next/image'



type PropType = {
    slides: ICOMPONENTS.CarouselItem[]
    options?: EmblaOptionsType
    className?: string
    showControls?: boolean
    autoplay?: boolean
}

const EmblaCarousel: React.FC<PropType> = ({ slides, options, className, showControls, autoplay }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
        Autoplay({ playOnInit: autoplay ?? false, delay: 3000 })
    ])

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    const { autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick } =
        useAutoplay(emblaApi)


    return (
        <div className={`w-full ${className}`} >
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {slides.map((slide) => (
                        <div key={slide.id} className="relative min-w-full h-[60rem]">
                            <Image
                                src={slide.image ?? ''}
                                alt={`Slide ${slide.id}`}
                                fill
                                quality={100}
                                loading="lazy"
                                className="object-cover brightness-50"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 justify-between gap-5 mt-7">
                {showControls && (
                    <div className="grid grid-cols-2 gap-2 items-center">
                        <PrevButton
                            onClick={() => onAutoplayButtonClick(onPrevButtonClick)}
                            disabled={prevBtnDisabled}
                        />
                        <NextButton
                            onClick={() => onAutoplayButtonClick(onNextButtonClick)}
                            disabled={nextBtnDisabled}
                        />
                        <button className="flex items-center justify-center rounded-lg shadow-inner text-body font-bold text-lg px-6 min-w-[8.4rem]" onClick={toggleAutoplay} type="button">
                            {autoplayIsPlaying ? 'Stop' : 'Start'}
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default EmblaCarousel
