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
        <div className="min-h-screen bg-white mt-14">
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
                        VỀ PHOTOGO
                    </motion.h1>
                    <motion.p
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        Nền tảng duy nhất của bạn để đặt lịch với các nhiếp ảnh gia, studio và nghệ sĩ trang điểm chuyên nghiệp. Ghi lại khoảnh khắc hoàn hảo của bạn một cách dễ dàng, nhanh chóng và minh bạch.
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
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Câu Chuyện PhotoGo</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                PhotoGo ra đời với mong muốn trở thành cầu nối giữa khách hàng và các nhiếp ảnh gia, studio, nghệ sĩ trang điểm hàng đầu. Chúng tôi nhận thấy nhu cầu ghi lại những khoảnh khắc đẹp ngày càng lớn, nhưng việc tìm kiếm, đặt lịch các dịch vụ liên quan lại rời rạc, thiếu minh bạch và mất thời gian.
                            </p>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Với PhotoGo, mọi nhu cầu chụp ảnh, trang điểm, thuê studio đều được giải quyết chỉ trong một nền tảng duy nhất. Chúng tôi cam kết mang đến trải nghiệm đặt lịch nhanh chóng, đa dạng lựa chọn, giá cả rõ ràng và dịch vụ chuyên nghiệp.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Hành trình của PhotoGo vẫn đang tiếp tục, với mục tiêu giúp hàng ngàn khách hàng lưu giữ những khoảnh khắc ý nghĩa nhất trong cuộc sống.
                            </p>
                        </motion.div>
                        <motion.div
                            className="relative flex justify-center items-center"
                            initial={{ opacity: 0, x: 50 }}
                            animate={isStoryInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Image
                                src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_orange_jslflw.svg"
                                alt="Câu chuyện của PhotoGo"
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
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Sứ Mệnh & Giá Trị Cốt Lõi</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            PhotoGo hướng tới việc đơn giản hóa quá trình đặt lịch chụp ảnh, trang điểm, giúp khách hàng tiết kiệm thời gian, chi phí và nhận được dịch vụ tốt nhất.
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
                                title: "Tiện Lợi & Nhanh Chóng",
                                description: "Đặt lịch mọi dịch vụ chỉ trong vài phút, thao tác đơn giản, tiết kiệm thời gian cho khách hàng."
                            },
                            {
                                icon: "⭐",
                                title: "Đa Dạng & Chuyên Nghiệp",
                                description: "Hàng trăm nhiếp ảnh gia, studio, makeup artist với nhiều phong cách, kinh nghiệm, đáp ứng mọi nhu cầu."
                            },
                            {
                                icon: "🔒",
                                title: "Minh Bạch & Uy Tín",
                                description: "Giá cả rõ ràng, đánh giá thực tế từ khách hàng, cam kết chất lượng dịch vụ."
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
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Dịch Vụ Nổi Bật</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            PhotoGo cung cấp đầy đủ các dịch vụ chụp ảnh, trang điểm, thuê studio để đáp ứng mọi nhu cầu của bạn.
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
                                title: "Nhiếp Ảnh Gia",
                                img: "https://res.cloudinary.com/dodtzdovx/image/upload/v1753273724/Nhiepanh-Gia-Large-01_ixkj80.jpg",
                                description: "Tìm kiếm và đặt lịch với nhiếp ảnh gia phù hợp, đa dạng phong cách, linh hoạt về thời gian và địa điểm."
                            },
                            {
                                gradient: "from-green-500 to-green-700",
                                title: "Studio Chụp Ảnh",
                                img: "https://res.cloudinary.com/dodtzdovx/image/upload/v1753274116/studio-chup-anh-do-noi-that-tan-noi-vietnam_hsq8p7.jpg",
                                description: "Đặt phòng studio hiện đại, trang bị đầy đủ, nhiều phông nền, ánh sáng chuyên nghiệp."
                            },
                            {
                                gradient: "from-purple-500 to-purple-700",
                                title: "Makeup Artist",
                                img: "https://res.cloudinary.com/dodtzdovx/image/upload/v1753273724/Makeup-Artist-noi-tieng-Viet-Nam-1_ebtfrg.jpg",
                                description: "Trang điểm chuyên nghiệp cho mọi buổi chụp ảnh, đa dạng phong cách, sản phẩm chất lượng cao."
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
                                            src={service.img}
                                            alt={service.title}
                                            width={300}
                                            height={200}
                                            className="w-full h-full object-cover opacity-20"
                                        />
                                        <div className="absolute inset-0 bg-opacity-40 flex items-end p-6">
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
                            Lắng nghe cảm nhận thực tế từ những khách hàng đã sử dụng PhotoGo
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
                                name: "Phạm Thị Hạnh",
                                position: "Khách hàng chụp ảnh cưới",
                                quote: "Tôi rất hài lòng khi đặt lịch chụp ảnh cưới qua PhotoGo. Nhiếp ảnh gia chuyên nghiệp, hỗ trợ tận tình và giá cả rõ ràng!"
                            },
                            {
                                name: "Nguyễn Minh Quân",
                                position: "Khách hàng thuê studio",
                                quote: "Studio trên PhotoGo rất đa dạng, dễ dàng so sánh và đặt lịch. Mình đã có bộ ảnh kỷ yếu tuyệt đẹp cùng bạn bè."
                            },
                            {
                                name: "Lê Thị Mai",
                                position: "Khách hàng makeup",
                                quote: "Mình book makeup artist qua PhotoGo cho buổi chụp ảnh gia đình, rất ưng ý vì được tư vấn kỹ và trang điểm hợp phong cách."
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
                        Sẵn Sàng Ghi Lại Khoảnh Khắc Của Bạn?
                    </motion.h2>
                    <motion.p
                        className="text-xl mb-8 opacity-90 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        Đặt lịch ngay với nhiếp ảnh gia, studio hoặc makeup artist trên PhotoGo để trải nghiệm dịch vụ chuyên nghiệp, tiện lợi và minh bạch.
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
                                Khám Phá Dịch Vụ
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    )
}
