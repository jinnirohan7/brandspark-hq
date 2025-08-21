import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { MapPin, Building2, CreditCard, Truck, HelpCircle, Settings, User, Globe, Package } from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Mock seller data based on the reference image
  const sellerData = {
    profile: {
      displayName: 'Professional Seller',
      businessName: user?.user_metadata?.company_name || 'Amazon Business',
      status: 'Active',
      listingsCount: '1,247',
      servicesRegistered: ['Amazon.com', 'Amazon.ca', 'Amazon.com.mx']
    },
    payment: {
      depositMethods: ['Bank Transfer', 'Check'],
      chargeMethods: ['Credit Card on File', 'Bank Account'],
      advertisingCharges: 'Credit Card (Automatic)'
    },
    business: {
      address: '123 Business Street, City, State 12345',
      legalEntity: 'Corporation',
      registeredAddress: '123 Business Street, City, State 12345',
      merchantToken: 'M-XXXXXXXX-XXXXXXX',
      displayName: 'Professional Seller Store',
      feedLanguage: 'English (US)'
    },
    shipping: {
      returnAddress: '123 Return Street, City, State 12345',
      shippingSettings: 'Buy Shipping Services',
      internationalReturns: 'Enabled',
      buyShippingPreferences: 'Amazon Shipping Preferences'
    }
  }

  const handleSave = async () => {
    setLoading(true)
    // Simulate save operation
    setTimeout(() => {
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Seller Account Information</h1>
          <p className="text-muted-foreground mt-1">Manage your seller profile and account settings</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment
              </TabsTrigger>
              <TabsTrigger value="business" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Business
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Shipping
              </TabsTrigger>
            </TabsList>

            {/* Your Seller Profile */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Your Seller Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Listings Status</Label>
                        <div className="mt-1">
                          <Badge variant="secondary" className="text-green-600 bg-green-50">
                            {sellerData.profile.status}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Current Status of Listings</Label>
                        <p className="text-sm text-muted-foreground">
                          {sellerData.profile.listingsCount} listings available for sale on Amazon
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Your Services</Label>
                        <div className="space-y-2 mt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Sell On Amazon</span>
                            <Badge variant="outline">Professional</Badge>
                          </div>
                          {sellerData.profile.servicesRegistered.map((service, index) => (
                            <div key={index} className="text-xs text-muted-foreground">
                              {service}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Information */}
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Deposit Methods</Label>
                        <div className="space-y-2 mt-1">
                          {sellerData.payment.depositMethods.map((method, index) => (
                            <div key={index} className="text-sm text-muted-foreground">
                              {method}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Charge Methods</Label>
                        <div className="space-y-2 mt-1">
                          {sellerData.payment.chargeMethods.map((method, index) => (
                            <div key={index} className="text-sm text-muted-foreground">
                              {method}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Charge Methods for Advertising</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {sellerData.payment.advertisingCharges}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Business Information */}
            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="businessAddress">Business Address</Label>
                        <Textarea
                          id="businessAddress"
                          value={sellerData.business.address}
                          readOnly
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="legalEntity">Legal Entity</Label>
                        <Input
                          id="legalEntity"
                          value={sellerData.business.legalEntity}
                          readOnly
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="registeredAddress">Official Registered Address</Label>
                        <Textarea
                          id="registeredAddress"
                          value={sellerData.business.registeredAddress}
                          readOnly
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="merchantToken">Merchant Token</Label>
                        <Input
                          id="merchantToken"
                          value={sellerData.business.merchantToken}
                          readOnly
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={sellerData.business.displayName}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="feedLanguage">Language for feed processing report</Label>
                        <Input
                          id="feedLanguage"
                          value={sellerData.business.feedLanguage}
                          readOnly
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shipping and Returns Information */}
            <TabsContent value="shipping">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping and Returns Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="returnAddress">Return Address</Label>
                        <Textarea
                          id="returnAddress"
                          value={sellerData.shipping.returnAddress}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="internationalReturns">International Returns Providers</Label>
                        <Input
                          id="internationalReturns"
                          value={sellerData.shipping.internationalReturns}
                          readOnly
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="shippingSettings">Shipping Settings</Label>
                        <Input
                          id="shippingSettings"
                          value={sellerData.shipping.shippingSettings}
                          readOnly
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="buyShippingPreferences">Buy Shipping Preferences</Label>
                        <Input
                          id="buyShippingPreferences"
                          value={sellerData.shipping.buyShippingPreferences}
                          readOnly
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                FAQ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="link" className="p-0 h-auto text-left text-blue-600 hover:text-blue-800 text-sm">
                How do I update my tax information and legal name?
              </Button>
              <Button variant="link" className="p-0 h-auto text-left text-blue-600 hover:text-blue-800 text-sm">
                I signed up for an account by mistake or don't need it anymore. How do I close the account?
              </Button>
              <Button variant="link" className="p-0 h-auto text-left text-blue-600 hover:text-blue-800 text-sm">
                I am taking time off (vacation). How can I temporarily deactivate my listings?
              </Button>
              <Button variant="link" className="p-0 h-auto text-left text-blue-600 hover:text-blue-800 text-sm">
                Why are my items no longer for sale?
              </Button>
              <Button variant="link" className="p-0 h-auto text-left text-blue-600 hover:text-blue-800 text-sm">
                Why did my credit card have an error or become invalid?
              </Button>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full justify-start" disabled>
                <Globe className="mr-2 h-4 w-4" />
                Notification Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile