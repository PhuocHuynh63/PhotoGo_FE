'use client'

import React from "react";

interface HeroSectionProps {
  isVisible?: boolean;
  image: string;
  firstName: string;
  addressLocation: string;
  studioName: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isVisible, image, firstName, addressLocation, studioName }) => (
  <div
    id="hero-section"
    data-animate
    className={`relative h-[50vh] max-h-[450px] rounded-2xl overflow-hidden shadow-xl border border-gray-100 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
    style={{
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(to top, rgba(1, 2, 3, 0.7) 0%, rgba(1, 2, 3, 0.3) 60%, rgba(1, 2, 3, 0) 100%)",
      }}
    />
    <div className="absolute bottom-0 left-0 p-8 text-white">
      <h1 className="text-4xl md:text-6xl font-extrabold">Chào, {firstName}!</h1>
      <p className="text-sm md:text-xl mt-2 opacity-90">Hẹn gặp bạn tại {studioName}!</p>
      <p className="text-sm md:text-sm mt-2 text-gray-200 opacity-90">Địa chỉ: {addressLocation}</p>
    </div>
  </div>
);

export default HeroSection; 