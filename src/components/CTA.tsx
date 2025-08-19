import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const CTA = () => {
  const benefits = [
    "14-day free trial",
    "No setup fees",
    "24/7 support",
    "Cancel anytime"
  ];

  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-primary-glow to-primary bg-clip-text text-transparent">
              eCommerce Business?
            </span>
          </h2>
          
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of sellers who are already scaling their businesses with SellSphere. 
            Start your free trial today and see the difference.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-primary-foreground/80">
                <CheckCircle className="h-5 w-5 text-primary-glow" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" className="group">
              Start Free Trial Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="premium" size="xl">
              Schedule Demo
            </Button>
          </div>
          
          <p className="text-sm text-primary-foreground/60 mt-6">
            No credit card required • Setup in under 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;