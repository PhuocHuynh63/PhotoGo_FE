import AdminSettingsSubscriptionsPage from "@pages/Admin/Settings/Subscriptions";
import { subscriptionService } from "@services/subcription";
import { ISubscriptionPlanModel } from "@models/subcription_plan/common.model";

interface PageProps {
  searchParams: Promise<{
    name?: string;
    isActive?: string;
    planType?: string;
    sortBy?: string;
    sortDirection?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  let initialData: ISubscriptionPlanModel[] = [];
  let error: string | null = null;

  // Await searchParams as required by Next.js App Router
  const resolvedSearchParams = await searchParams;

  try {
    // Fetch initial data from API on server-side
    const params = {
      name: resolvedSearchParams.name,
      isActive: resolvedSearchParams.isActive ? resolvedSearchParams.isActive === 'true' : undefined,
      planType: resolvedSearchParams.planType,
    };

    const response = await subscriptionService.getSubscriptionPlans(params);
    const data = response as any;
    initialData = Array.isArray(data.data?.data) ? data.data.data : [];
  } catch (err) {
    console.error('Error fetching subscriptions on server:', err);
    error = 'Không thể tải danh sách gói đăng ký';
  }

  return (
    <AdminSettingsSubscriptionsPage
      initialData={initialData}
      initialError={error}
      initialFilters={{
        name: resolvedSearchParams.name || '',
        isActive: resolvedSearchParams.isActive || '',
        planType: resolvedSearchParams.planType || '',
        sortBy: resolvedSearchParams.sortBy || 'name',
        sortDirection: resolvedSearchParams.sortDirection || 'asc',
      }}
    />
  );
}
