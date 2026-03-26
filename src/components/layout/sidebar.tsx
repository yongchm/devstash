"use client";

import Link from "next/link";
import {
  Code,
  Sparkles,
  Terminal,
  FileText,
  File,
  ImageIcon,
  Link2,
  Star,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  mockUser,
  mockItemTypes,
  mockItemTypeCounts,
  mockCollections,
} from "@/lib/mock-data";

const TYPE_ICONS: Record<string, React.ElementType> = {
  type_snippet: Code,
  type_prompt: Sparkles,
  type_command: Terminal,
  type_note: FileText,
  type_file: File,
  type_image: ImageIcon,
  type_url: Link2,
};

const TYPE_SLUGS: Record<string, string> = {
  type_snippet: "snippets",
  type_prompt: "prompts",
  type_command: "commands",
  type_note: "notes",
  type_file: "files",
  type_image: "images",
  type_url: "links",
};

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}

function SidebarContent({
  collapsed,
  onClose,
}: {
  collapsed: boolean;
  onClose?: () => void;
}) {
  const [typesOpen, setTypesOpen] = useState(true);
  const [collectionsOpen, setCollectionsOpen] = useState(true);

  const favoriteCollections = mockCollections.filter((c) => c.isFavorite);
  const recentCollections = mockCollections.filter((c) => !c.isFavorite);

  return (
    <div className="flex flex-col h-full">
      {/* Mobile close button */}
      {onClose && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-border lg:hidden">
          <span className="text-sm font-semibold">DevStash</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {/* Types section */}
        <div>
          {!collapsed && (
            <button
              onClick={() => setTypesOpen((o) => !o)}
              className="flex items-center justify-between w-full px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Types</span>
              {typesOpen ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          {(typesOpen || collapsed) && (
            <ul className="mt-1 space-y-0.5">
              {mockItemTypes.map((type) => {
                const Icon = TYPE_ICONS[type.id] ?? File;
                const slug = TYPE_SLUGS[type.id] ?? type.name.toLowerCase();
                const count = mockItemTypeCounts[type.id] ?? 0;
                return (
                  <li key={type.id}>
                    <Link
                      href={`/items/${slug}`}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      <Icon
                        className="h-4 w-4 shrink-0"
                        style={{ color: type.color }}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{type.name}</span>
                          <span className="text-xs tabular-nums text-muted-foreground">
                            {count}
                          </span>
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Collections section */}
        {!collapsed && (
          <div>
            <button
              onClick={() => setCollectionsOpen((o) => !o)}
              className="flex items-center justify-between w-full px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Collections</span>
              {collectionsOpen ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>

            {collectionsOpen && (
              <div className="mt-1 space-y-3">
                {favoriteCollections.length > 0 && (
                  <div>
                    <p className="px-2 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground/50">
                      Favorites
                    </p>
                    <ul className="space-y-0.5">
                      {favoriteCollections.map((col) => (
                        <li key={col.id}>
                          <Link
                            href={`/collections/${col.id}`}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          >
                            <Star className="h-3 w-3 shrink-0 text-yellow-400 fill-yellow-400" />
                            <span className="flex-1 truncate">{col.name}</span>
                            <span className="text-xs tabular-nums text-muted-foreground">
                              {col.itemCount}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {recentCollections.length > 0 && (
                  <div>
                    <p className="px-2 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground/50">
                      All Collections
                    </p>
                    <ul className="space-y-0.5">
                      {recentCollections.map((col) => (
                        <li key={col.id}>
                          <Link
                            href={`/collections/${col.id}`}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          >
                            <span className="flex-1 truncate">{col.name}</span>
                            <span className="text-xs tabular-nums text-muted-foreground">
                              {col.itemCount}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* User area */}
      <div
        className={`border-t border-border p-3 flex items-center gap-3 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground shrink-0">
          {mockUser.name.charAt(0)}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-none truncate">
                {mockUser.name}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {mockUser.email}
              </p>
            </div>
            <button className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function Sidebar({ collapsed, mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-border bg-sidebar shrink-0 transition-[width] duration-200 overflow-hidden ${
          collapsed ? "w-14" : "w-60"
        }`}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-sidebar border-r border-border">
            <SidebarContent collapsed={false} onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
