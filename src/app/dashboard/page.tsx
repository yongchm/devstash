import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { CollectionCard } from "@/components/dashboard/collection-card";
import { ItemRow } from "@/components/dashboard/item-row";
import { mockItems, mockItemTypeCounts } from "@/lib/mock-data";
import { getCollectionsWithMeta } from "@/lib/db/collections";
import prisma from "@/lib/prisma";
import { Package, FolderOpen, Heart, Star, Pin } from "lucide-react";
import Link from "next/link";

// ── Mock-data sections (items/stats — replaced in later phases) ───────────────

const totalItems = Object.values(mockItemTypeCounts).reduce((a, b) => a + b, 0);
const favoriteItemsCount = mockItems.filter((i) => i.isFavorite).length;

const pinnedItems = mockItems.filter((i) => i.isPinned);
const recentItems = [...mockItems]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 10);

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  // Resolve demo user — replaced with session lookup once auth is wired
  const user = await prisma.user.findUnique({ where: { email: "demo@devstash.io" } });
  const collections = user ? await getCollectionsWithMeta(user.id) : [];

  const favoriteCollectionsCount = collections.filter((c) => c.isFavorite).length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your developer knowledge hub</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Items" value={totalItems} icon={Package} />
          <StatCard label="Collections" value={collections.length} icon={FolderOpen} />
          <StatCard label="Favorite Items" value={favoriteItemsCount} icon={Heart} />
          <StatCard label="Favorite Collections" value={favoriteCollectionsCount} icon={Star} />
        </div>

        {/* Collections — real DB data */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Collections</h2>
            <Link
              href="/collections"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {collections.map((col) => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        </section>

        {/* Pinned Items */}
        {pinnedItems.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Pin className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold text-foreground">Pinned</h2>
            </div>
            <div className="space-y-2">
              {pinnedItems.map((item) => (
                <ItemRow key={item.id} item={item} showPin />
              ))}
            </div>
          </section>
        )}

        {/* Recent Items */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-4">Recent Items</h2>
          <div className="space-y-2">
            {recentItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
