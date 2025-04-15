import "./globals.css";
import type { Metadata } from "next";
import { Balsamiq_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "@/components/convexClientProvider";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const balsamiq = Balsamiq_Sans({
  weight: ["400", "700"],
  style: ["italic", "normal"],
  display: "auto",
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${balsamiq.className} antialiased min-h-screen`}>
        <SessionProvider>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider defaultOpen={false}>
                <AppSidebar />
                <div className="w-full h-full relative">{children}</div>
              </SidebarProvider>
            </ThemeProvider>
          </ConvexClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
