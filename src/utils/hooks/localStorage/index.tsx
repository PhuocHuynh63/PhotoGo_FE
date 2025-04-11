'use client'

import { useEffect, useState } from "react"

/**
 * Custom hook to get a value in local storage.
 * @param key - The key of the local storage item to get
 * @returns 
 */
export const useGetLocalStorage = (key: string) => {
    const [value, setValue] = useState<string | null>(null)
    const [isReady, setIsReady] = useState<boolean>(false)

    useEffect(() => {
        const storedValue = localStorage.getItem(key)
        setValue(storedValue)
        setIsReady(true)
    }, [])

    return { value, isReady }
}


/**
 *  Custom hook to remove a value in local storage.
 * @param key - The key of the local storage item to set
 */
export const useRemoveLocalStorage = (key: string) => {
    useEffect(() => {
        localStorage.removeItem(key)
    }, [key])
}