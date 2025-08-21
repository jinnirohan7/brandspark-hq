import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  Package,
  ShoppingBag,
  Palette,
  TrendingUp,
  FileText,
  CreditCard,
  Truck,
  AlertTriangle,
  Tag,
  FileCheck,
  Headphones,
  Star,
  MessageCircle,
  Home,
} from 'lucide-react'

const menuItems = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', url: '/dashboard', icon: Home },
      { title: 'Orders', url: '/dashboard/orders', icon: ShoppingBag },
      { title: 'Analytics', url: '/dashboard/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Store Management',
    items: [
      { title: 'Inventory', url: '/dashboard/inventory', icon: Package },
      { title: 'Listings', url: '/dashboard/listings', icon: Package },
      { title: 'Theme Builder', url: '/dashboard/themes', icon: Palette },
    ],
  },
  {
    title: 'Marketing & Sales',
    items: [
      { title: 'Marketing', url: '/dashboard/marketing', icon: TrendingUp },
      { title: 'Coupons', url: '/dashboard/coupons', icon: Tag },
      { title: 'WhatsApp', url: '/dashboard/whatsapp', icon: MessageCircle },
    ],
  },
  {
    title: 'Operations',
    items: [
      { title: 'Shipping Performance', url: '/dashboard/shipping-performance', icon: Truck },
      { title: 'Delivery & RTO', url: '/dashboard/delivery', icon: Truck },
      { title: 'Returns', url: '/dashboard/returns', icon: AlertTriangle },
      { title: 'Claims', url: '/dashboard/claims', icon: AlertTriangle },
    ],
  },
  {
    title: 'Finance & Reports',
    items: [
      { title: 'Payments', url: '/dashboard/payments', icon: CreditCard },
      { title: 'Reports', url: '/dashboard/reports', icon: FileText },
      { title: 'Business Reports', url: '/dashboard/business-reports', icon: BarChart3 },
    ],
  },
  {
    title: 'Support & Reviews',
    items: [
      { title: 'Support', url: '/dashboard/support', icon: Headphones },
      { title: 'Reviews', url: '/dashboard/reviews', icon: Star },
      { title: 'Documents', url: '/dashboard/docs', icon: FileCheck },
    ],
  },
]

export const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-sidebar-foreground">SellSphere</h2>
        </div>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                            isActive
                              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}