'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from './index.module.scss';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@routes';
import LoadingPage from '@components/Organisms/Loading';
import { campaignService } from '@services/campaign';
import toast from 'react-hot-toast';

// Định nghĩa kiểu dữ liệu cho response
interface AcceptInviteResponse {
    statusCode?: number;
    message?: string;
    // Nếu cần mở rộng, có thể thêm Record<string, unknown> hoặc các trường cụ thể khác
}
// Định nghĩa kiểu dữ liệu cho error
interface AcceptInviteError {
    response?: { data?: { message?: string } };
    message?: string;
}

const AcceptCampaignInvite = () => {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loadingApi, setLoadingApi] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');
        setToken(urlToken);

        const processInvite = async () => {
            if (!urlToken) {
                toast.error('Token không hợp lệ');
                setSuccess(false);
                setLoadingApi(false);
                return;
            }
            setLoadingApi(true);
            try {
                const response = await campaignService.acceptCampaignInvite(urlToken) as AcceptInviteResponse;
                if (response && (response.statusCode === 200 || response.statusCode === undefined)) {
                    setSuccess(true);
                } else {
                    setSuccess(false);
                    toast.error(response?.message || 'Tham gia chiến dịch thất bại!');
                }
            } catch (err: unknown) {
                setSuccess(false);
                // Xử lý lỗi từ axios/fetch hoặc custom error
                let errorMsg = 'Tham gia chiến dịch thất bại!';
                if (typeof err === 'object' && err !== null) {
                    const maybeResponse = (err as AcceptInviteError).response;
                    if (maybeResponse && maybeResponse.data && typeof maybeResponse.data.message === 'string') {
                        errorMsg = maybeResponse.data.message;
                    } else if ('message' in err && typeof (err as AcceptInviteError).message === 'string') {
                        errorMsg = (err as AcceptInviteError).message as string;
                    }
                }
                toast.error(errorMsg);
            } finally {
                setLoadingApi(false);
            }
        };
        processInvite();
    }, [router]);

    useEffect(() => {
        if (!token) return;
        // Only run confetti logic if it's a subscription payment
        if (!token) {
            return; // Exit if not a subscription payment, so confetti doesn't run unnecessarily
        }

        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
            setCurrentTime(timeString);
        };

        updateTime();

        const createConfetti = () => {
            const colors = [
                '#ff6b35', '#f7931e', '#ffab00', '#ff8a50', '#ffc947',
                '#ff69b4', '#9370db', '#32cd32', '#00ced1', '#ff4757',
                '#3742fa', '#2ed573', '#ffa502', '#ff6348', '#5f27cd'
            ];

            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = styles.confetti;
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDelay = '0s';
                    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';

                    const shapeType = Math.floor(Math.random() * 4);
                    if (shapeType === 0) {
                        confetti.style.borderRadius = '50%';
                    } else if (shapeType === 1) {
                        confetti.style.borderRadius = '0';
                        confetti.style.transform = 'rotate(45deg)';
                    } else if (shapeType === 2) {
                        confetti.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                    } else {
                        confetti.style.clipPath = 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)';
                    }

                    const container = document.querySelector(`.${styles.confettiContainer}`);
                    if (container) {
                        container.appendChild(confetti);
                    }

                    setTimeout(() => {
                        confetti.remove();
                    }, 6000);
                }, i * 50);
            }
        };

        const initialTimeout = setTimeout(createConfetti, 500);
        const confettiInterval = setInterval(createConfetti, 8000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(confettiInterval);
        };
    }, [token]); // Add pageData?.subscriptionPaymentId to dependency array


    // Render logic based on states
    if (loadingApi) { // Add pageData === null check to show loading initially
        return <LoadingPage />;
    }

    if (success && token) {
        return (
            <div className={styles.pageWrapper}>
                <Head>
                    <title>Chấp nhận lời mời tham gia chiến dịch thành công</title>
                    <meta name="description" content="Bạn đã chấp nhận lời mời tham gia chiến dịch của PhotoGo thành công!" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>

                <div className={styles.confettiContainer}>
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className={styles.confetti}
                            style={{
                                left: `${(i * 7 + 5)}%`,
                                animationDelay: `-${i * 0.2}s`,
                                animationDuration: `${3 + Math.random() * 2}s`
                            }}
                        />
                    ))}

                    {[...Array(8)].map((_, i) => (
                        <div
                            key={`particle-${i}`}
                            className={styles.floatingParticle}
                            style={{
                                left: `${10 + i * 12}%`,
                                top: `${15 + (i % 3) * 25}%`,
                                width: `${6 + Math.random() * 8}px`,
                                height: `${6 + Math.random() * 8}px`,
                                animationDelay: `-${i * 0.5}s`
                            }}
                        />
                    ))}
                </div>

                <div className={styles.mainContent}>
                    <div className={styles.successCard}>
                        <div className={styles.successIcon}>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        </div>

                        <h1 className={styles.successTitle}>
                            🎉 Chúc mừng bạn đã tham gia chiến dịch! 🎉
                        </h1>

                        <p className={styles.successMessage}>
                            Bạn đã chấp nhận lời mời tham gia chiến dịch thành công.<br />
                            Hãy kiểm tra email để biết thêm chi tiết về chiến dịch.
                        </p>

                        <div className={styles.orderDetails}>
                            <h3>📋 Thông tin chiến dịch</h3>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Mã chiến dịch:</span>
                                <span className={styles.value}>#PG-CAMPAIGN-0001</span>
                            </div>
                            {/* Nếu có tên chiến dịch thì hiển thị, nếu không thì có thể bỏ dòng này */}
                            {/* <div className={styles.detailRow}>
                                <span className={styles.label}>Tên chiến dịch:</span>
                                <span className={styles.value}>Chiến dịch Mùa Hè Sôi Động</span>
                            </div> */}
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Thời gian:</span>
                                <span className={styles.value}>{currentTime}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Trạng thái:</span>
                                <span className={`${styles.value} ${styles.success}`}>✅ Đã tham gia</span>
                            </div>
                        </div>

                        <div className={styles.nextSteps}>
                            <h3>🚀 Bước tiếp theo</h3>
                            <ul>
                                <li>Kiểm tra email để nhận thông tin chi tiết về chiến dịch</li>
                                <li>Quản trị viên hoặc người tổ chức sẽ liên hệ với bạn nếu cần</li>
                                <li>Theo dõi tiến trình chiến dịch trên hệ thống</li>
                            </ul>
                        </div>

                        <div className={styles.actionButtons}>
                            <Link href={ROUTES.VENDOR.PROFILE} className={`${styles.btn} ${styles.btnSecondary}`}>
                                Về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Nếu không thành công, không render gì (hoặc có thể render giao diện thất bại nếu muốn)
    return null;
};

export default AcceptCampaignInvite;