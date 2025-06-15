export type Rank = 'Đồng' | 'Bạc' | 'Vàng' | 'Kim Cương';

export const rankConfigs: Record<Rank, {
    className: string;
    color: string;
}> = {
    'Đồng': {
        className: 'rank-glow-slow',
        color: '#cd7f32',
    },
    'Bạc': {
        className: 'rank-glow-medium',
        color: '#c0c0c0',
    },
    'Vàng': {
        className: 'rank-pulse',
        color: '#ffd700',
    },
    'Kim Cương': {
        className: 'glowing',
        color: '#00ffff',
    },
};