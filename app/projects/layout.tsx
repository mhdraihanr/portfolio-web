import { Footer, BackToTop } from "@/components/shared";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="min-h-screen">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
