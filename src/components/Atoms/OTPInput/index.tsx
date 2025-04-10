'use client'

import { useRef } from "react"



const OTPInput = ({ length = 6, onChange }: ICOMPONENTS.OTPInputProps) => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.replace(/\D/g, '')
        if (!value) return

        e.target.value = value[0]
        if (index < length - 1) {
            inputsRef.current[index + 1]?.focus()
        }
        triggerOnChange()
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pasteData = e.clipboardData.getData('Text').replace(/\D/g, '')
        if (!pasteData) return

        pasteData.split('').forEach((char, idx) => {
            if (idx < length) {
                const input = inputsRef.current[idx]
                if (input) {
                    input.value = char
                }
            }
        })
        triggerOnChange()
    }

    const triggerOnChange = () => {
        const otp = inputsRef.current.map(input => input?.value || '').join('')
        onChange(otp)
    }

    return (
        <div className="flex justify-between">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={el => { inputsRef.current[index] = el }}
                    maxLength={1}
                    onChange={(e) => handleChange(e, index)}
                    onPaste={handlePaste}
                    placeholder={``}
                    title={`OTP digit ${index + 1}`}
                    className="border border-grey w-12 h-12 text-center text-lg rounded"
                />
            ))}
        </div>
    )
}

export default OTPInput
