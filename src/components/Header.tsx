import { Button } from "@/components/ui/button";
import { Store, Menu, X, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Signed out successfully");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleStartTrial = () => {
    navigate("/start-free-trial");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={handleLogoClick}
          >
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Store className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">
              SellSphere
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-smooth">
              Pricing
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-smooth">
              About
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-smooth">
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="hidden sm:inline-flex"
                  onClick={handleDashboard}
                >
                  Dashboard
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleDashboard}>
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="hidden sm:inline-flex"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
                <Button 
                  variant="cta" 
                  size="sm"
                  onClick={handleStartTrial}
                >
                  Start Free Trial
                </Button>
              </>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-muted-foreground hover:text-foreground transition-smooth">
                Features
              </a>
              <a href="#pricing" className="block text-muted-foreground hover:text-foreground transition-smooth">
                Pricing
              </a>
              <a href="#about" className="block text-muted-foreground hover:text-foreground transition-smooth">
                About
              </a>
              <a href="#contact" className="block text-muted-foreground hover:text-foreground transition-smooth">
                Contact
              </a>
              <div className="border-t border-border pt-3 space-y-2">
                {user ? (
                  <>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={handleDashboard}
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={handleSignIn}
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="cta" 
                      className="w-full"
                      onClick={handleStartTrial}
                    >
                      Start Free Trial
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;