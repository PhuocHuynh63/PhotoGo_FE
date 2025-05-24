'use client'

import Image from "next/image"
import { Card, CardContent } from "@/components/Atoms/ui/card"
import { Star } from "lucide-react"
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link"
import Button from "@components/Atoms/Button";

export default function AboutPage() {

    const [cusSatisfied] = useState(5000);
    const [cusSatisfiedAnimated, setCusSatisfiedAnimated] = useState(0);
    const [projectsCompleted] = useState(1000);
    const [projectsCompletedAnimated, setProjectsCompletedAnimated] = useState(0);
    const [hoursWorked] = useState(50000);
    const [hoursWorkedAnimated, setHoursWorkedAnimated] = useState(0);
    const [employees] = useState(100);
    const [employeesAnimated, setEmployeesAnimated] = useState(0);

    const statsRef = useRef(null);
    const storyRef = useRef(null);
    const missionRef = useRef(null);
    const servicesRef = useRef(null);
    const testimonialsRef = useRef(null);

    const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
    const isStoryInView = useInView(storyRef, { once: true, margin: "-100px" });
    const isMissionInView = useInView(missionRef, { once: true, margin: "-100px" });
    const isServicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
    const isTestimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isStatsInView) {
            const animateValue = (
                start: number,
                end: number,
                duration: number,
                setValue: (value: number) => void
            ) => {
                let startTime: number | null = null;
                const initialValue = start;
                const diff = end - initialValue;

                const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

                const step = (timestamp: number) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    const eased = easeOutCubic(progress);
                    setValue(Math.floor(initialValue + diff * eased));
                    if (progress < 1) requestAnimationFrame(step);
                };

                requestAnimationFrame(step);
            };

            // Animate all values
            animateValue(0, cusSatisfied, 1000, setCusSatisfiedAnimated);
            animateValue(0, projectsCompleted, 1000, setProjectsCompletedAnimated);
            animateValue(0, hoursWorked, 1000, setHoursWorkedAnimated);
            animateValue(0, employees, 1000, setEmployeesAnimated);
        }
    }, [isStatsInView, cusSatisfied, projectsCompleted, hoursWorked, employees]);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <motion.header
                className="bg-gray-100 py-16"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        VỀ CHÚNG TÔI
                    </motion.h1>
                    <motion.p
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        Khám phá câu chuyện, sứ mệnh và giá trị cốt lõi của chúng tôi
                    </motion.p>
                </div>
            </motion.header>

            {/* Our Story Section */}
            <section className="py-16" ref={storyRef}>
                <div className="container mx-auto px-4">
                    <motion.div
                        className="grid md:grid-cols-2 gap-12 items-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={isStoryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={isStoryInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Câu Chuyện Của Chúng Tôi</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Được thành lập vào năm 2020, chúng tôi bắt đầu với một tầm nhìn đơn giản: mang đến những giải pháp công
                                nghệ tốt nhất cho doanh nghiệp Việt Nam. Từ một đội ngũ nhỏ gồm 5 người, chúng tôi đã phát triển thành
                                một công ty với hơn 100 nhân viên tài năng.
                            </p>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Chúng tôi tin rằng công nghệ không chỉ là công cụ, mà là cầu nối giúp kết nối con người và tạo ra những
                                giá trị thực sự cho xã hội. Với tinh thần đổi mới không ngừng, chúng tôi luôn nỗ lực để đem lại những
                                trải nghiệm tuyệt vời nhất cho khách hàng.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Hành trình của chúng tôi vẫn đang tiếp tục, và chúng tôi tự hào là đối tác tin cậy của hàng nghìn doanh
                                nghiệp trên khắp Việt Nam.
                            </p>
                        </motion.div>
                        <motion.div
                            className="relative flex justify-center items-center"
                            initial={{ opacity: 0, x: 50 }}
                            animate={isStoryInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Image
                                src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744874818/tai-sao-can-biet-cach-tao-dang-khi-chup-anh-2-1024x683_u3odis.jpg"
                                alt="Câu chuyện của chúng tôi"
                                width={500}
                                height={400}
                                className="rounded-lg shadow-lg"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Values Section */}
            <section className="py-16 bg-gray-50" ref={missionRef}>
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Sứ Mệnh & Giá Trị</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Những nguyên tắc cốt lõi định hướng mọi hoạt động của chúng tôi
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        initial={{ opacity: 0, y: 50 }}
                        animate={isMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {[
                            {
                                icon: "🎯",
                                title: "Cam Kết Chất Lượng",
                                description: "Chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất lượng cao nhất, đáp ứng và vượt qua mong đợi của khách hàng."
                            },
                            {
                                icon: "⭐",
                                title: "Chất Lượng & Xuất Sắc",
                                description: "Sự xuất sắc không phải là một hành động mà là một thói quen. Chúng tôi luôn phấn đấu để đạt được tiêu chuẩn cao nhất trong mọi việc."
                            },
                            {
                                icon: "🔒",
                                title: "Hiệu Quả & Minh Bạch",
                                description: "Chúng tôi hoạt động với sự minh bạch tuyệt đối và tập trung vào việc mang lại hiệu quả tối đa cho mọi dự án."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            >
                                <Card className="text-center p-6 border-none shadow-lg">
                                    <CardContent className="pt-6">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">{item.icon}</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                                        <p className="text-gray-600">{item.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16" ref={servicesRef}>
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Dịch Vụ Của Chúng Tôi</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Chúng tôi cung cấp đa dạng các dịch vụ để đáp ứng mọi nhu cầu của khách hàng
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        initial={{ opacity: 0, y: 50 }}
                        animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {[
                            {
                                gradient: "from-blue-500 to-blue-700",
                                title: "Phát Triển Ứng Dụng",
                                description: "Xây dựng ứng dụng di động và web hiện đại với công nghệ tiên tiến nhất"
                            },
                            {
                                gradient: "from-green-500 to-green-700",
                                title: "Tư Vấn Số",
                                description: "Hỗ trợ doanh nghiệp chuyển đổi số và tối ưu hóa quy trình kinh doanh"
                            },
                            {
                                gradient: "from-purple-500 to-purple-700",
                                title: "Dịch Vụ Marketing",
                                description: "Chiến lược marketing số toàn diện để tăng trưởng doanh nghiệp bền vững"
                            }
                        ].map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            >
                                <Card className="relative overflow-hidden group cursor-pointer">
                                    <div className={`aspect-video bg-gradient-to-br ${service.gradient} relative`}>
                                        <Image
                                            src="/placeholder.svg?height=200&width=300"
                                            alt={service.title}
                                            width={300}
                                            height={200}
                                            className="w-full h-full object-cover opacity-20"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                                            <div className="text-white">
                                                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                                                <p className="text-sm opacity-90">{service.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 bg-gray-900 text-white" ref={statsRef}>
                <div className="container mx-auto px-4">
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2">{cusSatisfiedAnimated}+</div>
                            <div className="text-gray-300">Khách Hàng Hài Lòng</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2">{projectsCompletedAnimated}+</div>
                            <div className="text-gray-300">Dự Án Hoàn Thành</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2">{hoursWorkedAnimated}+</div>
                            <div className="text-gray-300">Giờ Làm Việc</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2">{employeesAnimated}+</div>
                            <div className="text-gray-300">Nhân Viên Tài Năng</div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-gray-50" ref={testimonialsRef}>
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isTestimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Khách Hàng Nói Gì</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Những phản hồi chân thực từ khách hàng về dịch vụ của chúng tôi
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        initial={{ opacity: 0, y: 50 }}
                        animate={isTestimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {[
                            {
                                name: "Nguyễn Văn An",
                                position: "Giám đốc ABC Company",
                                quote: "Đội ngũ rất chuyên nghiệp và nhiệt tình. Sản phẩm được giao đúng thời gian và chất lượng vượt mong đợi. Chúng tôi rất hài lòng với dịch vụ."
                            },
                            {
                                name: "Trần Thị Bình",
                                position: "CEO XYZ Tech",
                                quote: "Tôi đã làm việc với nhiều công ty khác nhưng chưa công ty nào mang lại sự hài lòng như thế này. Dịch vụ tuyệt vời, hỗ trợ 24/7."
                            },
                            {
                                name: "Lê Minh Cường",
                                position: "Founder DEF Solutions",
                                quote: "Giải pháp họ đưa ra đã giúp công ty chúng tôi tăng hiệu quả làm việc lên 300%. Đây thực sự là đối tác đáng tin cậy cho doanh nghiệp."
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isTestimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            >
                                <Card className="p-6 border-none shadow-lg">
                                    <CardContent className="pt-0">
                                        <div className="flex mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 mb-4 italic">
                                            <q>{testimonial.quote}</q>
                                        </p>
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                                            <div>
                                                <div className="font-semibold text-gray-800">{testimonial.name}</div>
                                                <div className="text-sm text-gray-500">{testimonial.position}</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <motion.section
                className="py-16 bg-gray-200 text-black"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="container mx-auto px-4 text-center">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Sẵn Sàng Bắt Đầu?
                    </motion.h2>
                    <motion.p
                        className="text-xl mb-8 opacity-90 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí và khám phá cách chúng tôi có thể giúp doanh
                        nghiệp của bạn phát triển.
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/contact">
                            <Button className="bg-[var(--bg-primary)] text-white hover:bg-[var(--bg-primary)/80]">
                                Liên Hệ Ngay
                            </Button>
                        </Link>
                        <Link href="/services">
                            <Button className="bg-[var(--bg-primary)] text-white hover:bg-[var(--bg-primary)]/80">
                                Tìm Hiểu Thêm
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    )
}
