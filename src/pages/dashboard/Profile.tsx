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
import { MapPin, Building2, CreditCard, Truck, HelpCircle, Settings, User, Globe, Package, ChevronDown, FileText, Upload, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSellerProfile } from '@/hooks/useSellerProfile'

const Profile = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const { documents } = useSellerProfile()
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
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Seller Account Information</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage your seller profile and account settings</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="self-start sm:self-center">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6 min-w-0">
          <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Payment</span>
              </TabsTrigger>
              <TabsTrigger value="business" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Business</span>
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Shipping</span>
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
              <div className="space-y-6">
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

                {/* KYC Documents Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      KYC Documents & Verification
                    </CardTitle>
                    <CardDescription>
                      Upload required documents for account verification and compliance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* GST Certificate */}
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-sm font-medium">GST Certificate</Label>
                            <Badge variant="outline" className="text-orange-600">Pending</Badge>
                          </div>
                          <div className="space-y-2">
                            <Input
                              placeholder="GST Number (e.g., 22AAAAA0000A1Z5)"
                              className="text-sm"
                            />
                            <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                              <p className="text-sm text-muted-foreground">Click to upload GST certificate</p>
                              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PAN Card */}
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-sm font-medium">PAN Card</Label>
                            <Badge variant="outline" className="text-orange-600">Pending</Badge>
                          </div>
                          <div className="space-y-2">
                            <Input
                              placeholder="PAN Number (e.g., ABCDE1234F)"
                              className="text-sm"
                            />
                            <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                              <p className="text-sm text-muted-foreground">Click to upload PAN card</p>
                              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bank Account Details */}
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-sm font-medium">Bank Account Details</Label>
                            <Badge variant="outline" className="text-orange-600">Pending</Badge>
                          </div>
                          <div className="space-y-2">
                            <Input
                              placeholder="Account Number"
                              className="text-sm"
                            />
                            <Input
                              placeholder="IFSC Code"
                              className="text-sm"
                            />
                            <Input
                              placeholder="Bank Name"
                              className="text-sm"
                            />
                            <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                              <p className="text-sm text-muted-foreground">Upload bank statement/passbook</p>
                              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Aadhar Card */}
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-sm font-medium">Aadhar Card</Label>
                            <Badge variant="outline" className="text-orange-600">Pending</Badge>
                          </div>
                          <div className="space-y-2">
                            <Input
                              placeholder="Aadhar Number (12 digits)"
                              className="text-sm"
                            />
                            <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                              <p className="text-sm text-muted-foreground">Upload Aadhar card (front & back)</p>
                              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Documents */}
                    <div className="border-t pt-6">
                      <Label className="text-sm font-medium mb-4 block">Additional Business Documents (Optional)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <Label className="text-sm font-medium block mb-2">Trade License</Label>
                          <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground">Upload trade license</p>
                            <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</p>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <Label className="text-sm font-medium block mb-2">FSSAI License (Food items)</Label>
                          <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground">Upload FSSAI license</p>
                            <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                      <Button className="flex-1">Submit for Verification</Button>
                      <Button variant="outline" className="flex-1">Save as Draft</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
        <div className="space-y-4 sm:space-y-6 min-w-0">
          {/* Document Status Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Status
              </CardTitle>
              <CardDescription>
                View all your uploaded documents and their verification status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents && documents.length > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-lg font-semibold text-green-600">
                          {documents.filter(doc => doc.verification_status === 'verified').length}
                        </div>
                        <div className="text-xs text-green-600">Verified</div>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="text-lg font-semibold text-yellow-600">
                          {documents.filter(doc => doc.verification_status === 'pending').length}
                        </div>
                        <div className="text-xs text-yellow-600">Pending</div>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="text-lg font-semibold text-red-600">
                          {documents.filter(doc => doc.verification_status === 'rejected').length}
                        </div>
                        <div className="text-xs text-red-600">Rejected</div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/dashboard/documents">
                        <Eye className="h-4 w-4 mr-2" />
                        View All Documents
                      </Link>
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-4">No documents uploaded yet</p>
                    <Button asChild>
                      <Link to="/dashboard/documents">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Documents
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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