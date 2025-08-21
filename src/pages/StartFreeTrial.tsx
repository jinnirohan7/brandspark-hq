import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star, TrendingUp, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const StartFreeTrial = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const features = [
    "Complete inventory management",
    "Order tracking & analytics", 
    "Customer management",
    "Multi-channel integration",
    "Business reports & insights",
    "24/7 customer support"
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "TechStore India",
      rating: 5,
      comment: "SellSphere helped us increase our sales by 300% in just 6 months!"
    },
    {
      name: "Priya Sharma",
      company: "Fashion Hub",
      rating: 5,
      comment: "The inventory management is a game-changer. We never run out of stock now."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.companyName
      );

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created successfully! Please check your email to verify your account.");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Start Your <span className="text-primary">Free Trial</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of successful sellers and transform your eCommerce business today
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Form */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Create Your Account</CardTitle>
                <CardDescription>
                  Start your 14-day free trial - no credit card required
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Creating Account..." : "Start Free Trial"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Button variant="link" onClick={() => navigate("/login")} className="p-0">
                      Sign in here
                    </Button>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Right Side - Benefits */}
            <div className="space-y-8">
              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">300%</div>
                    <p className="text-sm text-muted-foreground">Average sales increase</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">24/7</div>
                    <p className="text-sm text-muted-foreground">Expert support</p>
                  </CardContent>
                </Card>
              </div>

              {/* Testimonials */}
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm mb-2">"{testimonial.comment}"</p>
                      <div className="text-xs text-muted-foreground">
                        <strong>{testimonial.name}</strong> - {testimonial.company}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartFreeTrial;