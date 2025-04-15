'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop({ containerRef }: { containerRef?: React.RefObject<HTMLElement | null> }) {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const defaultContainerRef = useRef<HTMLElement | null>(null)

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
      // console.log('Scroll position:', scrollTop, 'Visible:', scrollTop > 100)
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
    <div className="fixed bottom-8 right-8 z-[99999]" style={{ pointerEvents: 'auto' }}>
      <div className="relative">
        {/* Vòng tròn tiến trình */}
        <svg className="w-16 h-16 rotate-[-90deg]" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#e5e7eb" strokeWidth="4" />
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#f97316"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="125.6"
            strokeDashoffset={125.6 - (125.6 * progress) / 100}
          />
        </svg>

        {/* Nút */}
        <button
          onClick={scrollToTop}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-orange-50 hover:scale-110 active:scale-95 transition-all border-2 border-orange-500"
          aria-label="Back to top"
          type="button"
        >
          {progress >= 99 ? (
            <ArrowUp className="h-7 w-7 text-orange-500" />
          ) : (
            <div className="text-base font-bold text-orange-500">
              {Math.round(progress)}%
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
