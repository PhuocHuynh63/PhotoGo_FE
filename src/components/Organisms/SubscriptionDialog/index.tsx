"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/Atoms/ui/dialog";
import Button from "@components/Atoms/Button";
import Input from "@components/Atoms/Input";
import Select from "@components/Atoms/Select";
import TipTapEditor from "@components/Organisms/TipTapEditor";
import { ISubscriptionPlanModel } from "@models/subcription_plan/common.model";
import { ISubscriptionPlanRequestModel } from "@models/subcription_plan/request.model";

interface SubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ISubscriptionPlanRequestModel) => void;
  subscription?: ISubscriptionPlanModel | null;
  loading?: boolean;
}

interface FormData {
  name: string;
  description: string;
  priceForMonth: number;
  priceForYear: number;
  isActive: boolean;
  planType: string;
  billingCycle: string;
}

const SubscriptionDialog: React.FC<SubscriptionDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  subscription,
  loading = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    priceForMonth: 0,
    priceForYear: 0,
    isActive: true,
    planType: "người dùng",
    billingCycle: "hàng tháng",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or subscription changes
  useEffect(() => {
    if (isOpen) {
      if (subscription) {
        // Edit mode
        setFormData({
          name: subscription.name,
          description: subscription.description || "",
          priceForMonth: parseInt(subscription.priceForMonth?.toString() || "0") || 0,
          priceForYear: parseInt(subscription.priceForYear?.toString() || "0") || 0,
          isActive: subscription.isActive,
          planType: subscription.planType as "người dùng" | "nhà cung cấp",
          billingCycle: subscription.billingCycle as "hàng tháng" | "hàng năm",
        });
      } else {
        // Create mode
        setFormData({
          name: "",
          description: "",
          priceForMonth: 0,
          priceForYear: 0,
          isActive: true,
          planType: "người dùng",
          billingCycle: "hàng tháng",
        });
      }
      setErrors({});
    }
  }, [isOpen, subscription]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên gói là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    if (formData.priceForMonth <= 0) {
      newErrors.priceForMonth = "Giá tháng phải lớn hơn 0";
    }

    if (formData.priceForYear <= 0) {
      newErrors.priceForYear = "Giá năm phải lớn hơn 0";
    }

    if (!formData.planType) {
      newErrors.planType = "Loại gói là bắt buộc";
    }

    if (!formData.billingCycle) {
      newErrors.billingCycle = "Chu kỳ thanh toán là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Convert to API format
      const requestData: ISubscriptionPlanRequestModel = {
        name: formData.name,
        description: formData.description,
        priceForMonth: formData.priceForMonth,
        priceForYear: formData.priceForYear,
        isActive: formData.isActive,
        planType: formData.planType as "người dùng" | "nhà cung cấp",
        billingCycle: formData.billingCycle as "hàng tháng" | "hàng năm",
      };
      onSave(requestData);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-6 resize-none"
        style={{
          resize: 'none',
          userSelect: 'none',
          minWidth: '768px',
          maxWidth: '768px',
          width: '768px'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {subscription ? "Chỉnh sửa gói đăng ký" : "Tạo gói đăng ký mới"}
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên gói *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("name", e.target.value)
              }
              placeholder="Nhập tên gói đăng ký"
              className={errors.name ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description with TipTap */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả *
            </label>
            <TipTapEditor
              value={formData.description}
              onChange={(value: string) => handleInputChange("description", value)}
              placeholder="Nhập mô tả gói đăng ký..."
              disabled={loading}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Price Fields - Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price for Month */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá hàng tháng (VNĐ) *
              </label>
              <Input
                type="number"
                value={formData.priceForMonth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("priceForMonth", Number(e.target.value))
                }
                placeholder="0"
                min="0"
                step="1000"
                className={errors.priceForMonth ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.priceForMonth && (
                <p className="mt-1 text-sm text-red-600">{errors.priceForMonth}</p>
              )}
            </div>

            {/* Price for Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá hàng năm (VNĐ) *
              </label>
              <Input
                type="number"
                value={formData.priceForYear}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("priceForYear", Number(e.target.value))
                }
                placeholder="0"
                min="0"
                step="1000"
                className={errors.priceForYear ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.priceForYear && (
                <p className="mt-1 text-sm text-red-600">{errors.priceForYear}</p>
              )}
            </div>
          </div>

          {/* Plan Type & Billing Cycle - Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Plan Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại gói
              </label>
              <Select
                value={formData.planType}
                onValueChange={(value: string) => handleInputChange("planType", value)}
                options={[
                  { value: "người dùng", name: "Người dùng" },
                  { value: "nhà cung cấp", name: "Nhà cung cấp" }
                ]}
                disabled={loading}
              />
              {errors.planType && (
                <p className="mt-1 text-sm text-red-600">{errors.planType}</p>
              )}
            </div>

            {/* Billing Cycle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chu kỳ thanh toán
              </label>
              <Select
                value={formData.billingCycle}
                onValueChange={(value: string) => handleInputChange("billingCycle", value)}
                options={[
                  { value: "hàng tháng", name: "Hàng tháng" },
                  { value: "hàng năm", name: "Hàng năm" }
                ]}
                disabled={loading}
              />
              {errors.billingCycle && (
                <p className="mt-1 text-sm text-red-600">{errors.billingCycle}</p>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange("isActive", e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={loading}
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Kích hoạt gói
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t">
          <Button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            {subscription ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
