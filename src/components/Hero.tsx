import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Shield, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <div className="container-wide px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                Nigeria's #1 Equipment Rental Platform
              </div>
              
              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight">
                Rent Professional Equipment{" "}
                <span className="text-secondary">Anytime, Anywhere</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Access thousands of verified tools and equipment from trusted vendors. 
                From construction to events, find everything you need to get the job done.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2 p-2 bg-card rounded-xl border shadow-lg max-w-2xl">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="What equipment are you looking for?"
                  className="border-0 focus-visible:ring-0 px-0"
                />
              </div>
              <Button className="btn-action">
                Search
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold">5,000+</div>
                  <div className="text-sm text-muted-foreground">Verified Vendors</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">50,000+</div>
                  <div className="text-sm text-muted-foreground">Items Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Grid */}
          <div className="relative grid grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-4 lg:space-y-6">
              <img
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop"
                alt="Construction Equipment"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop"
                alt="Power Tools"
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="space-y-4 lg:space-y-6 pt-8">
              <img
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop"
                alt="Heavy Machinery"
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop"
                alt="Event Equipment"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}