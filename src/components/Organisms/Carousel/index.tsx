import { useEffect, useState, useRef } from 'react';
import { CarouselButton } from '@/components/Atoms/CarouselButton';
import { CarouselSlide } from '@/components/Molecules/CarouselSlide';

// import Image from 'next/image';

export const Carousel = ({
    items,
    renderItem,
    autoScroll = false,
    scrollInterval = 3000,
    scrollSpeed = 500,
    width = 800,
    height = 400,
}: ICOMPONENTS.CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const slides = [...items, ...items, ...items];
    const totalSlides = items.length;
    const offset = totalSlides;

    // Default render function nếu không có renderItem được truyền vào
    const defaultRenderItem = (item: ICOMPONENTS.CarouselItem) => (
        <div className="relative h-full w-full">
            {item.image && (
                <img
                    src={item.image}
                    alt={item.title || ''}
                    // fill
                    className="object-cover"
                />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                {item.title && (
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                )}
                {item.description && (
                    <p className="text-sm">{item.description}</p>
                )}
            </div>
        </div>
    );

    useEffect(() => {
        if (!autoScroll) return;

        const interval = setInterval(() => {
            handleNext();
        }, scrollInterval);

        return () => clearInterval(interval);
    }, [autoScroll, scrollInterval]);

    const handleNext = () => {
        if (isTransitioning) return;

        // Thêm kiểm tra để tránh skip quá nhanh
        if (currentIndex >= totalSlides * 2) {
            setCurrentIndex(offset);
            setTimeout(() => {
                setIsTransitioning(true);
                setCurrentIndex(prev => prev + 1);
            }, 50);
        } else {
            setIsTransitioning(true);
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (isTransitioning) return;

        // Thêm kiểm tra để tránh skip quá nhanh
        if (currentIndex <= 0) {
            setCurrentIndex(totalSlides);
            setTimeout(() => {
                setIsTransitioning(true);
                setCurrentIndex(prev => prev - 1);
            }, 50);
        } else {
            setIsTransitioning(true);
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleTransitionEnd = () => {
        // Chỉ reset position khi thực sự cần thiết
        if (currentIndex >= totalSlides + offset) {
            // Reset về slide đầu tiên của nhóm giữa
            setIsTransitioning(false);
            setCurrentIndex(offset);
        } else if (currentIndex < offset) {
            // Reset về slide cuối cùng của nhóm giữa
            setIsTransitioning(false);
            setCurrentIndex(totalSlides + offset - 1);
        } else {
            setIsTransitioning(false);
        }
    };

    const getActiveIndex = () => {
        let normalizedIndex = currentIndex - offset;
        if (normalizedIndex < 0) {
            normalizedIndex = totalSlides + normalizedIndex;
        }
        return normalizedIndex % totalSlides;
    };

    return (
        <div
            className="relative overflow-hidden rounded-lg"
            style={{ width, height }}
        >
            <div
                ref={containerRef}
                className="flex h-full"
                style={{
                    transform: `translateX(-${currentIndex * width}px)`,
                    transition: isTransitioning ? `transform ${scrollSpeed}ms ease-in-out` : 'none',
                }}
                onTransitionEnd={handleTransitionEnd}
            >
                {slides.map((item, index) => (
                    <CarouselSlide key={`${item.id}-${index}`} width={width}>
                        {renderItem ? renderItem(item) : defaultRenderItem(item)}
                    </CarouselSlide>
                ))}
            </div>

            <CarouselButton direction="prev" onClick={handlePrev} />
            <CarouselButton direction="next" onClick={handleNext} />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${getActiveIndex() === index
                            ? 'bg-white w-4'
                            : 'bg-white/50'
                            }`}
                        onClick={() => setCurrentIndex(offset + index)}
                    />
                ))}
            </div>
        </div>
    );
};