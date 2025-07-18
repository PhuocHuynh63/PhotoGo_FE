"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@components/Atoms/Button";
import { Card } from "@components/Atoms/Card";
import SubscriptionFilter from "@components/Molecules/SubscriptionFilter";
import SubscriptionTable from "@components/Organisms/SubscriptionTable";
import SubscriptionDialog from "@components/Organisms/SubscriptionDialog";
import { subscriptionService } from "@services/subcription";
import { ISubscriptionPlanModel } from "@models/subcription/common.model";
import { ISubscriptionPlanRequestModel } from "@models/subcription/request.model";
import { Plus, RefreshCw, RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";

interface AdminSettingsSubscriptionsPageProps {
  initialData?: ISubscriptionPlanModel[];
  initialError?: string | null;
  initialFilters?: {
    name: string;
    isActive: string;
    planType: string;
  };
}

export default function AdminSettingsSubscriptionsPage({
  initialData = [],
  initialError = null,
  initialFilters = { name: '', isActive: '', planType: '' }
}: AdminSettingsSubscriptionsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subscriptions, setSubscriptions] = useState<ISubscriptionPlanModel[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [error, setError] = useState<string | null>(initialError);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<ISubscriptionPlanModel | null>(null);
  const [dialogLoading, setDialogLoading] = useState(false);

  // Show initial error if any
  useEffect(() => {
    if (initialError) {
      toast.error(initialError);
    }
  }, [initialError]);

  // Fetch subscriptions data with filters
  const fetchSubscriptions = async (filterParams?: {
    name?: string;
    isActive?: boolean;
    planType?: string;
  }) => {
    try {
      setLoading(true);
      const response = await subscriptionService.getSubscriptionPlans(filterParams);
      const data = response as any;
      setSubscriptions(data.data || data || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Không thể tải danh sách gói đăng ký");
    } finally {
      setLoading(false);
    }
  };

  // Since we're using API filtering, we don't need client-side filtering
  const filteredSubscriptions = subscriptions;

  // Handle filter changes and update URL
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    if (newFilters.name) params.set('name', newFilters.name);
    if (newFilters.isActive) params.set('isActive', newFilters.isActive);
    if (newFilters.planType) params.set('planType', newFilters.planType);
    
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '';
    router.push(`/admin/settings/subscriptions${newUrl}`);
  };

  // Clear all filters and update URL
  const handleClearFilters = () => {
    const clearedFilters = {
      name: "",
      isActive: "",
      planType: "",
    };
    setFilters(clearedFilters);
    router.push('/admin/settings/subscriptions');
  };

  // Handle search with current filters
  const handleSearch = () => {
    const filterParams = {
      name: filters.name || undefined,
      isActive: filters.isActive ? filters.isActive === 'true' : undefined,
      planType: filters.planType || undefined,
    };
    fetchSubscriptions(filterParams);
  };

  // Handle edit subscription
  const handleEdit = (subscription: ISubscriptionPlanModel) => {
    setEditingSubscription(subscription);
    setDialogOpen(true);
  };



  // Handle toggle subscription status
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      // Use update method to toggle status
      await subscriptionService.updateSubscriptionPlan(id, {
        isActive: !currentStatus
      } as any);
      toast.success(`Đã ${!currentStatus ? 'kích hoạt' : 'vô hiệu hóa'} gói đăng ký`);
      handleSearch(); // Refresh with current filters
    } catch (error) {
      console.error("Error toggling subscription status:", error);
      toast.error("Không thể thay đổi trạng thái gói đăng ký");
    }
  };



  // Handle create new subscription
  const handleCreateNew = () => {
    setEditingSubscription(null);
    setDialogOpen(true);
  };

  // Handle dialog save
  const handleDialogSave = async (data: ISubscriptionPlanRequestModel) => {
    try {
      setDialogLoading(true);
      
      if (editingSubscription) {
        // Update existing subscription
        await subscriptionService.updateSubscriptionPlan(editingSubscription.id, data);
        toast.success(`Đã cập nhật gói: ${data.name}`);
      } else {
        // Create new subscription
        await subscriptionService.createSubscriptionPlan(data);
        toast.success(`Đã tạo gói mới: ${data.name}`);
      }
      
      // Refresh data
      handleSearch();
      setDialogOpen(false);
      setEditingSubscription(null);
    } catch (error) {
      console.error('Error saving subscription:', error);
      toast.error(editingSubscription ? 'Không thể cập nhật gói đăng ký' : 'Không thể tạo gói đăng ký');
    } finally {
      setDialogLoading(false);
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingSubscription(null);
  };

  // Only fetch data on manual refresh, initial data comes from server
  // No auto-search needed since we use URL-based filtering with server-side rendering

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý Gói đăng ký
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý gói đăng ký cho người dùng và nhà cung cấp
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => fetchSubscriptions()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tạo gói mới
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {subscriptions.length}
          </div>
          <div className="text-sm text-gray-600">Tổng số gói</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {subscriptions.filter(s => s.isActive).length}
          </div>
          <div className="text-sm text-gray-600">Gói đang hoạt động</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">
            {subscriptions.filter(s => s.planType === 'người dùng').length}
          </div>
          <div className="text-sm text-gray-600">Gói người dùng</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {subscriptions.filter(s => s.planType === 'nhà cung cấp').length}
          </div>
          <div className="text-sm text-gray-600">Gói nhà cung cấp</div>
        </Card>
      </div>

      {/* Filter Section */}
      <SubscriptionFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onSearch={handleSearch}
      />

      {/* Results Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>
          Hiển thị {filteredSubscriptions.length} trong tổng số {subscriptions.length} gói đăng ký
        </div>
        {(filters.name || filters.isActive || filters.planType) && (
          <div className="text-blue-600">
            Đã áp dụng bộ lọc
          </div>
        )}
      </div>

      {/* Subscription Table */}
      <SubscriptionTable
        subscriptions={filteredSubscriptions}
        loading={loading}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      {/* Dialog for Create/Edit */}
      <SubscriptionDialog
        isOpen={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        subscription={editingSubscription}
        loading={dialogLoading}
      />
    </div>
  );
}