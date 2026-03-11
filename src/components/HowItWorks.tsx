import { Card } from "@/components/ui/card";
import { Search, Calendar, Package, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Search",
    description: "Find the perfect equipment from thousands of verified listings across Nigeria",
    step: 1,
  },
  {
    icon: Calendar,
    title: "Book Instantly",
    description: "Select your dates, review terms, and confirm your booking in minutes",
    step: 2,
  },
  {
    icon: Package,
    title: "Pick Up or Deliver",
    description: "Choose convenient pickup or request delivery directly to your location",
    step: 3,
  },
  {
    icon: CheckCircle,
    title: "Use & Return",
    description: "Complete your project and return the equipment on time for full refund guarantee",
    step: 4,
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
      <div className="container-wide px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Get started in 4 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative">
                <Card className="p-6 h-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-xl mb-2">
                        {step.title}
                      </h3>
                      <p className="text-primary-foreground/70 text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
                
                {/* Connector Line */}
                {step.step < 4 && (
                  <div className="hidden lg:block absolute top-16 left-full w-8 h-0.5 bg-white/20" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}