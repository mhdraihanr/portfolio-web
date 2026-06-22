import { Container } from "@/components/shared";

export function generateMetadata() {
  return { title: "404 - Page Not Found" };
}

export default function NotFound() {
  return (
    <Container
      size="md"
      className="min-h-[60vh] flex flex-col items-center justify-center text-center"
    >
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Back to Home
      </a>
    </Container>
  );
}
