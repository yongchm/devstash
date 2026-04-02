import prisma from "@/lib/prisma";

export interface CollectionWithMeta {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  typeNames: string[];       // unique item type names present in the collection
  dominantTypeName: string | null; // most-used item type — drives border color
}

export async function getCollectionsWithMeta(userId: string): Promise<CollectionWithMeta[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          item: { include: { itemType: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return collections.map((col) => {
    const typeCounts: Record<string, number> = {};
    for (const { item } of col.items) {
      const name = item.itemType.name;
      typeCounts[name] = (typeCounts[name] ?? 0) + 1;
    }

    const typeNames = Object.keys(typeCounts);
    const dominantTypeName =
      typeNames.sort((a, b) => typeCounts[b] - typeCounts[a])[0] ?? null;

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      itemCount: col.items.length,
      typeNames,
      dominantTypeName,
    };
  });
}
