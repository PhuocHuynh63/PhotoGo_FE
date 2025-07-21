'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from './index.module.scss';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@routes';
import paymentService from '@services/payment';
import LoadingPage from '@components/Organisms/Loading';

const SuccessPage = () => {
    /**
     * Handle payment success of order
     */
    const router = useRouter();
    let paymentId = null;
    let subscriptionPaymentId = null;
    const handlePaymentSuccess = async () => {
        const params = new URLSearchParams(window.location.search);
        paymentId = params.get("paymentId");
        subscriptionPaymentId = params.get("subscriptionPaymentId");
        const status = params.get("status");
        const code = params.get("code");
        const payosId = params.get("id");
        const cancel = params.get("cancel");
        const orderCode = params.get("orderCode");
        // console.log(paymentId, status, code, payosId, cancel, orderCode)

        if (!paymentId || !status || !code || !payosId || !cancel || !orderCode || !subscriptionPaymentId) {
            router.push(ROUTES.PUBLIC.HOME);
            return;
        }

        const data = {
            status,
            code,
            id: payosId,
            cancel: Boolean(cancel),
            orderCode
        };

        await paymentService.paymentSuccess(paymentId, data) as { statusCode: number };
        // if (response.statusCode === 200) {
        const ordersUrl = `${ROUTES.USER.PROFILE.ORDERS}?id=${payosId}`;
        router.push(ordersUrl);
        return;
        // } else {
        //     router.push(ROUTES.PUBLIC.HOME);
        //     return;
        // }
    }

    useEffect(() => {
        handlePaymentSuccess();
    }, [router]);

    if (paymentId) {
        return (
            <LoadingPage />
        )
    }
    //-------------------------End-------------------------//

    if (subscriptionPaymentId) {
        /**
         * Handle confetti
         */
        const [currentTime, setCurrentTime] = useState('');

        useEffect(() => {
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

            // Tạo confetti động
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

                        // Random shapes
                        const shapeType = Math.floor(Math.random() * 4);
                        if (shapeType === 0) {
                            confetti.style.borderRadius = '50%'; // Circle
                        } else if (shapeType === 1) {
                            confetti.style.borderRadius = '0'; // Square
                            confetti.style.transform = 'rotate(45deg)';
                        } else if (shapeType === 2) {
                            confetti.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)'; // Triangle
                        } else {
                            confetti.style.clipPath = 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)'; // Diamond
                        }

                        // Append to fixed container
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

            // Confetti burst ban đầu
            const initialTimeout = setTimeout(createConfetti, 500);

            // Lặp lại confetti
            const confettiInterval = setInterval(createConfetti, 8000);

            return () => {
                clearTimeout(initialTimeout);
                clearInterval(confettiInterval);
            };
        }, []);

        return (
            <div className={styles.pageWrapper}>
                <Head>
                    <title>Thanh toán thành công - PhotoGo</title>
                    <meta name="description" content="Cảm ơn bạn đã mua gói dịch vụ của PhotoGo!" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>

                {/* Container cho confetti và particles - fixed để không ảnh hưởng scroll */}
                <div className={styles.confettiContainer}>
                    {/* Static confetti */}
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

                    {/* Floating particles */}
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

                {/* Main content */}
                <div className={styles.mainContent}>
                    <div className={styles.successCard}>
                        {/* Success Icon */}
                        <div className={styles.successIcon}>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        </div>

                        {/* Title */}
                        <h1 className={styles.successTitle}>
                            🎉 Chúc Mừng! 🎉
                        </h1>

                        {/* Message */}
                        <p className={styles.successMessage}>
                            Cảm ơn bạn đã tin tưởng và mua gói dịch vụ của chúng tôi.<br />
                            Thanh toán của bạn đã được xử lý thành công!
                        </p>

                        {/* Order Details */}
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

                        {/* Next Steps */}
                        <div className={styles.nextSteps}>
                            <h3>🚀 Bước tiếp theo</h3>
                            <ul>
                                <li>Kiểm tra email để nhận thông tin chi tiết</li>
                                <li>Photographer sẽ liên hệ trong 24h tới</li>
                                <li>Chuẩn bị cho buổi chụp tuyệt vời!</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className={styles.actionButtons}>
                            <Link href="/dashboard" className={`${styles.btn} ${styles.btnPrimary}`}>
                                Xem đơn hàng
                            </Link>
                            <Link href="/" className={`${styles.btn} ${styles.btnSecondary}`}>
                                Về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default SuccessPage;