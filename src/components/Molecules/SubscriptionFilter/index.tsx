"use client";

import React from "react";
import Input from "@components/Atoms/Input";
import Select from "@components/Atoms/Select";
import Button from "@components/Atoms/Button";
import { Search, Filter, RotateCcw } from "lucide-react";

interface SubscriptionFilterProps {
  filters: {
    name: string;
    isActive: string;
    planType: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  onSearch: () => void;
}

const SubscriptionFilter: React.FC<SubscriptionFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  onSearch,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Search by Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Tìm kiếm theo tên
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="name"
              value={filters.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange("name", e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Filter by Active Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Lọc theo trạng thái hoạt động
          </label>
          <Select
            value={filters.isActive || undefined}
            onValueChange={(value: string) => onFilterChange("isActive", value || "")}
            options={[
              { value: "true", name: "Hoạt động" },
              { value: "false", name: "Không hoạt động" }
            ]}
            placeHolder="--"
          />
        </div>

        {/* Filter by Plan Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Loại gói đăng ký
          </label>
          <Select
            value={filters.planType || undefined}
            onValueChange={(value: string) => onFilterChange("planType", value || "")}
            options={[
              { value: "user", name: "Người dùng" },
              { value: "vendor", name: "Nhà cung cấp" }
            ]}
            placeHolder="--"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onSearch}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Filter className="w-4 h-4" />
            Áp dụng bộ lọc
          </Button>
          <Button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Đặt lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFilter;
