export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Override parent layout - no sidebar for login page
  return <>{children}</>;
}
