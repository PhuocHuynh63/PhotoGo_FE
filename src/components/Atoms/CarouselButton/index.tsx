'use client'
interface CarouselButtonProps {
    direction: 'prev' | 'next';
    onClick: () => void;
}

export const CarouselButton = ({ direction, onClick }: CarouselButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`absolute top-1/2 -translate-y-1/2 cursor-pointer ${direction === 'prev' ? 'left-2' : 'right-2'
                } bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-all`}
        >
            {direction === 'prev' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            )}
        </button>
    );
}; 