import { useEffect, useState } from 'react'
import { useAdminData } from '@/hooks/useAdminData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone,
  Globe,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { format } from 'date-fns'

export const AdminSellers = () => {
  const { fetchSellers, sellers, loading, updateSellerStatus } = useAdminData()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredSellers, setFilteredSellers] = useState(sellers)

  useEffect(() => {
    fetchSellers()
  }, [])

  useEffect(() => {
    const filtered = sellers.filter(seller =>
      seller.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredSellers(filtered)
  }, [sellers, searchTerm])

  const handleStatusUpdate = async (sellerId: string, newStatus: string) => {
    await updateSellerStatus(sellerId, newStatus)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>
      case 'pending_verification':
        return <Badge variant="secondary">Pending</Badge>
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getVerificationBadge = (verified: boolean) => {
    return verified ? (
      <Badge variant="default" className="bg-green-500">
        <UserCheck className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    ) : (
      <Badge variant="outline">
        <UserX className="h-3 w-3 mr-1" />
        Unverified
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seller Management</h1>
          <p className="text-muted-foreground">
            Manage all sellers on the SellSphere platform
          </p>
        </div>
        <Button>
          Create New Seller
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sellers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sellers.filter(s => s.account_status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sellers.filter(s => s.kyc_verified).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sellers.filter(s => !s.kyc_verified).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>All Sellers</CardTitle>
          <CardDescription>
            View and manage all sellers registered on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sellers by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Metrics</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{seller.full_name}</div>
                      <div className="text-sm text-muted-foreground">{seller.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {seller.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {seller.phone}
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {seller.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{seller.company_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {seller.business_type || 'Not specified'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(seller.account_status)}
                  </TableCell>
                  <TableCell>
                    {getVerificationBadge(seller.kyc_verified)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>Orders: {seller.total_orders}</div>
                      <div>Revenue: ₹{seller.total_revenue.toLocaleString()}</div>
                      <div>Websites: {seller.website_count}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(seller.created_at), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>View Orders</DropdownMenuItem>
                        <DropdownMenuItem>View Websites</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {seller.account_status !== 'active' && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(seller.id, 'active')}
                          >
                            Activate Seller
                          </DropdownMenuItem>
                        )}
                        {seller.account_status === 'active' && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(seller.id, 'suspended')}
                          >
                            Suspend Seller
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>Contact Seller</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}