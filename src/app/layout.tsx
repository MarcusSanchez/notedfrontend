import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "next-themes";
import ReactQueryProvider from "@/lib/tools/QueryClientProvider";
import { ReactNode } from "react";

import "./globals.css";
import Init from "@/app/init";
import Footer from "@/components/layout/Footer";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Noted",
  description: "An AI-powered home health care note-taking app",
};

export default function RootLayout({ children, }: Readonly<{ children: ReactNode }>) {
  const hasSession = cookies().has("has-session");

  return (
    <html lang="en">
      <body>
        <div className="max-w-[1560px] px-4 mx-auto">
          <ReactQueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
              <Navbar hasSession={hasSession} />
              <Init hasSession={hasSession}>
                {children}
              </Init>
              <Footer />
            </ThemeProvider>
          </ReactQueryProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
