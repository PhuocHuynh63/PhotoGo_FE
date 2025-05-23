"use client"
import { useState, useMemo } from "react"
import { Star, ThumbsUp, MessageCircle, Search, Filter, ChevronDown, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"
import { Input } from "@components/Atoms/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/Atoms/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@components/Atoms/ui/avatar"
import { Badge } from "@components/Atoms/ui/badge"
import { Separator } from "@components/Atoms/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import TipTapEditor from "@components/Organisms/TipTapEditor"

const VendorReviewsPage = () => {
  const [reviews] = useState([
    {
      id: 1,
      user: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2024-01-20",
      dateText: "2 days ago",
      comment:
        "Amazing photographer! The quality of photos exceeded my expectations. Very professional and punctual. The attention to detail was incredible and the final results were stunning.",
      likes: 12,
      helpful: true,
      verified: true,
    },
    {
      id: 2,
      user: "Sarah Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      date: "2024-01-15",
      dateText: "1 week ago",
      comment:
        "Great experience overall. Beautiful shots and good communication throughout the process. Would definitely recommend to others.",
      likes: 8,
      helpful: false,
      verified: true,
    },
    {
      id: 3,
      user: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2024-01-10",
      dateText: "2 weeks ago",
      comment:
        "Highly recommend! Creative vision and attention to detail was outstanding. The photographer made us feel comfortable throughout the entire session.",
      likes: 15,
      helpful: true,
      verified: false,
    },
    {
      id: 4,
      user: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 3,
      date: "2024-01-08",
      dateText: "2 weeks ago",
      comment: "Good service but could be improved. Photos were decent but not exceptional.",
      likes: 3,
      helpful: false,
      verified: true,
    },
    {
      id: 5,
      user: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2024-01-05",
      dateText: "3 weeks ago",
      comment:
        "Exceptional work! The photographer captured exactly what we envisioned. Professional, creative, and delivered on time.",
      likes: 20,
      helpful: true,
      verified: true,
    },
    {
      id: 6,
      user: "Lisa Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      date: "2024-01-03",
      dateText: "3 weeks ago",
      comment: "Very satisfied with the results. Great communication and beautiful photos.",
      likes: 7,
      helpful: false,
      verified: false,
    },
  ])

  const [newReview, setNewReview] = useState("")
  const [rating, setRating] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("reviews")
  const reviewsPerPage = 3

  const renderStars = (rating: number, interactive = false, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${size} ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} ${interactive ? "cursor-pointer hover:text-yellow-400 transition-colors" : ""
          }`}
        onClick={interactive ? () => setRating(index + 1) : undefined}
      />
    ))
  }

  const filteredAndSortedReviews = useMemo(() => {
    const filtered = reviews.filter((review) => {
      const matchesSearch =
        review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter
      return matchesSearch && matchesRating
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "highest":
          return b.rating - a.rating
        case "lowest":
          return a.rating - b.rating
        case "helpful":
          return b.likes - a.likes
        default:
          return 0
      }
    })

    return filtered
  }, [reviews, searchTerm, ratingFilter, sortBy])

  const totalPages = Math.ceil(filteredAndSortedReviews.length / reviewsPerPage)
  const currentReviews = filteredAndSortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage,
  )

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => reviews.filter((review) => review.rating === rating).length)

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
        className={`bg-primary-opacity border-0 shadow-lg ${activeTab !== "summary" && activeTab !== "reviews" ? "hidden md:block" : ""
          }`}
      >
        <CardContent className="p-4 pt-8 sm:p-6 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="flex justify-center items-center text-center space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <div className="text-4xl sm:text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                <div className="flex justify-center">
                  {renderStars(Math.round(averageRating), false, "w-5 h-5 sm:w-6 sm:h-6")}
                </div>
                <p className="text-sm sm:text-base text-gray-600">Based on {reviews.length} reviews</p>
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
                        width: `${reviews.length > 0 ? (ratingCounts[index] / reviews.length) * 100 : 0}%`,
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
            <div className="flex space-x-1">{renderStars(rating, true, "w-6 h-6 sm:w-8 sm:h-8")}</div>
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
                  placeholder="Search reviews..."
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
                <span className="hidden xs:inline">Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Rating</label>
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="All ratings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All ratings</SelectItem>
                      <SelectItem value="5">5 stars</SelectItem>
                      <SelectItem value="4">4 stars</SelectItem>
                      <SelectItem value="3">3 stars</SelectItem>
                      <SelectItem value="2">2 stars</SelectItem>
                      <SelectItem value="1">1 star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Sort by</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="oldest">Oldest first</SelectItem>
                      <SelectItem value="highest">Highest rating</SelectItem>
                      <SelectItem value="lowest">Lowest rating</SelectItem>
                      <SelectItem value="helpful">Most helpful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end xs:col-span-2 sm:col-span-1">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setRatingFilter("all")
                      setSortBy("newest")
                      setCurrentPage(1)
                    }}
                    className="w-full text-sm"
                  >
                    Clear filters
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
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        ) : (
          currentReviews.map((review) => (
            <Card key={review.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-100 mb-3 sm:mb-0">
                    <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.user} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-xs sm:text-sm">
                      {review.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between">
                      <div className="space-y-1 mb-2 xs:mb-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-semibold text-gray-900">{review.user}</h5>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <Separator orientation="vertical" className="h-3 sm:h-4 hidden xs:inline-block" />
                          <div className="flex items-center text-xs sm:text-sm text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {review.dateText}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className={`shadow-lg ${activeTab !== "reviews" ? "hidden md:block" : ""}`}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4 xs:gap-2">
              <div className="text-xs sm:text-sm text-gray-600 text-center xs:text-left">
                Showing {(currentPage - 1) * reviewsPerPage + 1} to{" "}
                {Math.min(currentPage * reviewsPerPage, filteredAndSortedReviews.length)} of{" "}
                {filteredAndSortedReviews.length} reviews
              </div>
              <div className="flex items-center justify-center xs:justify-end space-x-1 sm:space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // On mobile, show limited page numbers
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
                        className={`h-8 w-8 p-0 text-xs sm:text-sm ${currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""
                          }`}
                      >
                        {page}
                      </Button>
                    )
                  } else if (
                    (page === currentPage - 2 && currentPage > 3) ||
                    (page === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span key={page} className="text-gray-500 px-1">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default VendorReviewsPage
