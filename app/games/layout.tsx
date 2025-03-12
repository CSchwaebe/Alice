import RouteGuard from "@/components/auth/RouteGuard";

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard>{children}</RouteGuard>;
} 