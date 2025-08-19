import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              © 2024 SellSphere. All rights reserved. | 
              <a href="#" className="hover:text-primary transition-smooth"> Privacy Policy</a> | 
              <a href="#" className="hover:text-primary transition-smooth"> Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;