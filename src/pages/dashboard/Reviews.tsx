import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  Reply,
  Flag,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Calendar,
  Award
} from 'lucide-react'

const Reviews = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')

  const reviewStats = {
    totalReviews: 1247,
    averageRating: 4.3,
    ratingDistribution: [
      { stars: 5, count: 623, percentage: 50 },
      { stars: 4, count: 374, percentage: 30 },
      { stars: 3, count: 125, percentage: 10 },
      { stars: 2, count: 75, percentage: 6 },
      { stars: 1, count: 50, percentage: 4 }
    ],
    monthlyTrend: {
      current: 4.3,
      previous: 4.1,
      change: 0.2
    }
  }

  const reviews = [
    {
      id: 'REV-001',
      customerName: 'Priya Sharma',
      customerInitials: 'PS',
      rating: 5,
      product: 'Wireless Bluetooth Headphones',
      productId: 'PRD-123',
      title: 'Excellent sound quality!',
      comment: 'Amazing headphones with crystal clear sound. The battery life is impressive and they are very comfortable to wear for long periods.',
      date: '2024-01-15',
      verified: true,
      helpful: 12,
      status: 'published',
      response: null
    },
    {
      id: 'REV-002',
      customerName: 'Rajesh Kumar',
      customerInitials: 'RK',
      rating: 4,
      product: 'Smart Watch Pro',
      productId: 'PRD-456',
      title: 'Good value for money',
      comment: 'The watch has all the features I needed. The heart rate monitor is accurate and the display is bright. Only issue is the charging cable is a bit short.',
      date: '2024-01-14',
      verified: true,
      helpful: 8,
      status: 'published',
      response: {
        message: 'Thank you for your feedback! We appreciate your review and will consider your suggestion about the charging cable.',
        date: '2024-01-15'
      }
    },
    {
      id: 'REV-003',
      customerName: 'Anonymous',
      customerInitials: 'AN',
      rating: 2,
      product: 'Wireless Charger',
      productId: 'PRD-789',
      title: 'Slow charging speed',
      comment: 'The charger works but is very slow. Takes almost 4 hours to fully charge my phone. Not recommended.',
      date: '2024-01-13',
      verified: false,
      helpful: 3,
      status: 'flagged',
      response: null
    },
    {
      id: 'REV-004',
      customerName: 'Anita Singh',
      customerInitials: 'AS',
      rating: 5,
      product: 'Gaming Mouse',
      productId: 'PRD-321',
      title: 'Perfect for gaming',
      comment: 'This mouse is incredibly responsive and the RGB lighting looks amazing. The build quality is excellent and it feels great in hand.',
      date: '2024-01-12',
      verified: true,
      helpful: 15,
      status: 'published',
      response: null
    }
  ]

  const products = [
    { id: 'PRD-123', name: 'Wireless Bluetooth Headphones' },
    { id: 'PRD-456', name: 'Smart Watch Pro' },
    { id: 'PRD-789', name: 'Wireless Charger' },
    { id: 'PRD-321', name: 'Gaming Mouse' }
  ]

  const renderStars = (rating: number, size = 'sm') => {
    const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'flagged':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProduct = selectedProduct === 'all' || review.productId === selectedProduct
    const matchesRating = selectedRating === 'all' || review.rating.toString() === selectedRating
    
    return matchesSearch && matchesProduct && matchesRating
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reviews Management</h1>
          <p className="text-muted-foreground mt-2">Monitor and respond to customer reviews</p>
        </div>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{reviewStats.totalReviews.toLocaleString()}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{reviewStats.averageRating}</p>
                  {renderStars(Math.round(reviewStats.averageRating))}
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{reviewStats.monthlyTrend.current}</p>
                  {reviewStats.monthlyTrend.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${reviewStats.monthlyTrend.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {reviewStats.monthlyTrend.change > 0 ? '+' : ''}{reviewStats.monthlyTrend.change}
                  </span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">5-Star Reviews</p>
                <p className="text-2xl font-bold">{reviewStats.ratingDistribution[0].percentage}%</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reviews" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reviews">All Reviews</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="responses">Response Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="border-border">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{review.customerInitials}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{review.customerName}</h4>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            <span className="text-sm font-medium">{review.title}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Product: {review.product}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(review.status)}>
                          {review.status}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="ml-14">
                      <p className="text-sm">{review.comment}</p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <Button size="sm" variant="ghost" className="p-0 h-auto">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful ({review.helpful})
                        </Button>
                        <Button size="sm" variant="ghost" className="p-0 h-auto">
                          <Flag className="h-4 w-4 mr-1" />
                          Flag
                        </Button>
                        <Button size="sm" variant="ghost" className="p-0 h-auto">
                          <Reply className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                      </div>

                      {review.response && (
                        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Seller Response</Badge>
                            <span className="text-xs text-muted-foreground">{review.response.date}</span>
                          </div>
                          <p className="text-sm">{review.response.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>Breakdown of customer ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviewStats.ratingDistribution.map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-20">
                      <span className="text-sm font-medium">{rating.stars}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <Progress value={rating.percentage} className="flex-1" />
                    <div className="text-sm text-muted-foreground w-16 text-right">
                      {rating.count} ({rating.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Trends</CardTitle>
                <CardDescription>Monthly review statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Chart implementation needed</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Reviewed Products</CardTitle>
                <CardDescription>Products with most reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.slice(0, 3).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Product ID: {product.id}</p>
                      </div>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Response Templates</CardTitle>
              <CardDescription>Pre-written responses for common review scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Positive Review Response</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Thank you so much for taking the time to leave such a wonderful review! We're thrilled to hear that you're happy with your purchase. Your feedback means a lot to us and helps other customers make informed decisions.
                  </p>
                  <Button size="sm" variant="outline">Use Template</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Negative Review Response</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    We sincerely apologize for the inconvenience you've experienced. Your feedback is valuable to us, and we'd like to make this right. Please contact our customer service team so we can resolve this issue promptly.
                  </p>
                  <Button size="sm" variant="outline">Use Template</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Product Issue Response</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Thank you for bringing this to our attention. We take product quality seriously and would like to investigate this further. We'll be reaching out to you directly to arrange a replacement or refund.
                  </p>
                  <Button size="sm" variant="outline">Use Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Reviews