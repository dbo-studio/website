export const metadata = {
  title: "Home - Simple",
  description: "Page description",
};

import Features from "./components/Features";
import Hero from "./components/HeroHome";
import Databases from "./components/Databases";

export default function Home() {
  return (
    <>
      <Hero />
      <Databases />
      <Features />
    </>
  );
}
