import React from 'react';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';
import { ROUTES } from '@routes';
import { ICampaign } from '@models/campaign/common.model';

const CampaignsMarquee = ({ campaigns }: { campaigns: ICampaign[] }) => {
  if (!campaigns || campaigns.length === 0) return null;

  return (
    <Link href={ROUTES.PUBLIC.CAMPAIGNS.VOUCHERS} passHref legacyBehavior>
      <a className="block w-full hide-scrollbar">
        <div
          className="w-full backdrop-blur-md bg-white/70 shadow-xl border-b border-gray-200 py-2 px-0 flex items-center overflow-y-hidden min-h-[40px] hide-scrollbar"
        >
          <Marquee
            gradient={false}
            speed={40}
            className="gap-8 w-full hide-scrollbar"
          >
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="hide-scrollbar flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-orange-100 to-yellow-50 border border-orange-200 shadow group gap-2 mr-4 hover:scale-105 hover:shadow-lg hover:bg-orange-200/60 transition-all duration-200 min-w-[120px] max-w-xs cursor-pointer"
                style={{ willChange: 'transform', minHeight: 32, maxHeight: 40 }}
              >
                <span className="text-lg">🎉</span>
                <span className="font-bold text-orange-600 text-sm truncate group-hover:text-orange-700 transition-colors duration-200">
                  {c.name}
                </span>
              </div>
            ))}
          </Marquee>
        </div>
      </a>
    </Link>
  );
};

export default CampaignsMarquee;