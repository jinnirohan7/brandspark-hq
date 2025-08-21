import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, Video, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ScheduleDemo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    phone: "",
    businessType: "",
    currentPlatform: "",
    teamSize: "",
    preferredTime: "",
    timeZone: "",
    message: ""
  });

  const businessTypes = [
    "Fashion & Apparel",
    "Electronics",
    "Home & Garden", 
    "Beauty & Personal Care",
    "Sports & Fitness",
    "Books & Media",
    "Automotive",
    "Other"
  ];

  const platforms = [
    "Amazon",
    "Flipkart", 
    "Myntra",
    "Nykaa",
    "Shopify",
    "WooCommerce",
    "Magento",
    "Other"
  ];

  const teamSizes = [
    "1-5 employees",
    "6-20 employees", 
    "21-50 employees",
    "51-100 employees",
    "100+ employees"
  ];

  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM", 
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM"
  ];

  const benefits = [
    "Personalized product walkthrough",
    "Custom solution recommendations",
    "ROI calculator for your business",
    "Implementation roadmap",
    "Exclusive demo pricing"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Demo scheduled successfully! We'll send you a calendar invite shortly.");
      navigate("/");
    } catch (error) {
      toast.error("Failed to schedule demo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Schedule Your <span className="text-primary">Personal Demo</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how SellSphere can transform your eCommerce business with a personalized demo
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Form */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  Book Your Demo
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll schedule a 30-minute personalized demo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
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
                      <Label htmlFor="email">Email Address *</Label>
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select value={formData.businessType} onValueChange={(value) => handleSelectChange("businessType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentPlatform">Current Platform</Label>
                      <Select value={formData.currentPlatform} onValueChange={(value) => handleSelectChange("currentPlatform", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms.map((platform) => (
                            <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="teamSize">Team Size</Label>
                      <Select value={formData.teamSize} onValueChange={(value) => handleSelectChange("teamSize", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamSizes.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferredTime">Preferred Time</Label>
                      <Select value={formData.preferredTime} onValueChange={(value) => handleSelectChange("preferredTime", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your current challenges or specific features you're interested in..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Scheduling Demo..." : "Schedule My Demo"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Need immediate assistance?{" "}
                    <Button variant="link" onClick={() => navigate("/start-free-trial")} className="p-0">
                      Start your free trial instead
                    </Button>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Right Side - Benefits */}
            <div className="space-y-8">
              {/* Demo Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" />
                    What to Expect
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>30-minute personalized session</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span>One-on-one with a product expert</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-muted-foreground" />
                      <span>Live screen sharing via Zoom/Teams</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Demo Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Customer Quote */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="pt-6">
                  <blockquote className="text-lg italic mb-4">
                    "The demo showed us exactly how SellSphere could solve our inventory management nightmares. We signed up immediately!"
                  </blockquote>
                  <div className="text-sm text-muted-foreground">
                    <strong>Amit Patel</strong> - CEO, ElectroMart
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground text-center">
                    <p>🔒 Your information is secure and will never be shared</p>
                    <p>📧 We'll only use your email to send demo details</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDemo;