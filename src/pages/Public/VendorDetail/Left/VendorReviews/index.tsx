"use client"
import { useState, useMemo } from "react"
import { Star, MessageCircle, Search, Filter, ChevronDown, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"
import { Input } from "@components/Atoms/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/Atoms/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@components/Atoms/ui/avatar"
import { Separator } from "@components/Atoms/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import TipTapEditor from "@components/Organisms/TipTapEditor"
import { PAGES } from "../../../../../types/IPages"
import { formatDateAgo } from "@utils/helpers/Date"

// Define interfaces to match API data structure
interface Image {
  id: string;
  imageUrl: string;
}

interface Review {
  id: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    avatarUrl: string;
  };
  booking: {
    id: string;
  };
  images: Image[];
  vendor: {
    id: string;
    name: string;
    logoUrl: string;
    bannerUrl: string;
    description: string;
    status: string;
  };
}

interface VendorData {
  id: string;
  name: string;
  logoUrl: string;
  bannerUrl: string;
  description: string;
  status: string;
  averageRating?: number; // Optional, as it may come from vendor.data
}

interface Pagination {
  current: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

const VendorReviewsPage = ({ vendor, review }: PAGES.IReviewProps) => {
  const vendorData = vendor.data;
  const apiReviews = useMemo(() => {
    // Transform images array to match expected format
    return review.data?.data.map((r) => ({
      ...r,
      images: r.images.map((url: string, index: number) => ({
        id: `image-${index}-${r.id}`, // Generate a unique ID for each image
        imageUrl: url,
      })),
    }));
  }, [review.data?.data]);
  const apiPagination = useMemo(() => review.data?.pagination, [review.data?.pagination]);

  console.log("VendorReviewsPage - API Reviews Data:", apiReviews);
  console.log("VendorReviewsPage - API Pagination Info:", apiPagination);

  const [newReview, setNewReview] = useState("");
  const [currentRating, setCurrentRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("reviews");
  const reviewsPerPage = 3;

  const renderStars = (ratingValue: number, interactive = false, size = "w-4 h-4", onClickStar?: (starIndex: number) => void) => {
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue - fullStars >= 0.25 && ratingValue - fullStars < 0.75;
    const totalStars = 5;

    return Array.from({ length: totalStars }, (_, index) => {
      const starIndex = index + 1;
      let starElement;

      if (index < fullStars) {
        starElement = <Star key={index} className={`${size} fill-yellow-400 text-yellow-400 ${interactive ? 'cursor-pointer' : ''}`} />;
      } else if (index === fullStars && hasHalfStar) {
        starElement = (
          <div key={index} className={`relative inline-block ${interactive ? 'cursor-pointer' : ''}`}>
            <Star className={`${size} text-gray-300`} />
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: "50%" }}>
              <Star className={`${size} fill-yellow-400 text-yellow-400`} />
            </div>
          </div>
        );
      } else {
        starElement = <Star key={index} className={`${size} text-gray-300 ${interactive ? 'cursor-pointer' : ''}`} />;
      }

      if (interactive && onClickStar) { 
        return <div key={index} onClick={() => onClickStar(starIndex)}>{starElement}</div>;
      }
      return starElement;
    });
  };

  const handleStarClick = (starIndex: number) => {
    setCurrentRating(starIndex);
  };

  const filteredAndSortedReviews = useMemo(() => {
    const filtered = apiReviews.filter((r) => {
      const reviewUserFullName = r.user?.fullName?.toLowerCase() || "";
      const reviewComment = r.comment?.toLowerCase() || "";
      const searchTermLower = searchTerm.toLowerCase();

      const matchesSearch =
        reviewUserFullName.includes(searchTermLower) ||
        reviewComment.includes(searchTermLower);
      const matchesRating = ratingFilter === "all" || r.rating.toString() === ratingFilter;
      return matchesSearch && matchesRating;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [apiReviews, searchTerm, ratingFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedReviews.length / reviewsPerPage);
  const currentReviews = filteredAndSortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage,
  );

  const summaryReviewSource = apiReviews;
  const ratingCounts = useMemo(() => {
    return [5, 4, 3, 2, 1].map((stars: number) =>
      summaryReviewSource.filter((r: any) => r.rating === stars).length
    );
  }, [summaryReviewSource]);

  const totalFilteredItems = filteredAndSortedReviews.length;
  const firstItemOnPage = totalFilteredItems === 0 ? 0 : (currentPage - 1) * reviewsPerPage + 1;
  const lastItemOnPage = Math.min(currentPage * reviewsPerPage, totalFilteredItems);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Mobile Tabs */}
      <div className="md:hidden">
        <Tabs defaultValue="reviews" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="write">Write</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Reviews Summary */}
      <Card
        className={`bg-primary-opacity border-0 shadow-lg ${activeTab !== "summary" && activeTab !== "reviews" ? "hidden md:block" : ""}`}
      >
        <CardContent className="p-4 pt-8 sm:p-6 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="flex justify-center items-center text-center space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <div className="text-4xl sm:text-5xl font-bold text-gray-900">{vendorData?.averageRating?.toFixed(1) ?? 'N/A'}</div>
                <div className="flex justify-center">
                  {renderStars(vendorData?.averageRating ?? 0, false, "w-5 h-5 sm:w-6 sm:h-6")}
                </div>
                <p className="text-sm sm:text-base text-gray-600">Dựa vào {summaryReviewSource.length} đánh giá</p>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {[5, 4, 3, 2, 1].map((stars, index) => (
                <div key={stars} className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-xs sm:text-sm font-medium w-6 sm:w-8">{stars}</span>
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-2.5">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${summaryReviewSource.length > 0 ? (ratingCounts[index] / summaryReviewSource.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 w-6 sm:w-8">{ratingCounts[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review */}
      <Card className={`shadow-lg ${activeTab !== "write" && activeTab !== "reviews" ? "hidden md:block" : ""}`}>
        <CardHeader className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Viết đánh giá
          </h3>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 sm:mb-3">Đánh giá sao</label>
            <div className="flex space-x-1">
              {renderStars(currentRating, true, "w-6 h-6 sm:w-8 sm:h-8", handleStarClick)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 sm:mb-3">Nội dung đánh giá</label>
            <TipTapEditor
              value={newReview}
              onChange={setNewReview}
            />
          </div>
          <Button className="cursor-pointer w-full sm:w-auto text-white px-6 sm:px-8 py-2">
            Gửi đánh giá
          </Button>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className={`shadow-lg ${activeTab !== "reviews" ? "hidden md:block" : ""}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm đánh giá..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden xs:inline">Lọc</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Đánh giá</label>
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Tất cả đánh giá" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả đánh giá</SelectItem>
                      <SelectItem value="5">5 sao</SelectItem>
                      <SelectItem value="4">4 sao</SelectItem>
                      <SelectItem value="3">3 sao</SelectItem>
                      <SelectItem value="2">2 sao</SelectItem>
                      <SelectItem value="1">1 sao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Sắp xếp theo</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                      <SelectItem value="highest">Đánh giá cao nhất</SelectItem>
                      <SelectItem value="lowest">Đánh giá thấp nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end xs:col-span-2 sm:col-span-1">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setRatingFilter("all");
                      setSortBy("newest");
                      setCurrentPage(1);
                    }}
                    className="w-full text-sm"
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className={`space-y-4 sm:space-y-6 ${activeTab !== "reviews" ? "hidden md:block" : ""}`}>
        {currentReviews.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="p-6 sm:p-12 text-center">
              <div className="text-gray-400 mb-4">
                <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Không tìm thấy đánh giá nào</h3>
              <p className="text-sm sm:text-base text-gray-600">Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc của bạn.</p>
            </CardContent>
          </Card>
        ) : (
          currentReviews.map((r) => (
            <Card key={r.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-100 mb-3 sm:mb-0">
                    <AvatarImage src={r.user?.avatarUrl || "/placeholder.svg"} alt={r.user?.fullName || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-xs sm:text-sm">
                      {r.user?.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between">
                      <div className="space-y-1 mb-2 xs:mb-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-semibold text-gray-900">{r.user?.fullName || "Ẩn danh"}</h5>
                        </div>
                        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                          <div className="flex">{renderStars(r.rating)}</div>
                          <Separator orientation="vertical" className="h-3 sm:h-4 hidden xs:inline-block" />
                          <div className="flex items-center text-xs sm:text-sm text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDateAgo(r.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{r.comment}</p>
                    {r.images && r.images.length > 0 && (
                      <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {r.images.map((img) => (
                          <div key={img.id} className="aspect-square overflow-hidden rounded">
                            <img src={img.imageUrl} alt={`Review image ${img.id}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {
        totalPages > 1 && (
          <Card className={`shadow-lg ${activeTab !== "reviews" ? "hidden md:block" : ""}`}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4 xs:gap-2">
                <div className="text-xs sm:text-sm text-gray-600 text-center xs:text-left">
                  Đang hiển thị {firstItemOnPage} đến {lastItemOnPage} của {totalFilteredItems} đánh giá
                </div>
                <div className="flex items-center justify-center xs:justify-end space-x-1 sm:space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                  >
                    Trước
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      totalPages <= 5 ||
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 p-0 text-xs sm:text-sm ${currentPage === page ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                        >
                          {page}
                        </Button>
                      );
                    } else if (
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={page} className="text-gray-500 px-1">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    </div >
  );
};

export default VendorReviewsPage;