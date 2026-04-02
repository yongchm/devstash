"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MoreHorizontal } from "lucide-react";
import { getTypeMetaByName } from "@/lib/item-type-meta";
import type { CollectionWithMeta } from "@/lib/db/collections";

interface CollectionCardProps {
  collection: CollectionWithMeta;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const borderColor = collection.dominantTypeName
    ? getTypeMetaByName(collection.dominantTypeName).color
    : undefined;

  return (
    <Card
      className="flex flex-col hover:border-border/60 transition-colors"
      style={borderColor ? { borderColor: `${borderColor}55` } : undefined}
    >
      <CardHeader className="pb-2 flex-row items-start justify-between space-y-0">
        <CardTitle className="flex items-center gap-1.5 text-sm font-medium min-w-0">
          <span className="truncate">{collection.name}</span>
          {collection.isFavorite && (
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
          )}
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 -mt-1 -mr-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 flex-1">
        <p className="text-xs text-muted-foreground">{collection.itemCount} items</p>

        {collection.description && (
          <p className="text-xs text-muted-foreground/70 line-clamp-2">
            {collection.description}
          </p>
        )}

        {collection.typeNames.length > 0 && (
          <div className="flex items-center gap-1.5 mt-auto pt-1">
            {collection.typeNames.map((name) => {
              const { icon: Icon, color } = getTypeMetaByName(name);
              return (
                <div
                  key={name}
                  className="h-6 w-6 rounded flex items-center justify-center bg-muted"
                >
                  <Icon className="h-3.5 w-3.5" style={{ color }} />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
