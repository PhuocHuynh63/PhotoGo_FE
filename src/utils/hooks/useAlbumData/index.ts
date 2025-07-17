import { useState, useEffect, useCallback } from 'react'
import albumVendorService from '@/services/albumVendor'
import toast from 'react-hot-toast'

// Type definitions for album data based on actual API response
export interface Booking {
    id: string
    userId: string
    locationId: string
    serviceConceptId: string
    date: string
    time?: string
    status?: string
    sourceType?: string
    sourceId?: string | null
    depositAmount?: string | number
    depositType?: string
    userNote?: string
    fullName?: string
    phone?: string
    email?: string
    code?: string
    priorityScore?: string
    created_at?: string
    updated_at?: string
}

export interface VendorAlbum {
    id: string
    createdAt: string
    updatedAt: string
}

// Album interface based on actual API response
export interface Album {
    id: string
    bookingId: string
    date: string
    photos: string[]
    behindTheScenes: string[]
    driveLink: string | null
    status: "chưa upload" | "đã upload"
    createdAt: string
    updatedAt: string
    booking: Booking
    vendorAlbum: VendorAlbum
}

// For backwards compatibility, map Album to Invoice format for UI
export interface Invoice {
    id: string
    bookingId: string
    voucherId?: string | null
    originalPrice: number
    discountAmount: number
    discountedPrice: number
    taxAmount: number
    feeAmount: number
    payablePrice: number
    depositAmount: number
    remainingAmount: number
    paidAmount: number
    status: string
    issuedAt: string
    updatedAt: string
    booking: Booking
    payments: unknown[]
    vendorId: string
    // Proof fields mapped from Album
    proofImages?: string[]
    proofNotes?: string
    proofUploadedAt?: string
    needsProof?: boolean
    // Additional album fields
    photos?: string[]
    behindTheScenes?: string[]
    driveLink?: string | null
}

export interface ApiResponse {
    statusCode: number
    message: string
    data: {
        data: Album[]
        pagination: {
            current: number
            pageSize: number
            totalPage: number
            totalItem: number
        }
    }
}

export interface UseAlbumDataResult {
    data: Invoice[]
    loading: boolean
    error: string | null
    refetch: () => void
}

// Function to map Album to Invoice format for UI compatibility
function mapAlbumToInvoice(album: Album): Invoice {
    return {
        id: album.id,
        bookingId: album.bookingId,
        voucherId: null,
        originalPrice: 0,
        discountAmount: 0,
        discountedPrice: 0,
        taxAmount: 0,
        feeAmount: 0,
        payablePrice: 0,
        depositAmount: 0,
        remainingAmount: 0,
        paidAmount: 0,
        status: album.status,
        issuedAt: album.createdAt,
        updatedAt: album.updatedAt,
        booking: album.booking,
        payments: [],
        vendorId: '',
        // Map album fields to proof fields
        proofImages: album.photos,
        proofNotes: '',
        proofUploadedAt: album.status === 'đã upload' ? album.updatedAt : undefined,
        needsProof: album.status === 'chưa upload',
        // Keep original album fields
        photos: album.photos,
        behindTheScenes: album.behindTheScenes,
        driveLink: album.driveLink
    }
}

export const useAlbumData = (locationId: string, date: string, albumStatus: "tất cả" | "chưa upload" | "đã upload"): UseAlbumDataResult => {
    const [data, setData] = useState<Invoice[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAlbumData = useCallback(async () => {
        if (!locationId || !date) return

        setLoading(true)
        setError(null)

        try {
            const response = await albumVendorService.getAlbumByLocation(
                locationId,
                date,
                1, // current page
                10, // page size
                'date', // sortBy
                'desc', // sortDirection
                albumStatus === "tất cả" ? undefined : albumStatus // albumStatus
            ) as ApiResponse

            if (response?.statusCode === 200 && response?.data?.data) {
                const albums = response.data.data
                const mappedInvoices = albums.map(mapAlbumToInvoice)
                setData(mappedInvoices)
            } else {
                setData([])
            }
        } catch (err: unknown) {
            console.error('Error fetching album data:', err)
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu'
            setError(errorMessage)
            toast.error('Không thể tải dữ liệu album')
            setData([])
        } finally {
            setLoading(false)
        }
    }, [locationId, date, albumStatus])

    useEffect(() => {
        fetchAlbumData()
    }, [fetchAlbumData])

    const refetch = () => {
        fetchAlbumData()
    }

    return {
        data,
        loading,
        error,
        refetch
    }
} 