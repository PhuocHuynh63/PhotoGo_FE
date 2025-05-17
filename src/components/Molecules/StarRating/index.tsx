import React from 'react';
import LucideIcon from '../../Atoms/LucideIcon';

interface StarRatingProps {
    stars: number;
    size?: number;
    color?: string;
    className?: string;
    onClick?: (rating: number) => void;
    interactive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
    stars,
    size = 20,
    color = '#FFD700',
    className = '',
    onClick,
    interactive = false,
}) => {
    const maxStars = 5;
    const normalizedStars = Math.min(Math.max(0, stars), maxStars);
    const filledStars = Math.floor(normalizedStars);
    const hasHalfStar = normalizedStars % 1 === 0.5;
    const emptyStars = maxStars - filledStars - (hasHalfStar ? 1 : 0);

    const handleStarClick = (rating: number) => {
        if (interactive && onClick) {
            onClick(rating);
        }
    };

    return (
        <div className={`flex items-center ${className} ${interactive ? 'cursor-pointer' : ''}`}>
            {[...Array(filledStars)].map((_, index) => (
                <div
                    key={`filled-${index}`}
                    onClick={() => handleStarClick(index + 1)}
                    className={interactive ? 'cursor-pointer' : ''}
                >
                    <LucideIcon
                        name="Star"
                        iconSize={size}
                        iconColor={color}
                        fill={color}
                    />
                </div>
            ))}
            {hasHalfStar && (
                <div
                    className={`relative ${interactive ? 'cursor-pointer' : ''}`}
                    onClick={() => handleStarClick(filledStars + 0.5)}
                >
                    <LucideIcon
                        name="Star"
                        iconSize={size}
                        iconColor={color}
                    />
                    <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                        <LucideIcon
                            name="Star"
                            iconSize={size}
                            iconColor={color}
                            fill={color}
                        />
                    </div>
                </div>
            )}
            {[...Array(emptyStars)].map((_, index) => (
                <div
                    key={`empty-${index}`}
                    onClick={() => handleStarClick(filledStars + (hasHalfStar ? 1 : 0) + index + 1)}
                    className={interactive ? 'cursor-pointer' : ''}
                >
                    <LucideIcon
                        name="Star"
                        iconSize={size}
                        iconColor={color}
                    />
                </div>
            ))}
        </div>
    );
};

export default StarRating;
