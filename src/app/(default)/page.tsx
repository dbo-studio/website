export const metadata = {
  title: "Home - Simple",
  description: "Page description",
};

import Hero from "@/src/components/hero-home";
import BusinessCategories from "@/src/components/business-categories";
import FeaturesPlanet from "@/src/components/features-planet";
import LargeTestimonial from "@/src/components/large-testimonial";
import Cta from "@/src/components/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <BusinessCategories />
      <FeaturesPlanet />
      <LargeTestimonial />
      <Cta />
    </>
  );
}
