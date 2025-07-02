import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import BranchService from '@services/branch'

interface Branch {
    id: string
    address: string
    city: string
    district: string
    province: string
    ward: string
    latitude: string
    longitude: string
    name?: string
    phone?: string
    email?: string
    manager?: string
    isActive?: boolean
    openingHours?: {
        weekdays: string
        weekend: string
    }
    facilities?: string[]
    services?: string[]
    monthlyRevenue?: number
    totalBookings?: number
}

interface BranchData {
    address: string
    district: string
    ward: string
    city: string
    province: string
    latitude: number
    longitude: number
    name?: string
    phone?: string
    email?: string
    manager?: string
    isActive?: boolean
    openingHours?: {
        weekdays: string
        weekend: string
    }
    facilities?: string[]
    services?: string[]
    monthlyRevenue?: number
    totalBookings?: number
}

export const useBranches = (initialBranches: Branch[] = []) => {
    const [branches, setBranches] = useState<Branch[]>(initialBranches)
    const [loading, setLoading] = useState(false)

    // Create new branch
    const createBranch = useCallback(async (vendorId: string, branchData: BranchData) => {
        setLoading(true)
        try {
            const response = await BranchService.createBranch(vendorId, branchData) as { statusCode: number; data?: { id: string } }

            if (response?.statusCode === 200 || response?.statusCode === 201) {
                const newBranch: Branch = {
                    id: response?.data?.id || `branch${Date.now()}`,
                    address: branchData.address,
                    city: branchData.city,
                    district: branchData.district,
                    province: branchData.province,
                    ward: branchData.ward,
                    latitude: branchData.latitude.toString(),
                    longitude: branchData.longitude.toString(),
                    // name: branchData.name,
                    // phone: branchData.phone,
                    // email: branchData.email,
                    // manager: branchData.manager,
                    // isActive: branchData.isActive,
                    // openingHours: branchData.openingHours,
                    // facilities: branchData.facilities,
                    // services: branchData.services,
                    // monthlyRevenue: branchData.monthlyRevenue,
                    // totalBookings: branchData.totalBookings,
                }

                setBranches(prev => [...prev, newBranch])
                toast.success("Tạo chi nhánh thành công!")
                return { success: true, branch: newBranch }
            } else {
                toast.error("Có lỗi xảy ra khi tạo chi nhánh")
                return { success: false, error: "API Error" }
            }
        } catch (error) {
            console.error('Error creating branch:', error)
            toast.error("Có lỗi xảy ra khi tạo chi nhánh")
            return { success: false, error }
        } finally {
            setLoading(false)
        }
    }, [])

    // Update existing branch
    const updateBranch = useCallback(async (branchId: string, branchData: BranchData) => {
        setLoading(true)
        try {
            const response = await BranchService.updateBranch(branchId, branchData) as { statusCode: number; data?: { id: string } }

            if (response?.statusCode === 200 || response?.statusCode === 201) {
                const updatedBranch: Branch = {
                    id: branchId,
                    address: branchData.address,
                    city: branchData.city,
                    district: branchData.district,
                    province: branchData.province,
                    ward: branchData.ward,
                    latitude: branchData.latitude.toString(),
                    longitude: branchData.longitude.toString(),
                    // name: branchData.name,
                    // phone: branchData.phone,
                    // email: branchData.email,
                    // manager: branchData.manager,
                    // isActive: branchData.isActive,
                    // openingHours: branchData.openingHours,
                    // facilities: branchData.facilities,
                    // services: branchData.services,
                    // monthlyRevenue: branchData.monthlyRevenue,
                    // totalBookings: branchData.totalBookings,
                }

                setBranches(prev => prev.map(branch =>
                    branch.id === branchId ? updatedBranch : branch
                ))
                toast.success("Cập nhật chi nhánh thành công!")
                return { success: true, branch: updatedBranch }
            } else {
                toast.error("Có lỗi xảy ra khi cập nhật chi nhánh")
                return { success: false, error: "API Error" }
            }
        } catch (error) {
            console.error('Error updating branch:', error)
            toast.error("Có lỗi xảy ra khi cập nhật chi nhánh")
            return { success: false, error }
        } finally {
            setLoading(false)
        }
    }, [])

    // Delete branch
    const deleteBranch = useCallback(async (branchId: string) => {
        setLoading(true)
        try {
            const response = await BranchService.deleteBranch(branchId) as { statusCode: number }

            if (response?.statusCode === 200 || response?.statusCode === 204) {
                setBranches(prev => prev.filter(branch => branch.id !== branchId))
                toast.success("Xóa chi nhánh thành công!")
                return { success: true }
            } else {
                toast.error("Có lỗi xảy ra khi xóa chi nhánh")
                return { success: false, error: "API Error" }
            }
        } catch (error) {
            console.error('Error deleting branch:', error)
            toast.error("Có lỗi xảy ra khi xóa chi nhánh")
            return { success: false, error }
        } finally {
            setLoading(false)
        }
    }, [])

    // Toggle branch status
    const toggleBranchStatus = useCallback((branchId: string) => {
        setBranches(prev => prev.map(branch =>
            branch.id === branchId
                ? { ...branch, isActive: !branch.isActive }
                : branch
        ))
        toast.success("Cập nhật trạng thái chi nhánh thành công!")
    }, [])

    // Refresh branches (useful for initial load or manual refresh)
    const refreshBranches = useCallback((newBranches: Branch[]) => {
        setBranches(newBranches)
    }, [])

    return {
        branches,
        loading,
        createBranch,
        updateBranch,
        deleteBranch,
        toggleBranchStatus,
        refreshBranches,
    }
} 