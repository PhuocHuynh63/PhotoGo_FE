import { useState, useEffect } from 'react'
import locationService from '@/services/locations'

// Type definitions based on API response
export interface VendorLocation {
    id: string
    address: string
    district: string
    ward: string
    city: string
    province: string
    latitude: number | null
    longitude: number | null
    createdAt: string
    updatedAt: string
}

export interface VendorLocationsResponse {
    statusCode: number
    message: string
    data: VendorLocation[]
}

export interface UseVendorLocationsResult {
    data: VendorLocation[] | null
    loading: boolean
    error: string | null
    refetch: () => void
}

export const useVendorLocations = (vendorId: string, status: string = 'hoạt động'): UseVendorLocationsResult => {
    const [data, setData] = useState<VendorLocation[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchLocations = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await locationService.getOwnedLocationByVendorId(vendorId, status) as VendorLocationsResponse

            if (response.statusCode === 200) {
                setData(response.data)
            } else {
                setError(response.message || 'Có lỗi xảy ra khi tải danh sách địa điểm')
            }
        } catch (err: unknown) {
            console.error('Error fetching vendor locations:', err)
            const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách địa điểm'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (vendorId) {
            fetchLocations()
        }
    }, [vendorId, status])

    const refetch = () => {
        if (vendorId) {
            fetchLocations()
        }
    }

    return {
        data,
        loading,
        error,
        refetch
    }
} 