import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Pin } from "lucide-react";
import { getTypeMeta, formatDate } from "@/lib/item-type-meta";
import { mockItems } from "@/lib/mock-data";

interface ItemRowProps {
  item: (typeof mockItems)[number];
  showPin?: boolean;
}

export function ItemRow({ item, showPin }: ItemRowProps) {
  const { icon: Icon, color } = getTypeMeta(item.typeId);

  return (
    <Card
      className="hover:bg-accent/30 transition-colors"
      style={{ borderLeftColor: color, borderLeftWidth: "3px" }}
    >
      <CardContent className="flex items-start gap-3 p-3">
        <div
          className="h-8 w-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-foreground truncate">
              {item.title}
            </span>
            {item.isFavorite && (
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 shrink-0" />
            )}
            {showPin && item.isPinned && (
              <Pin className="h-3 w-3 text-muted-foreground shrink-0" />
            )}
          </div>

          {item.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {item.description}
            </p>
          )}

          {item.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
          {formatDate(item.createdAt)}
        </span>
      </CardContent>
    </Card>
  );
}
