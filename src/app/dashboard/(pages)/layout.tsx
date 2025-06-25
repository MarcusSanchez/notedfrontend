import { ReactNode } from "react";
import { Viewport } from "next";

export const viewport: Viewport = {
  initialScale: 0.7,
};

export default function PagesLayout({ children }: { children: ReactNode }) {
  return children;
}

