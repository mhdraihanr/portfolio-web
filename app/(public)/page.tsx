import { Hero, About, Certificates, Projects, Experience } from "./components";

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
