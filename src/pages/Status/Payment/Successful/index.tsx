'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from './index.module.scss';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@routes';
import paymentService from '@services/payment';
import LoadingPage from '@components/Organisms/Loading';
import { subscriptionService } from '@services/subcription';
import { METADATA } from '../../../../types/IMetadata'; // Ensure this path is correct

const SuccessPage = ({ session }: { session: METADATA.ISession }) => {
    const router = useRouter();
    const userId = session?.user?.id;

    // ALL HOOKS MUST BE AT THE TOP LEVEL
    const [currentTime, setCurrentTime] = useState(''); // Moved this up
    const [pageData, setPageData] = useState<{
        paymentId: string | null;
        subscriptionPaymentId: string | null;
        status: string | null;
        code: string | null;
        payosId: string | null;
        cancel: string | null;
        orderCode: string | null;
    } | null>(null);

    const [loadingApi, setLoadingApi] = useState(true);

    // Main useEffect for API calls and initial parsing
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const currentPaymentId = params.get("paymentId");
        const currentSubscriptionPaymentId = params.get("subscriptionPaymentId");
        const status = params.get("status");
        const code = params.get("code");
        const payosId = params.get("id");
        const cancel = params.get("cancel");
        const orderCode = params.get("orderCode");

        // Set the parsed data state once
        setPageData({
            paymentId: currentPaymentId,
            subscriptionPaymentId: currentSubscriptionPaymentId,
            status,
            code,
            payosId,
            cancel,
            orderCode,
        });

        const processPayment = async () => {
            if (currentPaymentId && status && code && payosId && cancel !== null && orderCode) {
                const data = {
                    status,
                    code,
                    id: payosId,
                    cancel: cancel === 'true',
                    orderCode
                };
                await paymentService.paymentSuccess(currentPaymentId, data);
                const ordersUrl = `${ROUTES.USER.PROFILE.ORDERS}?id=${payosId}`;
                router.push(ordersUrl);
            } else if (currentSubscriptionPaymentId) {
                const data = {
                    subscriptionPaymentId: currentSubscriptionPaymentId,
                    cancel: cancel === 'true',
                    orderCode: orderCode || '',
                    status: status === 'PAID' ? 'đã thanh toán' : '',
                    code: code || '',
                    id: payosId || '',
                    userId: userId || ''
                };
                const res = await subscriptionService.subscriptionSuccess(data);
                
                setLoadingApi(false);
            } else {
                router.push(ROUTES.PUBLIC.HOME);
            }
        };

        processPayment();
    }, [router, userId]); // Dependencies for useEffect

    // useEffect for confetti and current time - ALWAYS CALLED
    useEffect(() => {
        // Only run confetti logic if it's a subscription payment
        if (!pageData?.subscriptionPaymentId) {
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
    }, [pageData?.subscriptionPaymentId]); // Add pageData?.subscriptionPaymentId to dependency array


    // Render logic based on states
    if (loadingApi || pageData === null) { // Add pageData === null check to show loading initially
        return <LoadingPage />;
    }

    // Now that loadingApi is false and pageData is set, check if it's a subscription payment to render its specific UI
    if (pageData.subscriptionPaymentId) { // No optional chaining needed here, as pageData is guaranteed not null
        return (
            <div className={styles.pageWrapper}>
                <Head>
                    <title>Thanh toán thành công - PhotoGo</title>
                    <meta name="description" content="Cảm ơn bạn đã mua gói dịch vụ của PhotoGo!" />
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
                            🎉 Chúc Mừng! 🎉
                        </h1>

                        <p className={styles.successMessage}>
                            Cảm ơn bạn đã tin tưởng và mua gói dịch vụ của chúng tôi.<br />
                            Thanh toán của bạn đã được xử lý thành công!
                        </p>

                        <div className={styles.orderDetails}>
                            <h3>📋 Thông tin đơn hàng</h3>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Mã đơn hàng:</span>
                                <span className={styles.value}>#PG2025-0001</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Gói dịch vụ:</span>
                                <span className={styles.value}>Gói Premium Photography</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Thời gian:</span>
                                <span className={styles.value}>{currentTime}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Trạng thái:</span>
                                <span className={`${styles.value} ${styles.success}`}>✅ Thành công</span>
                            </div>
                        </div>

                        <div className={styles.nextSteps}>
                            <h3>🚀 Bước tiếp theo</h3>
                            <ul>
                                <li>Kiểm tra email để nhận thông tin chi tiết</li>
                                <li>Photographer sẽ liên hệ trong 24h tới</li>
                                <li>Chuẩn bị cho buổi chụp tuyệt vời!</li>
                            </ul>
                        </div>

                        <div className={styles.actionButtons}>
                            <Link href={ROUTES.PUBLIC.HOME} className={`${styles.btn} ${styles.btnSecondary}`}>
                                Về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback for cases where neither ID is found after loading, or if it's a regular payment that didn't redirect immediately.
    return null;
};

export default SuccessPage;