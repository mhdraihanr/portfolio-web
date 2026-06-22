import { Hero } from "./_sections/hero";
import { About } from "./_sections/about";
import { Certificates } from "./_sections/certificates";
import { Projects } from "./_sections/projects";
import { Experience } from "./_sections/experience";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Certificates />
      <Projects />
      <Experience />
      {/* Other sections will be added here */}
    </>
  );
}
