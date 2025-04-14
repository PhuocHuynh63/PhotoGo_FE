interface CarouselSlideProps {
    children: React.ReactNode;
    width: number;
}

export const CarouselSlide = ({ children, width }: CarouselSlideProps) => {
    return (
        <div
            className="flex-shrink-0"
            style={{ width: `${width}px` }}
        >
            {children}
        </div>
    );
}; 