import React from 'react';
import LucideIcon from '../../Atoms/LucideIcon';

interface StarRatingProps {
    stars: number;
    size?: number;
    color?: string;
    className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
    stars,
    size = 20,
    color = '#FFD700',
    className = '',
}) => {
    const maxStars = 5;
    const normalizedStars = Math.min(Math.max(0, stars), maxStars);
    const filledStars = Math.floor(normalizedStars);
    const hasHalfStar = normalizedStars % 1 === 0.5;
    const emptyStars = maxStars - filledStars - (hasHalfStar ? 1 : 0);

    return (
        <div className={`flex gap-2 items-center ${className}`}>
            {[...Array(filledStars)].map((_, index) => (
                <LucideIcon
                    key={`filled-${index}`}
                    name="Star"
                    iconSize={size}
                    iconColor={color}
                    fill={color}
                />
            ))}
            {hasHalfStar && (
                <div className="relative">
                    <LucideIcon
                        key="half-empty"
                        name="Star"
                        iconSize={size}
                        iconColor={color}
                    />
                    <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                        <LucideIcon
                            key="half-filled"
                            name="Star"
                            iconSize={size}
                            iconColor={color}
                            fill={color}
                        />
                    </div>
                </div>
            )}
            {[...Array(emptyStars)].map((_, index) => (
                <LucideIcon
                    key={`empty-${index}`}
                    name="Star"
                    iconSize={size}
                    iconColor={color}
                />
            ))}
        </div>
    );
};

export default StarRating;
