import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { ProfileImageUpload } from '@/components/ProfileImageUpload'
import { MapPin, Building2, CreditCard, Truck, HelpCircle, Settings, User, Globe, Package, ChevronDown } from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState<string>('')
  
  // Form state for editable fields
  const [formData, setFormData] = useState({
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
  })

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleImageChange = (url: string) => {
    setProfileImageUrl(url)
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
                  {/* Profile Image Section */}
                  <div className="flex flex-col items-center space-y-4 pb-6 border-b">
                    <ProfileImageUpload 
                      currentImageUrl={profileImageUrl}
                      onImageChange={handleImageChange}
                    />
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">{formData.profile.displayName}</h3>
                      <p className="text-sm text-muted-foreground">{formData.profile.businessName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={formData.profile.displayName}
                          onChange={(e) => handleInputChange('profile', 'displayName', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={formData.profile.businessName}
                          onChange={(e) => handleInputChange('profile', 'businessName', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Listings Status</Label>
                        <div className="mt-1">
                          <Badge variant="secondary" className="text-green-600 bg-green-50">
                            {formData.profile.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Current Status of Listings</Label>
                        <Input
                          value={formData.profile.listingsCount}
                          onChange={(e) => handleInputChange('profile', 'listingsCount', e.target.value)}
                          className="mt-1"
                          placeholder="Number of listings"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          listings available for sale on Amazon
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Your Services</Label>
                        <div className="space-y-2 mt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Sell On Amazon</span>
                            <Badge variant="outline">Professional</Badge>
                          </div>
                          {formData.profile.servicesRegistered.map((service, index) => (
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
                          {formData.payment.depositMethods.map((method, index) => (
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
                          {formData.payment.chargeMethods.map((method, index) => (
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
                    <Input
                      value={formData.payment.advertisingCharges}
                      onChange={(e) => handleInputChange('payment', 'advertisingCharges', e.target.value)}
                      className="mt-1"
                    />
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
                          value={formData.business.address}
                          onChange={(e) => handleInputChange('business', 'address', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="legalEntity">Legal Entity</Label>
                        <Input
                          id="legalEntity"
                          value={formData.business.legalEntity}
                          onChange={(e) => handleInputChange('business', 'legalEntity', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="registeredAddress">Official Registered Address</Label>
                        <Textarea
                          id="registeredAddress"
                          value={formData.business.registeredAddress}
                          onChange={(e) => handleInputChange('business', 'registeredAddress', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="merchantToken">Merchant Token</Label>
                        <Input
                          id="merchantToken"
                          value={formData.business.merchantToken}
                          onChange={(e) => handleInputChange('business', 'merchantToken', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessDisplayName">Display Name</Label>
                        <Input
                          id="businessDisplayName"
                          value={formData.business.displayName}
                          onChange={(e) => handleInputChange('business', 'displayName', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="feedLanguage">Language for feed processing report</Label>
                        <Input
                          id="feedLanguage"
                          value={formData.business.feedLanguage}
                          onChange={(e) => handleInputChange('business', 'feedLanguage', e.target.value)}
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
                          value={formData.shipping.returnAddress}
                          onChange={(e) => handleInputChange('shipping', 'returnAddress', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="internationalReturns">International Returns Providers</Label>
                        <Input
                          id="internationalReturns"
                          value={formData.shipping.internationalReturns}
                          onChange={(e) => handleInputChange('shipping', 'internationalReturns', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="shippingSettings">Shipping Settings</Label>
                        <Input
                          id="shippingSettings"
                          value={formData.shipping.shippingSettings}
                          onChange={(e) => handleInputChange('shipping', 'shippingSettings', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="buyShippingPreferences">Buy Shipping Preferences</Label>
                        <Input
                          id="buyShippingPreferences"
                          value={formData.shipping.buyShippingPreferences}
                          onChange={(e) => handleInputChange('shipping', 'buyShippingPreferences', e.target.value)}
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
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about seller account management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    How do I update my tax information and legal name?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can update your tax information by going to Settings &gt; Tax Information. For legal name changes, you&apos;ll need to contact Seller Support with proper documentation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    How do I close my seller account?
                  </AccordionTrigger>
                  <AccordionContent>
                    To close your account, go to Settings &gt; Account Info and select &quot;Close Account&quot;. Note that you must resolve all pending orders and issues before closing.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    How can I temporarily deactivate my listings?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can set your account to vacation mode in Settings &gt; Account Info &gt; Vacation Settings. This will temporarily pause your listings.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    Why are my items no longer for sale?
                  </AccordionTrigger>
                  <AccordionContent>
                    Items may be deactivated due to policy violations, inventory issues, or account health problems. Check your Account Health dashboard for specific issues.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">
                    Why did my credit card have an error?
                  </AccordionTrigger>
                  <AccordionContent>
                    Credit card errors can occur due to expired cards, insufficient funds, or bank restrictions. Update your payment method in the Payment Information section.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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