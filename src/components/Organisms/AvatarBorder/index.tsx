import React, { useRef, useLayoutEffect, useState } from 'react';
import clsx from 'clsx';
import { Rank, rankConfigs } from './rankStyles';


interface AvatarWithBorderProps {
    rank?: Rank;
    children: React.ReactNode;
}

export const AvatarWithBorder: React.FC<AvatarWithBorderProps> = ({
    rank = 'Đồng',
    children,
}) => {
    const avatarRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<number>(0);
    
    // Get rank config with fallback to default values
    const rankConfig = rankConfigs[rank as Rank] || rankConfigs['Đồng'];
    const { className = '', color = '#cd7f32' } = rankConfig;

    useLayoutEffect(() => {
        if (!avatarRef.current) return;
        const updateSize = () => {
            const rect = avatarRef.current!.getBoundingClientRect();
            setSize(Math.max(rect.width, rect.height));
        };
        updateSize();

        const resizeObserver = new window.ResizeObserver(updateSize);
        resizeObserver.observe(avatarRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const borderSize = 1;
    const borderStyle = {
        width: size + borderSize * 2,
        height: size + borderSize * 2,
        '--rank-color': color,
    } as React.CSSProperties;

    return (
        <div
            className={clsx('relative flex items-center justify-center rounded-full', className)}
            style={borderStyle}
        >
            <div
                ref={avatarRef}
                className="relative z-10 rounded-full overflow-hidden"
            >
                {children}
            </div>
        </div>
    );
};
