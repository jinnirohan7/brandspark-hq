import { NavLink } from 'react-router-dom'
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
import {
  Shield,
  Users,
  ShoppingCart,
  DollarSign,
  Truck,
  Settings,
  Activity,
  Plus,
  BarChart3,
  UserCheck,
  Globe,
  Lock,
  Palette,
} from 'lucide-react'

const adminMenuItems = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', url: '/admin/dashboard', icon: Activity },
      { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Seller Management',
    items: [
      { title: 'All Sellers', url: '/admin/sellers', icon: Users },
      { title: 'Create Seller', url: '/admin/sellers/create', icon: Plus },
      { title: 'Verification', url: '/admin/verification', icon: UserCheck },
      { title: 'Monitoring', url: '/admin/monitoring', icon: Activity },
    ],
  },
  {
    title: 'Operations',
    items: [
      { title: 'Orders', url: '/admin/orders', icon: ShoppingCart },
      { title: 'Payouts', url: '/admin/payouts', icon: DollarSign },
      { title: 'Delivery', url: '/admin/delivery', icon: Truck },
    ],
  },
  {
    title: 'Platform',
    items: [
      { title: 'Themes', url: '/admin/themes', icon: Palette },
      { title: 'Settings', url: '/admin/settings', icon: Settings },
      { title: 'Security', url: '/admin/security', icon: Lock },
      { title: 'Domains', url: '/admin/domains', icon: Globe },
    ],
  },
]

export const AdminSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h2 className="font-bold text-lg">SellSphere</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>

        {adminMenuItems.map((group) => (
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
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
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