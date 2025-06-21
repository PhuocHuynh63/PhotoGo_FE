export type Rank = 'Đồng' | 'Bạc' | 'Vàng' | 'Bạch Kim' | 'Kim Cương';

export const rankConfigs: Record<Rank, {
    className?: string;
    color?: string;
    icon?: string;
}> = {
    'Đồng': {
        className: 'rank-glow-slow',
        color: '#cd7f32',
        icon: 'Medal'
    },
    'Bạc': {
        className: 'rank-glow-medium',
        color: '#a7a7ad',
        icon: 'Award'
    },
    'Vàng': {
        className: 'rank-pulse',
        color: '#ffd700',
        icon: 'Trophy'
    },
    'Bạch Kim': {
        className: 'platinum-border',
        color: '#E5E4E2',
        icon: 'Gem'
    },
    'Kim Cương': {
        className: 'diamond-border',
        color: '#00ffff',
        icon: 'Crown'
    },
};