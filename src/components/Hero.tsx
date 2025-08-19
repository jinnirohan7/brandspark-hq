import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Shield, Zap, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import heroImage from "@/assets/hero-dashboard.jpg";

const Hero = () => {
  const navigate = useNavigate();

  const handleStartTrial = () => {
    navigate("/register");
  };

  const handleWatchDemo = () => {
    toast.info("Demo feature coming soon! Sign up to be notified.");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-accent px-4 py-2 rounded-full mb-6">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">
                Launch Your Store in Minutes
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Complete eCommerce
              <br />
              <span className="bg-gradient-to-r from-primary-glow to-primary bg-clip-text text-transparent">
                Platform for Sellers
              </span>
            </h1>
            
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0">
              Launch premium eCommerce websites, manage orders, automate marketing, 
              and scale your business with our all-in-one seller platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button 
                variant="hero" 
                size="xl" 
                className="group"
                onClick={handleStartTrial}
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="premium" 
                size="xl" 
                className="group"
                onClick={handleWatchDemo}
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 text-primary-foreground/60">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Bank-grade Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">99.9% Uptime</span>
              </div>
            </div>
          </div>
          
          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-gradient-card rounded-2xl shadow-large p-4 transform rotate-3 hover:rotate-0 transition-bounce">
              <img
                src={heroImage}
                alt="SellSphere Dashboard Preview"
                className="w-full h-auto rounded-lg shadow-medium"
              />
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-glow">
                Live Demo
              </div>
            </div>
            
            {/* Floating Stats Cards */}
            <div className="absolute -left-8 top-1/4 bg-card p-4 rounded-lg shadow-medium border border-border/50 backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary">$2.4M</div>
              <div className="text-sm text-muted-foreground">Monthly Revenue</div>
            </div>
            
            <div className="absolute -right-8 bottom-1/4 bg-card p-4 rounded-lg shadow-medium border border-border/50 backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-muted-foreground">Active Sellers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;