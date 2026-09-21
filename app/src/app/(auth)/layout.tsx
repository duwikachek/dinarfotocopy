export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[hsl(220,14%,96%)] flex items-center justify-center px-4">
      {children}
    </div>
  );
}
