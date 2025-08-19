import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Store, 
  BarChart3, 
  Package, 
  Palette, 
  MessageSquare, 
  Shield, 
  CreditCard, 
  Truck,
  Users,
  Settings,
  Zap,
  TrendingUp
} from "lucide-react";

const Features = () => {
  const superAdminFeatures = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Seller Management",
      description: "Onboard and manage sellers with comprehensive controls and monitoring"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Global Analytics",
      description: "Access seller orders, revenue, traffic, and performance insights"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Logistics Monitoring",
      description: "Track delivery partners, monitor delays, and optimize fulfillment"
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Platform Settings",
      description: "Configure domains, branding, themes, and system-wide preferences"
    }
  ];

  const sellerFeatures = [
    {
      icon: <Package className="h-6 w-6" />,
      title: "Order & Fulfillment",
      description: "Complete order management with processing, returns, refunds, and NDR automation"
    },
    {
      icon: <Store className="h-6 w-6" />,
      title: "Inventory Management",
      description: "Stock alerts, catalog sync, and automated inventory tracking"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Theme Builder",
      description: "50+ responsive themes with customization and instant go-live capabilities"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Marketing & Analytics",
      description: "Meta Ads, Google Ads, GA4 integration with cost-per-order insights"
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Secure Payments",
      description: "Payout dashboard with fraud protection and OTP security"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "WhatsApp Automation",
      description: "Cart recovery, upsells, order tracking, and customer engagement"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-accent px-4 py-2 rounded-full mb-6">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-accent-foreground">
              Powerful Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <br />
            <span className="text-primary">Scale Your Business</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From seller onboarding to advanced analytics, our platform provides all the tools needed for successful eCommerce operations.
          </p>
        </div>

        {/* Super Admin Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Super Admin Panel
            </h3>
            <p className="text-muted-foreground">
              Complete platform oversight and management capabilities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {superAdminFeatures.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-smooth group">
                <CardHeader className="pb-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-smooth">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Seller Features */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Seller Dashboard
            </h3>
            <p className="text-muted-foreground">
              All-in-one tools for sellers to manage and grow their business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerFeatures.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-smooth group">
                <CardHeader className="pb-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-smooth">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;