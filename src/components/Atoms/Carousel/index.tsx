"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@helpers/CN"
import Button from "@/components/Atoms/Button"

type CarouselProps = {
    options?: Parameters<typeof useEmblaCarousel>[0]
    children: React.ReactNode
    className?: string
    autoScroll?: boolean
    speed?: number // in milliseconds
}

export const Carousel = ({ options, children, className, autoScroll = false, speed = 3000 }: CarouselProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        ...options,
    })
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)
    const [selectedIndex, setSelectedIndex] = React.useState(0)

    const scrollPrev = () => emblaApi?.scrollPrev()
    const scrollNext = () => emblaApi?.scrollNext()

    const onSelect = React.useCallback(() => {
        if (!emblaApi) return
        setCanScrollPrev(emblaApi.canScrollPrev())
        setCanScrollNext(emblaApi.canScrollNext())
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    React.useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on("select", onSelect)
        emblaApi.on("reInit", onSelect)
    }, [emblaApi, onSelect])

    React.useEffect(() => {
        if (!emblaApi || !autoScroll) return

        const interval = setInterval(() => {
            emblaApi.scrollNext()
        }, speed)

        return () => clearInterval(interval)
    }, [emblaApi, autoScroll, speed])
    return (
        <div className={cn("relative", className)}>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {children}
                </div>
            </div>

            <Button
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
                icon="ChevronLeft"
                disabled={!canScrollPrev}
                onClick={scrollPrev}
                width={32}
                height={32}
            />

            <Button
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
                icon="ChevronRight"
                disabled={!canScrollNext}
                onClick={scrollNext}
                width={32}
                height={32}
            />

            <div className="flex justify-center gap-2 mt-4">
                {React.Children.map(children, (_, index) => (
                    <button
                        key={index}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            index === selectedIndex ? "bg-primary w-4" : "bg-gray-300"
                        )}
                        title={``}
                        onClick={() => emblaApi?.scrollTo(index)}
                    />
                ))}
            </div>
        </div>
    )
}
