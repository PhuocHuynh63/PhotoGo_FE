import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import { NextButton, PrevButton, usePrevNextButtons } from '@components/Atoms/EmblaCarouselArrowButtons/EmblaCarouselArrowButtons'
import { Avatar } from '@components/Molecules/Avatar'
import StarRating from '@components/Molecules/StarRating'


const EmblaCarousel: React.FC<ICOMPONENTS.PropType> = (props) => {
    const { slides, options = { loop: true }, autoScroll, showControls } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
        AutoScroll({ playOnInit: autoScroll ?? false, stopOnInteraction: false, speed: 1 })
    ])
    const [isPlaying, setIsPlaying] = useState(false)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    const onButtonAutoplayClick = useCallback(
        (callback: () => void) => {
            const autoScroll = emblaApi?.plugins()?.autoScroll
            if (!autoScroll) return

            const resetOrStop =
                autoScroll.options.stopOnInteraction === false
                    ? autoScroll.reset
                    : autoScroll.stop

            resetOrStop()
            callback()
        },
        [emblaApi]
    )

    const toggleAutoplay = useCallback(() => {
        const autoScroll = emblaApi?.plugins()?.autoScroll
        if (!autoScroll) return

        const playOrStop = autoScroll.isPlaying()
            ? autoScroll.stop
            : autoScroll.play
        playOrStop()
    }, [emblaApi])

    useEffect(() => {
        const autoScroll = emblaApi?.plugins()?.autoScroll
        if (!autoScroll) return

        setIsPlaying(autoScroll.isPlaying())
        emblaApi
            .on('autoScroll:play', () => setIsPlaying(true))
            .on('autoScroll:stop', () => setIsPlaying(false))
            .on('reInit', () => setIsPlaying(autoScroll.isPlaying()))
    }, [emblaApi])

    return (
        <div className="w-full container mx-auto">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex ">
                    {slides.map((item) => (
                        <div className="px-4 py-6" key={item.id}>
                            <div className="p-6 shadow-xl rounded-xl w-[25rem] h-[12.5rem] bg-red-4s00">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200">
                                        <Avatar size={50} src={item.avatar} fallback={item.avatar} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold">{item.name}</h4>
                                        <div className="flex text-yellow-400 ">
                                            <StarRating stars={item?.star ?? 0} size={16} color={"var(--orange)"} />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-lg text-gray-600 break-words whitespace-pre-wrap line-clamp-3">&quot;{item.comment}&quot;</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showControls && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="flex justify-between">
                        <PrevButton
                            onClick={() => onButtonAutoplayClick(onPrevButtonClick)}
                            disabled={prevBtnDisabled}
                        />
                        <NextButton
                            onClick={() => onButtonAutoplayClick(onNextButtonClick)}
                            disabled={nextBtnDisabled}
                        />
                        <button className="bg-transparent border-0 rounded-lg flex items-center justify-center text-body font-bold text-lg px-6" onClick={toggleAutoplay} type="button">
                            {isPlaying ? 'Stop' : 'Start'}
                        </button>
                    </div>

                </div>
            )}
        </div>
    )
}

export default EmblaCarousel
