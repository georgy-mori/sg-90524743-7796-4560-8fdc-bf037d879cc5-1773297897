import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Shield, Zap, CheckCircle2, ArrowRight, Play } from "lucide-react";

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/browse");
    }
  };

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">
              <TrendingUp className="w-4 h-4" />
              Nigeria's #1 Equipment Rental Platform
            </div>
            
            {/* Heading */}
            <div className="space-y-4">
              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
                Rent Professional Equipment{" "}
                <span className="text-secondary bg-gradient-to-r from-secondary to-orange-600 bg-clip-text text-transparent">
                  Anytime, Anywhere
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Access thousands of verified tools and equipment from trusted vendors. 
                From construction to events, find everything you need to get the job done.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative group">
              <div className="flex gap-2 p-2 bg-white rounded-2xl border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 max-w-2xl">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <Input
                    placeholder="What equipment are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 focus-visible:ring-0 px-0 text-base"
                  />
                </div>
                <Button 
                  type="submit"
                  className="bg-secondary hover:bg-secondary/90 shadow-md hover:shadow-lg transition-all duration-300 px-8"
                  size="lg"
                >
                  Search
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => router.push("/browse")}
              >
                Browse Equipment
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-slate-200 hover:border-primary hover:text-primary shadow-md hover:shadow-lg transition-all duration-300 group"
                onClick={() => router.push("/auth/register?type=vendor")}
              >
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Become a Vendor
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
              <div className="flex items-start gap-3 group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-xl">5,000+</div>
                  <div className="text-sm text-muted-foreground">Verified Vendors</div>
                </div>
              </div>
              <div className="flex items-start gap-3 group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-xl">50,000+</div>
                  <div className="text-sm text-muted-foreground">Items Available</div>
                </div>
              </div>
              <div className="flex items-start gap-3 group cursor-default col-span-2 lg:col-span-1">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-bold text-xl">100%</div>
                  <div className="text-sm text-muted-foreground">Secure Payments</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Grid */}
          <div className="relative">
            {/* Main Featured Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop"
                alt="Construction Equipment"
                className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Floating Stats Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">₦15,000</div>
                    <div className="text-sm text-muted-foreground">Starting from /day</div>
                  </div>
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90">
                    View Details
                  </Button>
                </div>
              </div>
            </div>

            {/* Grid of smaller images */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop"
                  alt="Power Tools"
                  className="w-full h-32 object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop"
                  alt="Heavy Machinery"
                  className="w-full h-32 object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop"
                  alt="Event Equipment"
                  className="w-full h-32 object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse delay-500" />
          </div>
        </div>
      </div>

      {/* Add subtle animation CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </section>
  );
}