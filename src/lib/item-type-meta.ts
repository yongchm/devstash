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

export const TYPE_META: Record<string, TypeMeta> = {
  type_snippet: { icon: Code, color: "#a78bfa" },
  type_prompt: { icon: Sparkles, color: "#60a5fa" },
  type_command: { icon: Terminal, color: "#34d399" },
  type_note: { icon: FileText, color: "#fbbf24" },
  type_file: { icon: File, color: "#f472b6" },
  type_image: { icon: ImageIcon, color: "#fb923c" },
  type_url: { icon: Link2, color: "#94a3b8" },
};

export function getTypeMeta(typeId: string): TypeMeta {
  return TYPE_META[typeId] ?? { icon: File, color: "#94a3b8" };
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
