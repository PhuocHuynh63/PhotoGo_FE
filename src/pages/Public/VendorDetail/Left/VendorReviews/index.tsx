"use client"
import { useState, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import { PAGES } from "../../../../../types/IPages"
import { IVendor } from "@models/vendor/common.model"
import WriteReview from "./components/WriteReview"
import ReviewsSummary from "./components/ReviewsSummary"
import Filters from "./components/Filters"
import ReviewsList from "./components/ReviewsList"
import { useReviewsByVendorId } from "@hooks/useReview"

const VendorReviewsPage = ({ vendor, review }: PAGES.IReviewProps) => {
  /**
   * Define state
   */
  const [activeTab, setActiveTab] = useState<string>("Đánh giá");
  //------------------------End------------------------//

  const vendorData = vendor?.data as IVendor;

  /**
   * State for rating filter, sort options, and their handlers
   */
  const [ratingFilter, setRatingFilter] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<"created_at" | "rating" | undefined>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectSortBy, setSelectSortBy] = useState<string | undefined>('newest-first');
  const selectSortBySwC = (key: string) => {
    switch (key) {
      case 'newest-first':
        setSortBy("created_at");
        setSortDirection("desc");
        setSelectSortBy("newest-first");
        break;
      case 'oldest-first':
        setSortBy("created_at");
        setSortDirection("asc");
        setSelectSortBy("oldest-first");
        break;
      case 'highest-rated':
        setSortBy("rating");
        setSortDirection("desc");
        setSelectSortBy("highest-rated");
        break;
      case 'lowest-rated':
        setSortBy("rating");
        setSortDirection("asc");
        setSelectSortBy("lowest-rated");
        break;
      default:
        setSortBy(undefined);
        break;
    }
  }
  //------------------------End------------------------//


  /**
   * State for pagination and fetching reviews
   */
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const { data, loading, error } = useReviewsByVendorId({
    vendorId: vendorData?.id,
    current: currentPage,
    pageSize: reviewsPerPage,
    rating: ['1', '2', '3', '4', '5'].includes(ratingFilter || '') ? parseInt(ratingFilter!) : undefined,
    sortBy: sortBy,
    sortDirection: sortDirection,
  });
  //------------------------End------------------------//

  /**
   * Memoize reviews to render based on initial state or fetched data
   */
  const shouldUseInitial = currentPage === 1 &&
    ratingFilter === undefined &&
    sortBy === "created_at" &&
    sortDirection === "desc";

  const reviewsToRender = useMemo(() => {
    if (shouldUseInitial) return review?.data as any;
    return data || [] as any;
  }, [shouldUseInitial, review?.data, data]);
  //------------------------End------------------------//

  /**
   * Calculate rating counts for the summary section
   */
  const ratingCounts = useMemo(() => {
    const source = reviewsToRender?.data || [];
    return [5, 4, 3, 2, 1].map((stars: number) =>
      source.filter((r: any) => r?.rating === stars)?.length ?? 0
    );
  }, [reviewsToRender]);
  //------------------------End------------------------//
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Mobile Tabs */}
      <div className="md:hidden">
        <Tabs defaultValue="reviews" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            <TabsTrigger value="summary">Tổng quan</TabsTrigger>
            <TabsTrigger value="write">Viết đánh giá</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Reviews Summary */}
      <ReviewsSummary
        activeTab={activeTab}
        vendorData={vendorData}
        summaryReviewSource={reviewsToRender?.data}
        ratingCounts={ratingCounts}
      />

      {/* Write Review */}
      <WriteReview activeTab={activeTab} />

      {/* Filters */}
      <Filters
        activeTab={activeTab}
        selectSortBy={selectSortBy}
        setSelectSortBy={selectSortBySwC}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
      />

      {/* Reviews List */}
      <ReviewsList activeTab={activeTab} reviewsToRender={reviewsToRender} />

      {/* Pagination */}

    </div >
  );
};

export default VendorReviewsPage;