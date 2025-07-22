import { useState, useCallback, useEffect } from 'react';
import { campaignService } from '@services/campaign';
import { ICampaign } from '@models/campaign/common.model';
import { ICampaignResponseModel } from '@models/campaign/reponse.model';
import { IVoucherModel } from '@models/voucher/common.model';
// You may need to adjust the import paths for models/constants below
// import { ICampaignResponseModel } from '@models/campaign/response.model';
// import { ICampaignFilter } from '@models/campaign/common.model';

// Kiểu dữ liệu cho response của getAllCampaignAndVoucher

// CampaignVoucher và CampaignWithVouchers types
export interface ICampaignVoucher {
  createdAt: string;
  updatedAt: string;
  campaignId: string;
  voucherId: string;
  assignedAt: string;
  isAvailable: boolean;
  voucher: IVoucherModel;
}

export interface ICampaignWithVouchers extends Omit<ICampaign, 'status'> {
  status: string | boolean;
  createdAt: string;
  updatedAt: string;
  campaignVouchers: ICampaignVoucher[];
}

export interface IAllCampaignAndVoucherResponse {
  statusCode: number;
  message: string;
  data: {
    data: ICampaignWithVouchers[];
    pagination: {
      current: number;
      pageSize: number;
      totalPage: number;
      totalItem: number;
    };
  };
}

export type UseCampaignsParams = {
  current?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  showAll?: string;
};

export const useCampaigns = (initialParams: UseCampaignsParams = {}) => {
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]); // Replace any with proper type
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    current: initialParams.current || 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: initialParams.pageSize || 10,
  });

  const fetchCampaigns = useCallback(async (params: UseCampaignsParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams({
        current: String(params.current ?? initialParams.current ?? 1),
        pageSize: String(params.pageSize ?? initialParams.pageSize ?? 10),
        sortBy: params.sortBy ?? initialParams.sortBy ?? 'created_at',
        sortDirection: params.sortDirection ?? initialParams.sortDirection ?? 'asc',
        status: params.status ?? initialParams.status ?? 'true',
        startDate: params.startDate ?? initialParams.startDate ?? '',
        endDate: params.endDate ?? initialParams.endDate ?? '',
        showAll: params.showAll ?? initialParams.showAll ?? 'false',
      });
      const response = await campaignService.getCampaigns(searchParams) as ICampaignResponseModel
      // You may want to adjust the following lines based on the actual response structure
      setCampaigns(response?.data?.data || []);
      if (response?.data?.pagination) {
        setPagination({
          current: response.data.pagination.current || 1,
          totalPages: response.data.pagination.totalPage || 1,
          totalItems: response.data.pagination.totalItem || 0,
          pageSize: response.data.pagination.pageSize || 10,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch campaigns'));
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  const clearError = useCallback(() => setError(null), []);

  return {
    campaigns,
    pagination,
    loading,
    error,
    fetchCampaigns,
    clearError,
  };
};

export const useAllCampaignAndVoucher = () => {
  const [campaigns, setCampaigns] = useState<ICampaignWithVouchers[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllCampaignAndVoucher = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = (await campaignService.getAllCampaignAndVoucher()) as IAllCampaignAndVoucherResponse;
      setCampaigns(response?.data?.data || []);
      setPagination(response?.data?.pagination || { current: 1, pageSize: 10, totalPage: 1, totalItem: 0 });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch all campaigns and vouchers'));
      setCampaigns([]);
      setPagination({ current: 1, pageSize: 10, totalPage: 1, totalItem: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  // Tự động fetch khi mount
  useEffect(() => {
    fetchAllCampaignAndVoucher();
  }, [fetchAllCampaignAndVoucher]);

  const clearError = useCallback(() => setError(null), []);

  return {
    campaigns,
    pagination,
    loading,
    error,
    refetch: fetchAllCampaignAndVoucher,
    clearError,
  };
};