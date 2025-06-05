import { Star } from "lucide-react";

/**
 * Function to render stars based on the rating value.
 * @param ratingValue 
 * @param interactive 
 * @param size 
 * @param onClickStar 
 * @returns 
 */
export const renderStars = (ratingValue: number, interactive = false, size = "w-4 h-4", onClickStar?: (starIndex: number) => void) => {
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue - fullStars >= 0.25 && ratingValue - fullStars < 0.75;
    const totalStars = 5;

    return Array.from({ length: totalStars }, (_, index) => {
        const starIndex = index + 1;
        let starElement;

        if (index < fullStars) {
            starElement = <Star key={index} className={`${size} fill-yellow-400 text-yellow-400 ${interactive ? 'cursor-pointer' : ''}`
            } />;
        } else if (index === fullStars && hasHalfStar) {
            starElement = (
                <div key={index} className={`relative inline-block ${interactive ? 'cursor-pointer' : ''}`
                }>
                    <Star className={`${size} text-gray-300`} />
                    < div className="absolute top-0 left-0 overflow-hidden" style={{ width: "50%" }
                    }>
                        <Star className={`${size} fill-yellow-400 text-yellow-400`} />
                    </div>
                </div>
            );
        } else {
            starElement = <Star key={index} className={`${size} text-gray-300 ${interactive ? 'cursor-pointer' : ''}`
            } />;
        }

        if (interactive && onClickStar) {
            return <div key={index} onClick={() => onClickStar(starIndex)
            }> {starElement} </div>;
        }
        return starElement;
    });
};