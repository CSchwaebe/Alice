import GameStateRedirect from "@/components/auth/GameStateRedirect";

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GameStateRedirect>{children}</GameStateRedirect>;
} 