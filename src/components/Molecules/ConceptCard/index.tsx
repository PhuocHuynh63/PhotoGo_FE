
'use client';

import { ROUTES } from '@routes';
import { formatPrice } from '@utils/helpers/CurrencyFormat/CurrencyFormat';
import Link from 'next/link';
import React from 'react';

const ConceptCard = ({ concept }: any) => {
    if (!concept) return null;

    const href = `${ROUTES.PUBLIC.VENDOR_DETAIL.replace(':slug', concept.vendorSlug).replace(':page', 'packages')}?location=${concept.location[0].district}&conceptId=${concept.conceptId}`;

    return (
        <Link href={href} passHref className="block flex-shrink-0 w-[200px] bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
            <div className="relative w-full h-[120px]">
                <img
                    src={concept.imageUrl}
                    alt={concept.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-800 truncate" title={concept.name}>
                    {concept.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    {concept.keywords.slice(0, 3).join(', ')}...
                </p>
                <p className="text-base font-bold text-orange-500 mt-2">
                    {formatPrice(concept.price)}
                </p>
            </div>
        </Link >
    );
};

export default ConceptCard;