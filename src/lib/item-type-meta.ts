import {
  Code,
  Sparkles,
  Terminal,
  FileText,
  File,
  ImageIcon,
  Link2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TypeMeta {
  icon: LucideIcon;
  color: string;
}

// Keyed by mock IDs — used by existing mock-data sections
export const TYPE_META: Record<string, TypeMeta> = {
  type_snippet: { icon: Code, color: "#a78bfa" },
  type_prompt: { icon: Sparkles, color: "#60a5fa" },
  type_command: { icon: Terminal, color: "#34d399" },
  type_note: { icon: FileText, color: "#fbbf24" },
  type_file: { icon: File, color: "#f472b6" },
  type_image: { icon: ImageIcon, color: "#fb923c" },
  type_url: { icon: Link2, color: "#94a3b8" },
};

// Keyed by DB item type name — used by real DB data
export const TYPE_META_BY_NAME: Record<string, TypeMeta> = {
  snippet: { icon: Code,      color: "#3b82f6" },
  prompt:  { icon: Sparkles,  color: "#8b5cf6" },
  command: { icon: Terminal,  color: "#f97316" },
  note:    { icon: FileText,  color: "#fde047" },
  file:    { icon: File,      color: "#6b7280" },
  image:   { icon: ImageIcon, color: "#ec4899" },
  link:    { icon: Link2,     color: "#10b981" },
};


export function getTypeMetaByName(name: string): TypeMeta {
  return TYPE_META_BY_NAME[name] ?? { icon: File, color: "#94a3b8" };
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
