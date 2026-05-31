import { Hero } from "./components/hero";
import { About } from "./components/about";
import { LazyHomeClientSections } from "./components/lazy-home-client-sections";
import { Projects } from "./components/projects";
import { Experience } from "./components/experience";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <LazyHomeClientSections />
      <Projects />
      <Experience />
      {/* Other sections will be added here */}
    </>
  );
}
