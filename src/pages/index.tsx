import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FeaturedEquipment } from "@/components/FeaturedEquipment";
import { HowItWorks } from "@/components/HowItWorks";
import { SEO } from "@/components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="EquipRent - Nigeria's #1 Equipment & Tools Rental Marketplace"
        description="Rent professional equipment and tools from verified vendors across Nigeria. Construction, events, photography, and more. Book instantly with secure payments."
        url="https://equiprent.ng"
      />
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <CategoryGrid />
          <FeaturedEquipment />
          <HowItWorks />
        </main>
      </div>
    </>
  );
}