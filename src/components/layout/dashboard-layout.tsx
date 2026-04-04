"use client";

import { useState } from "react";
import { TopBar } from "./top-bar";
import { Sidebar } from "./sidebar";
import type { SidebarItemType } from "@/lib/db/items";
import type { CollectionWithMeta } from "@/lib/db/collections";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItemTypes?: SidebarItemType[];
  sidebarCollections?: CollectionWithMeta[];
}

export function DashboardLayout({ children, sidebarItemTypes, sidebarCollections }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      setCollapsed((c) => !c);
    } else {
      setMobileOpen((o) => !o);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      <TopBar onToggleSidebar={handleToggle} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          itemTypes={sidebarItemTypes}
          collections={sidebarCollections}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
