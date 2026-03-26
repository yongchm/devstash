import { TopBar } from "@/components/layout/top-bar";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      <TopBar />
      <div className="flex flex-1">
        <aside className="w-60 border-r border-border p-4">
          <h2 className="text-foreground font-semibold">Sidebar</h2>
        </aside>
        <main className="flex-1 p-6">
          <h2 className="text-foreground font-semibold">Main</h2>
        </main>
      </div>
    </div>
  );
}
