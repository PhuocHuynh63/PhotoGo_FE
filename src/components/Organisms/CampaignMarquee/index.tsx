import React from 'react';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';
import { ROUTES } from '@routes';
import { ICampaign } from '@models/campaign/common.model';

const CampaignsMarquee = ({ campaigns }: { campaigns: ICampaign[] }) => (
  <Link href={ROUTES.PUBLIC.CAMPAIGNS.VOUCHERS} passHref legacyBehavior>
    <a className="block w-screen relative left-1/2 -translate-x-1/2 bg-gray-100 overflow-hidden cursor-pointer z-20">
      <Marquee gradient={false} speed={60} className="gap-8 px-4">
        {campaigns?.map((c) => (
          <div
            key={c.id}
            className="flex items-center px-6 py-2 rounded-full  transition-all duration-200 gap-4"
          >
            <span className="font-semibold text-red-500 text-xs">{c.name}</span>
          </div>
        ))}
      </Marquee>
    </a>
  </Link>
);

export default CampaignsMarquee;