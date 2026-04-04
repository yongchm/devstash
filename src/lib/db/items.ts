import prisma from "@/lib/prisma";

export interface ItemWithMeta {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  typeName: string;
  tags: string[];
}

export interface ItemStats {
  totalItems: number;
  favoriteItemsCount: number;
}

export async function getPinnedItems(userId: string): Promise<ItemWithMeta[]> {
  const items = await prisma.item.findMany({
    where: { userId, isPinned: true },
    include: { itemType: true, tags: true },
    orderBy: { updatedAt: "desc" },
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    typeName: item.itemType.name,
    tags: item.tags.map((t) => t.name),
  }));
}

export async function getRecentItems(userId: string, limit = 10): Promise<ItemWithMeta[]> {
  const items = await prisma.item.findMany({
    where: { userId },
    include: { itemType: true, tags: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    typeName: item.itemType.name,
    tags: item.tags.map((t) => t.name),
  }));
}

export async function getItemStats(userId: string): Promise<ItemStats> {
  const [totalItems, favoriteItemsCount] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
  ]);

  return { totalItems, favoriteItemsCount };
}

export interface SidebarItemType {
  name: string;
  count: number;
}

export async function getItemTypesWithCounts(userId: string): Promise<SidebarItemType[]> {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    include: {
      items: {
        where: { userId },
        select: { id: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return types.map((t) => ({
    name: t.name,
    count: t.items.length,
  }));
}
