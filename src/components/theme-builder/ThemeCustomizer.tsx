import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Layout as HeaderIcon, 
  FileText,
  Home, 
  Info, 
  Phone, 
  ShoppingCart,
  CreditCard,
  AlertCircle,
  HelpCircle,
  User,
  Lock,
  Mail,
  List,
  Package,
  Briefcase,
  Shield,
  Heart,
  ArrowLeft,
  Save
} from 'lucide-react'

interface Theme {
  id: string
  name: string
  description: string
}

interface ThemeCustomizerProps {
  theme: Theme
  onBack: () => void
  onSave: (settings: any) => void
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  theme,
  onBack,
  onSave
}) => {
  const [selectedSection, setSelectedSection] = useState('header')
  const [headerSettings, setHeaderSettings] = useState({
    menuBar: true,
    logo: true,
    searchBar: true,
    loginButton: true,
    wishlistButton: true,
    cartButton: true
  })

  const navigationSections = [
    { id: 'header', label: 'Header', icon: HeaderIcon },
    { id: 'footer', label: 'Footer', icon: FileText },
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact Us', icon: Phone },
    { id: 'blog', label: 'Blog Page', icon: FileText },
    { id: 'article', label: 'Article Page', icon: FileText },
    { id: 'cart', label: 'Cart Page', icon: ShoppingCart },
    { id: 'checkout', label: 'Checkout Page', icon: CreditCard },
    { id: 'error', label: 'Error Page', icon: AlertCircle },
    { id: 'faqs', label: 'Faqs Page', icon: HelpCircle },
    { id: 'login', label: 'Login Page', icon: User },
    { id: 'register', label: 'Register Page', icon: User },
    { id: 'forgot', label: 'Forgot Password Page', icon: Lock },
    { id: 'reset', label: 'Reset Password Page', icon: Lock },
    { id: 'account', label: 'My Account Page', icon: User },
    { id: 'support', label: 'Support Ticket Page', icon: HelpCircle },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'product-list', label: 'Product List', icon: List },
    { id: 'product', label: 'Product Page', icon: Package },
    { id: 'terms', label: 'Terms & Condition', icon: FileText },
    { id: 'order-complete', label: 'Order Complete Page', icon: CreditCard },
    { id: 'order-detail', label: 'Order Detail Page', icon: FileText },
    { id: 'custom', label: 'Custom Page', icon: Briefcase },
    { id: 'wishlist', label: 'Wish List', icon: Heart }
  ]

  const pageSettings = [
    { id: 'header', title: 'Header', description: 'Header settings such as, site top bar, site menu and so on.' },
    { id: 'footer', title: 'Footer', description: 'Footer settings such as, site bottom bar, site menu and so on.' },
    { id: 'home', title: 'Home Page', description: 'Homepage settings such as, products, categories, site menu and so on.' },
    { id: 'about', title: 'About Us', description: 'About us settings.' },
    { id: 'contact', title: 'Contact Us', description: 'Contact us settings.' },
    { id: 'blog', title: 'Blog Page', description: 'Blog page settings.' },
    { id: 'article', title: 'Article Page', description: 'Article page settings.' },
    { id: 'cart', title: 'Cart Page', description: 'Cart Page settings.' },
    { id: 'checkout', title: 'Checkout Page', description: 'Checkout Page settings.' },
    { id: 'error', title: 'Error Page', description: 'Error page settings.' },
    { id: 'faqs', title: 'Faqs Page', description: 'Faqs settings.' },
    { id: 'login', title: 'Login Page', description: 'Login Page settings.' },
    { id: 'register', title: 'Register Page', description: 'Register page settings.' },
    { id: 'forgot', title: 'Forgot Password Page', description: 'Forgot password settings.' },
    { id: 'reset', title: 'Reset Password Page', description: 'Reset password settings.' },
    { id: 'account', title: 'My Account Page', description: 'My account settings.' },
    { id: 'support', title: 'Support Ticket Page', description: 'Support ticket settings.' },
    { id: 'privacy', title: 'Privacy Policy', description: 'Privacy Policy settings.' },
    { id: 'product-list', title: 'Product List', description: 'Product List settings.' },
    { id: 'product', title: 'Product Page', description: 'Product page settings.' },
    { id: 'terms', title: 'Terms & Condition', description: 'Terms & Condition settings.' },
    { id: 'order-complete', title: 'Order Complete Page', description: 'Order Complete page settings.' },
    { id: 'order-detail', title: 'Order Detail Page', description: 'Order details page settings.' },
    { id: 'custom', title: 'Custom Page', description: 'Custom page settings.' },
    { id: 'wishlist', title: 'Wish List', description: 'Whishlist settings.' }
  ]

  const renderSidebarView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Theme Customize</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span className="text-primary">Home</span>
            <span>/</span>
            <span className="text-primary">Themes</span>
            <span>/</span>
            <span>Pages</span>
            <span>/</span>
            <span>Customize</span>
          </div>
        </div>
        <Button onClick={() => onSave(headerSettings)} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>

      {/* Theme Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{theme.name}</CardTitle>
          <CardDescription>
            Organize and adjust all settings about {theme.name.toLowerCase()}.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar Navigation */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Jump To Page</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {navigationSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(section.id)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                        selectedSection === section.id ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600' : ''
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {section.label}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="col-span-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {selectedSection === 'header' ? 'Jump To Settings' : `${navigationSections.find(s => s.id === selectedSection)?.label} Settings`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSection === 'header' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <button
                      className="w-full text-left p-3 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                    >
                      Menu Bar
                    </button>
                    <button className="w-full text-left p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
                      Logo
                    </button>
                    <button className="w-full text-left p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
                      Search Bar
                    </button>
                    <button className="w-full text-left p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
                      Login Button
                    </button>
                    <button className="w-full text-left p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
                      Wishlist Button
                    </button>
                    <button className="w-full text-left p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
                      Cart Button
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Settings Content */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Header Settings</CardTitle>
              <CardDescription>
                Header settings such as, site top bar, site menu and so on.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Menu Bar</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="menu-on" 
                      name="menu-bar" 
                      value="on" 
                      defaultChecked 
                      className="text-emerald-600"
                    />
                    <Label htmlFor="menu-on">On</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="menu-off" 
                      name="menu-bar" 
                      value="off"
                      className="text-emerald-600"
                    />
                    <Label htmlFor="menu-off">Off</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="font-medium">Menu</Label>
                <select className="w-full mt-2 p-2 border rounded-md">
                  <option>Header</option>
                  <option>Footer</option>
                  <option>Sidebar</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={onBack}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => onSave(headerSettings)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderGridView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Theme Customize</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span className="text-primary">Home</span>
            <span>/</span>
            <span className="text-primary">Themes</span>
            <span>/</span>
            <span>Pages</span>
          </div>
        </div>
      </div>

      {/* Theme Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{theme.name}</CardTitle>
          <CardDescription>
            Organize and adjust all settings about {theme.name.toLowerCase()}.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Page Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageSettings.map((page) => {
          const navSection = navigationSections.find(s => s.id === page.id)
          const Icon = navSection?.icon || Settings
          
          return (
            <Card key={page.id} className="group hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{page.title}</CardTitle>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm mt-2">
                  {page.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white"
                  onClick={() => setSelectedSection(page.id)}
                >
                  Change Setting
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  return selectedSection === 'overview' ? renderGridView() : renderSidebarView()
}

export default ThemeCustomizer