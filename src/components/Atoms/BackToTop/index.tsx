'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowUp } from 'lucide-react'

interface BackToTopProps {
  containerRef?: React.RefObject<HTMLElement | null>
  size?: number // Kích thước tùy chỉnh (mặc định 64px)
}

export default function BackToTop({ containerRef, size = 64 }: BackToTopProps) {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const defaultContainerRef = useRef<HTMLElement | null>(null)

  // Tính toán các giá trị dựa trên kích thước
  const radius = (size * 20) / 64 // Tỷ lệ radius theo kích thước gốc
  const circumference = 2 * Math.PI * radius
  const strokeWidth = Math.max(2, size / 16) // Đảm bảo stroke không quá mỏng
  const iconSize = Math.max(16, size * 0.4) // Kích thước icon tương đối
  const fontSize = Math.max(10, size * 0.25) // Kích thước font tương đối

  // Theo dõi sự kiện cuộn
  useEffect(() => {
    // Determine which element to track for scrolling
    const scrollContainer = containerRef?.current || defaultContainerRef.current || window

    const handleScroll = () => {
      // Tính toán phần trăm cuộn
      let scrollTop, scrollHeight, clientHeight

      if (scrollContainer === window) {
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        scrollHeight = document.documentElement.scrollHeight
        clientHeight = document.documentElement.clientHeight
      } else {
        scrollTop = (scrollContainer as HTMLElement).scrollTop
        scrollHeight = (scrollContainer as HTMLElement).scrollHeight
        clientHeight = (scrollContainer as HTMLElement).clientHeight
      }

      const height = scrollHeight - clientHeight
      const scrolled = height > 0 ? (scrollTop / height) * 100 : 0

      // Cập nhật trạng thái
      setProgress(scrolled)
      setVisible(scrollTop > 100) // Reduced threshold to make it appear sooner

      // For debugging purposes only
    }

    // Set default container ref if containerRef is not provided
    if (!containerRef) {
      defaultContainerRef.current = document.querySelector('main.overflow-y-auto') as HTMLElement
    }

    // Đăng ký sự kiện
    if (scrollContainer === window) {
      window.addEventListener('scroll', handleScroll)
    } else {
      (scrollContainer as HTMLElement).addEventListener('scroll', handleScroll)
    }

    // Initial check
    handleScroll()

    // Hủy đăng ký khi component unmount
    return () => {
      if (scrollContainer === window) {
        window.removeEventListener('scroll', handleScroll)
      } else {
        (scrollContainer as HTMLElement)?.removeEventListener('scroll', handleScroll)
      }
    }
  }, [containerRef])

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    const scrollContainer = containerRef?.current || defaultContainerRef.current || window

    if (scrollContainer === window) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } else {
      (scrollContainer as HTMLElement).scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  if (!visible) {
    return null
  }

  return (
    <div className="fixed bottom-8 right-8 z-[99999] cursor-pointer" style={{ pointerEvents: 'auto' }}>
      <div className="relative cursor-pointer">
        {/* Vòng tròn tiến trình */}
        <svg
          className="rotate-[-90deg]"
          style={{ width: size, height: size }}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f97316"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * progress) / 100}
          />
        </svg>

        {/* Nút */}
        <button
          onClick={scrollToTop}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-orange-50 hover:scale-110 active:scale-95 transition-all border-2 border-orange-500 cursor-pointer"
          aria-label="Back to top"
          type="button"
        >
          {progress >= 99 ? (
            <ArrowUp style={{ width: iconSize, height: iconSize }} className="text-orange-500" />
          ) : (
            <div
              className="font-bold text-orange-500"
              style={{ fontSize: `${fontSize}px` }}
            >
              {Math.round(progress)}%
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
