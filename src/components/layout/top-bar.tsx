"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

export function TopBar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-4">
      <div className="flex items-center gap-2 font-semibold text-foreground">
        <span className="text-lg">DevStash</span>
      </div>

      <div className="flex flex-1 items-center gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-8 bg-muted border-0 focus-visible:ring-1"
          />
        </div>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 text-xs text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm">
          New Collection
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Item
        </Button>
      </div>
    </header>
  );
}
